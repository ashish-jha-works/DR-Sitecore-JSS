import Stepper from 'components/common/Stepper';
import useMoveInStepper from './useMoveInStepper';
import { useEffect } from 'react';
import StepperSkeleton from 'components/Skeleton/StepperSkeleton';

export default function MoveInStepper({ setStepperAPIData }: any) {
  const { steppers, currentStep, stepperAPIData, loadMoveInStepper } = useMoveInStepper(false);

  useEffect(() => {
    loadMoveInStepper(true);
  }, []);

  useEffect(() => {
    if (stepperAPIData && setStepperAPIData) {
      setStepperAPIData(stepperAPIData);
    }
  }, [stepperAPIData]);

  return (
    <>
      {steppers.length > 0 ? (
        <Stepper steppers={steppers} currentStep={currentStep} disableStepClick={true} />
      ) : (
        <StepperSkeleton steps={3} />
      )}
    </>
  );
}
