import CircleTickIcon from 'assets/icons/CircleTickIcon';
import React from 'react';

interface StepperProps {
  steppers: StepItem[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  disableStepClick?: boolean;
}

export interface StepItem {
  step: number;
  name: string;
  back_stepping: boolean;
  stepDone: boolean;
}

const Stepper: React.FC<StepperProps> = ({
  steppers,
  currentStep,
  onStepClick = () => null,
  disableStepClick = false,
}) => {
  const currentStepIndex = steppers.find((step) => step.stepDone !== true)?.step || steppers.length;

  return (
    <>
      <div className="hidden lg:flex items-center justify-center p-5 border-b border-b-lilac-200">
        {steppers.map((stepItem, index) => {
          const { step, name, stepDone, back_stepping } = stepItem;

          const isSelected = step === currentStep;
          const isCompleted = stepDone;

          const isClickable = !disableStepClick && (step >= currentStep || back_stepping);

          return (
            <div key={index} className="flex items-center gap-2 relative min-w-58.75">
              {/* Step circle */}
              <div className="">
                <div
                  onClick={() => isClickable && onStepClick(step)}
                  className={`
                w-8 h-8 rounded-full flex items-center justify-center
                text-sm font-semibold text-white-pure
                ${
                  isCompleted
                    ? 'bg-success-500 outline-success-50 outline-4'
                    : isSelected
                    ? 'bg-success-500 outline-success-50 outline-4'
                    : 'bg-silver-chalice-300'
                }
                ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}
              `}
                >
                  {isCompleted ? <CircleTickIcon className="text-xl" /> : step}
                </div>
              </div>

              {/* Step label */}
              <div className="ml-2 mr-6 text-body-xs font-medium whitespace-nowrap uppercase">
                {name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Design */}
      <div className="lg:hidden flex items-center gap-2 relative -mt-16.5 z-10 bg-white-pure mx-10 px-6 rounded-t-3xl h-16.5 border-b-4 border-success-500">
        {/* Step circle */}
        <div className="">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white-pure bg-success-500 outline-success-50 outline-4">
            {currentStepIndex}
          </div>
        </div>

        {/* Step label */}
        <div className="ml-2 text-body-xs flex flex-col gap-1 font-medium whitespace-nowrap">
          <span className="font-light">
            Step {currentStepIndex}/{steppers?.length}
          </span>
          <span className="font-medium uppercase">
            {steppers?.[(currentStep || currentStepIndex) - 1]?.name}
          </span>
        </div>
      </div>
    </>
  );
};

export default Stepper;
