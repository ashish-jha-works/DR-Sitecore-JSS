import Stepper from 'components/common/Stepper';
import useRenewalStepper from './useRenewalStepper';
import { useEffect } from 'react';
import StepperSkeleton from 'components/Skeleton/StepperSkeleton';

export default function RenewalStepper({ setStepperAPIData }: any) {
  const { steppers, currentStep, stepperAPIData, loadContractRenewalStepper } =
    useRenewalStepper(false);

  useEffect(() => {
    loadContractRenewalStepper(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stepperAPIData && setStepperAPIData) {
      setStepperAPIData(stepperAPIData);
    }
  }, [stepperAPIData, setStepperAPIData]);

  return (
    <>
      {steppers.length > 0 ? (
        <Stepper steppers={steppers} currentStep={currentStep} disableStepClick={true} />
      ) : (
        <StepperSkeleton steps={5} />
      )}
    </>
  );
}
