import React from 'react';

export const CurrentLeaseSkeleton = () => {
  return (
    <div className="relative lg:-top-16.5 lg:static py-8 md:py-10 flex flex-col gap-5 md:gap-6">
      <div className="bg-silver-chalice-100 flex flex-col gap-5 lg:gap-10 p-5 md:p-6 rounded-xl skelton-animation w-full">
        <div className="flex flex-col gap-6 items-start">
          <div className="flex justify-center items-center gap-6">
            <div className="h-2 lg:h-4 w-28 lg:w-53 rounded-lg bg-silver-chalice-300" />
          </div>
          <div className="flex flex-col gap-6 w-full">
            <div className="h-2 lg:h-4 w-28 lg:w-145 rounded-lg bg-silver-chalice-300" />
            <div className="h-2 lg:h-4 w-full lg:w-85 rounded-full bg-silver-chalice-300" />
            <div className="h-2 lg:h-4 w-full lg:w-167 rounded-lg bg-silver-chalice-300" />
            <div className="h-2 lg:hidden w-full rounded-lg bg-silver-chalice-300" />
            <div className="h-2 lg:hidden w-full rounded-lg bg-silver-chalice-300" />
            <div className="h-2 lg:hidden w-50 rounded-lg bg-silver-chalice-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const RenewalProposalSkeleton = () => {
  return (
    <div className="relative lg:static flex flex-col gap-5 md:gap-6">
      <div className="bg-silver-chalice-100 flex flex-col gap-5 lg:gap-10 p-5 md:p-6 rounded-xl skelton-animation w-full">
        <div className="flex flex-col gap-6 items-start">
          <div className="flex justify-center items-center gap-3 lg:gap-6">
            <div className="h-3 lg:h-5 w-3 lg:w-5 rounded-full bg-silver-chalice-300" />
            <div className="h-2 lg:h-4 w-28 lg:w-53 rounded-lg bg-silver-chalice-300" />
          </div>
          <div className="h-2 lg:h-4 w-full rounded-lg bg-silver-chalice-300" />
          <div className="flex flex-col gap-6 w-full">
            <div className="h-2 lg:h-4 w-28 lg:w-80 rounded-lg bg-silver-chalice-300" />
            <div className="h-2 lg:h-4 w-full rounded-full bg-silver-chalice-300" />
            <div className="h-2 lg:h-4 w-full rounded-lg bg-silver-chalice-300" />
            <div className="h-2 lg:h-4 w-full rounded-lg bg-silver-chalice-300" />
            <div className="h-2 lg:hidden w-full rounded-lg bg-silver-chalice-300" />
            <div className="h-2 lg:h-4 lg:w-157 w-50 rounded-lg bg-silver-chalice-300" />
          </div>
        </div>
      </div>
      <div className="btn-wrapper flex justify-end">
        <div className="w-full md:w-68.75 h-11 md:h-15 rounded-xl bg-silver-chalice-300" />
      </div>
    </div>
  );
};
