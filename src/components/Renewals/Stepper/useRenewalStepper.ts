import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';

import { StepItem } from 'components/common/Stepper';
import {
  areAllRenewalStepsComplete,
  getResolvedRenewalStep,
  mapRenewalSteppersForDisplay,
  resolveShortTermRenewalRoute,
} from 'components/ContractRenewal/ShortTermRenewal/resolveShortTermRenewalRoute';

const STEP_ROUTES: Record<number, { default: string; allowed: string[] }> = {
  1: {
    default: '/contract-renewal/review-proposal',
    allowed: ['/contract-renewal/review-proposal', '/contract-renewal/short-term'],
  },
  2: {
    default: '/contract-renewal/payment-plan',
    allowed: [
      '/contract-renewal/payment-plan',
      '/contract-renewal/short-term',
      '/contract-renewal/pay-renewal',
      '/contract-renewal/cheque-payment',
      '/contract-renewal/direct-debit-form',
      '/contract-renewal/upload-documents',
      '/contract-renewal/sign-contract',
      '/contract-renewal/schedule-pickup',
      '/contract-renewal/collection-scheduled',
      '/contract-renewal/',
    ],
  },
  3: {
    default: '/contract-renewal/sign-contract',
    allowed: [
      '/contract-renewal/upload-documents',
      '/contract-renewal/sign-contract',
      '/contract-renewal/schedule-pickup',
      '/contract-renewal/collection-scheduled',
    ],
  },
  4: {
    default: '/contract-renewal/collection-scheduled',
    allowed: [
      '/contract-renewal/collection-scheduled',
      '/contract-renewal/summary',
      '/contract-renewal/schedule-pickup',
    ],
  },
};

function isPathWithinStep(path: string, step: number): boolean {
  const routes = STEP_ROUTES[step];
  if (!routes) return false;
  return routes.allowed.some((allowedPath) => path === allowedPath);
}

export default function useRenewalStepper(autoLoad = true) {
  const { tCode } = useUserStore();
  const { openModal } = useUIStore();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [steppers, setSteppers] = useState<StepItem[]>([]);
  const [stepperAPIData, setStepperAPIData] = useState<any>(null);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const isRedirectingRef = useRef(false);

  const { mutate: getStepperStates, isPending: isLoadingStepperData } = useApiMutation<any, any>(
    () => `/ContractRenewal/Stepper/${tCode}`,
    'GET',
    showLoader
  );

  const loadContractRenewalStepper = (loader: boolean = false) => {
    setShowLoader(loader);
    getStepperStates(null, {
      onSuccess: (stepperResponse) => {
        if (!stepperResponse?.Steppers?.length) return;

        setStepperAPIData(stepperResponse);
        setSteppers(mapRenewalSteppersForDisplay(stepperResponse));

        const resolvedStep = getResolvedRenewalStep(stepperResponse);
        setCurrentStep(resolvedStep);

        if (!router.isReady) return;
        if (isRedirectingRef.current) return;

        const currentPath = router.asPath.split('?')[0].split('#')[0];
        const allStepsComplete = areAllRenewalStepsComplete(stepperResponse);

        let targetRoute = allStepsComplete
          ? '/contract-renewal/summary'
          : STEP_ROUTES[resolvedStep]?.default;

        if (resolvedStep === 3 && !allStepsComplete) {
          targetRoute = stepperResponse?.AnyDocFailed
            ? '/contract-renewal/upload-documents'
            : '/contract-renewal/sign-contract';
        }

        const shortTermRoute = resolveShortTermRenewalRoute(
          stepperResponse,
          resolvedStep,
          allStepsComplete
        );
        if (shortTermRoute) {
          targetRoute = shortTermRoute;
        }

        if (!targetRoute) return;
        if (isPathWithinStep(currentPath, resolvedStep)) return;
        if (currentPath === targetRoute) return;

        isRedirectingRef.current = true;
        router.replace(targetRoute).finally(() => {
          isRedirectingRef.current = false;
        });
      },
      onError: () => openModal('error-modal'),
    });
  };

  useEffect(() => {
    if (!autoLoad || !tCode) return;
    loadContractRenewalStepper();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tCode, autoLoad]);

  return {
    steppers,
    currentStep,
    stepperAPIData,
    loadContractRenewalStepper,
    isLoadingStepperData,
  };
}
