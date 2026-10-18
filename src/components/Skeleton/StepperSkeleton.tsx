import React from 'react';

const StepperSkeleton = ({ steps = 2 }: { steps?: number }) => {
  return (
    <div className="relative -top-16.5 lg:static flex flex-col gap-5 md:gap-6 z-10 px-9.5 lg:px-0">
      <div className="bg-silver-chalice-100 rounded-t-3xl lg:rounded-t-none p-6 skelton-animation flex flex-col items-start lg:items-center justify-center gap-4 lg:gap-6 h-16.5">
        <div className="hidden lg:flex justify-center items-start gap-12">
          {steps &&
            steps > 0 &&
            Array.from({ length: steps }).map((_, index) => (
              <div key={index} className="flex justify-center items-center gap-5">
                <div className="h-6 w-6 rounded-full bg-silver-chalice-300" />
                <div className="h-4 w-28 rounded-lg bg-silver-chalice-300" />
              </div>
            ))}
        </div>
        <div className="flex lg:hidden justify-center items-start gap-12">
          <div className="flex justify-center items-center gap-5">
            <div className="h-6 w-6 rounded-full bg-silver-chalice-300" />
            <div className="h-4 w-28 rounded-lg bg-silver-chalice-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepperSkeleton;
