import Stepper from 'components/common/Stepper';
import useMoveOutStepper from './useMoveOutStepper';
import StepperSkeleton from 'components/Skeleton/StepperSkeleton';

export default function MoveOutStepper() {
  const { steppers, currentStep, hasUtilities } = useMoveOutStepper();
  return (
    <>
      {steppers.length > 0 ? (
        <Stepper steppers={steppers} currentStep={currentStep} disableStepClick={true} />
      ) : (
        <StepperSkeleton steps={hasUtilities === false ? 3 : 5} />
      )}
    </>
  );
}
