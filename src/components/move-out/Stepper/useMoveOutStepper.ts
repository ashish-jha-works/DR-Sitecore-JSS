import { StepItem } from 'components/common/Stepper';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';
import {
  getCachedHasMoveOutUtilities,
  hasMoveOutUtilities,
  mapApiStepToDisplayStep,
  mapSteppersForDisplay,
  MOVE_OUT_API_STEPS,
  setCachedHasMoveOutUtilities,
} from './moveOutNoUtilities';

export default function useMoveOutStepper(autoLoad = true) {
  const { tCode } = useUserStore();
  const { openModal } = useUIStore();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [steppers, setSteppers] = useState<StepItem[]>([]);
  const [hasUtilities, setHasUtilities] = useState<boolean | null>(() =>
    getCachedHasMoveOutUtilities(tCode)
  );
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [isResolvingRoute, setIsResolvingRoute] = useState(false);

  const { mutate: getStepperStates, isPending: isLoadingStepperData } = useApiMutation<any, any>(
    () => `/MoveOut/Stepper/${tCode}`,
    'GET',
    showLoader
  );

  const { mutate: getAllUtilities } = useApiMutation<any, any>(
    () => `/Community/Utilities/${tCode}`,
    'GET',
    false
  );

  const { mutate: updateStepper } = useApiMutation<any, any>(
    () => `/MoveOut/UpdateStepper`,
    'POST',
    true
  );

  const skipUtilitiesAndGoToPermit = () => {
    updateStepper(
      {
        ProfileId: tCode,
        IsUtilityTerminationPageVisited: true,
        UserState: MOVE_OUT_API_STEPS.UTILITIES_TERMINATION,
      },
      {
        onSuccess: (stepperRes) => {
          if (stepperRes?.Status === 'Success' || stepperRes?.Code === 200) {
            router.push(`/move-out/move-out-permit`);
            return;
          }
          openModal('error-modal');
        },
        onError: () => openModal('error-modal'),
      }
    );
  };

  const skipFinalDocsAndGoToRefund = () => {
    updateStepper(
      {
        ProfileId: tCode,
        IsFinalDocPageVisited: true,
      },
      {
        onSuccess: (stepperRes) => {
          if (stepperRes?.Status === 'Success' || stepperRes?.Code === 200) {
            router.push(`/move-out/refund-in-progress`);
            return;
          }
          openModal('error-modal');
        },
        onError: () => openModal('error-modal'),
      }
    );
  };

  const applyStepperResponse = (response: any, utilitiesPresent: boolean) => {
    if (!tCode) {
      setIsResolvingRoute(false);
      return;
    }

    setCachedHasMoveOutUtilities(tCode, utilitiesPresent);
    setHasUtilities(utilitiesPresent);

    const steppersItem: StepItem[] = [];
    response?.Steppers?.forEach((item: any) => {
      steppersItem.push({
        step: Number(item.Id),
        name: item.Description,
        back_stepping: item.BackAllowed,
        stepDone: item.StepCompleted,
      });
    });

    setSteppers(mapSteppersForDisplay(steppersItem, utilitiesPresent));

    if (!response?.Steppers?.length) {
      setIsResolvingRoute(false);
      return;
    }

    let apiStep = 0;
    for (const item of response.Steppers) {
      if (item.StepCompleted) continue;
      apiStep = Number(item.Id);
      setCurrentStep(mapApiStepToDisplayStep(apiStep, utilitiesPresent));
      break;
    }

    if (!apiStep) {
      setIsResolvingRoute(false);
      return;
    }

    switch (apiStep) {
      case MOVE_OUT_API_STEPS.BANK_DETAILS:
        router.push(`/move-out/bank-details`);
        break;
      case MOVE_OUT_API_STEPS.UTILITIES_TERMINATION:
        if (!utilitiesPresent) {
          skipUtilitiesAndGoToPermit();
        } else if (!response.IsUtilityTerminationPageVisited) {
          router.push(`/move-out/terminate-utilities`);
        } else {
          router.push(`/move-out/upload-documents`);
        }
        break;
      case MOVE_OUT_API_STEPS.MOVE_OUT_PERMIT:
        router.push(`/move-out/move-out-permit`);
        break;
      case MOVE_OUT_API_STEPS.SCHEDULE_INSPECTION:
        router.push(`/move-out/schedule-inspection`);
        break;
      case MOVE_OUT_API_STEPS.FINAL_DOCUMENTS:
        if (!utilitiesPresent) {
          if (!response.IsFinalDocPageVisited) {
            skipFinalDocsAndGoToRefund();
          } else {
            router.push(`/move-out/refund-in-progress`);
          }
        } else if (!response.IsFinalDocPageVisited) {
          router.push(`/move-out/refund-in-progress`);
        } else {
          router.push(`/move-out/upload-final-docs`);
        }
        break;
      default:
        break;
    }
    setIsResolvingRoute(false);
  };

  const loadMoveOutStepper = (loader: boolean = false) => {
    setShowLoader(loader);
    setIsResolvingRoute(true);
    getStepperStates(null, {
      onSuccess: (response: any) => {
        if (!response) {
          setIsResolvingRoute(false);
          return;
        }

        const cached = getCachedHasMoveOutUtilities(tCode);
        if (cached !== null) {
          applyStepperResponse(response, cached);
          return;
        }

        getAllUtilities(null, {
          onSuccess: (utilitiesRes) => {
            applyStepperResponse(response, hasMoveOutUtilities(utilitiesRes));
          },
          onError: () => {
            // Fail closed: keep full 5-step flow if utilities cannot be loaded.
            applyStepperResponse(response, true);
          },
        });
      },
      onError: () => {
        setIsResolvingRoute(false);
        openModal('error-modal');
      },
    });
  };

  useEffect(() => {
    if (!autoLoad || !tCode) return;
    loadMoveOutStepper();
  }, [tCode, autoLoad]);

  return {
    steppers,
    currentStep,
    hasUtilities,
    isLoadingStepperData: isLoadingStepperData || isResolvingRoute,
    loadMoveOutStepper,
  };
}
