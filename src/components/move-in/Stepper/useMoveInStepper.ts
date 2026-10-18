import { StepItem } from 'components/common/Stepper';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';

export default function useMoveInStepper(autoLoad = true) {
  const { tCode } = useUserStore();
  const { openModal } = useUIStore();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [steppers, setSteppers] = useState<StepItem[]>([]);
  const [stepperAPIData, setStepperAPIData] = useState<any>(null);
  const [showLoader, setShowLoader] = useState<boolean>(false);

  const { mutate: getStepperStates, isPending: isLoadingStepperData } = useApiMutation<any, any>(
    () => `/MoveIn/Stepper/${tCode}`,
    'GET',
    showLoader
  );

  const loadMoveInStepper = (loader: boolean = false) => {
    setShowLoader(loader);
    getStepperStates(null, {
      onSuccess: (stepperResponse) => {
        if (stepperResponse) {
          if (stepperResponse?.Steppers?.length) {
            setStepperAPIData(stepperResponse);
            const steppersItem: StepItem[] = [];
            stepperResponse?.Steppers.forEach((item: any) => {
              steppersItem.push({
                step: Number(item.Id),
                name: item.Description,
                back_stepping: item.BackAllowed,
                stepDone: item.StepCompleted,
              });
            });
            setSteppers(steppersItem);
            // Find the first step that is NOT completed, mark that step as Current Step
            let currentStep = 3; // Assuming all steps are complete by default

            for (const item of stepperResponse.Steppers) {
              if (item.StepCompleted) continue;

              currentStep = Number(item.Id);
              setCurrentStep(Number(item.Id));
              break;
            }

            // Redirect Logic
            switch (currentStep) {
              case 1:
                router.push(`/move-in/utilities-registration?rd=${currentStep}`);
                break;

              case 2:
                router.push(`/move-in/upload-documents?rd=${currentStep}`);
                break;

              case 3:
                router.push(`/move-in/key-handover?rd=${currentStep}`);
                break;

              default:
                break;
            }
          }
        }
      },
      onError: () => openModal('error-modal'),
    });
  };

  useEffect(() => {
    if (!autoLoad || !tCode) return;
    loadMoveInStepper();
  }, [tCode, router, autoLoad]);

  return {
    steppers,
    currentStep,
    stepperAPIData,
    loadMoveInStepper,
    isLoadingStepperData,
  };
}
