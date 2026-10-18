import React from 'react';

/** Skeleton for bank details payment-mode options (while initial APIs load). */
const MoveOutBankDetailsSkeleton = () => {
  return (
    <div className="flex flex-col gap-5 md:gap-6 w-full">
      <div className="h-3 w-16 md:w-20 rounded-full bg-silver-chalice-300 skelton-animation" />

      <div className="bg-silver-chalice-100 flex flex-col gap-5 md:gap-6 p-4 md:p-6 rounded-xl skelton-animation w-full">
        <div className="flex items-center gap-4">
          <div className="h-6 w-6 shrink-0 rounded-full bg-silver-chalice-300" />
          <div className="h-4 w-full max-w-70 md:max-w-145 rounded-lg bg-silver-chalice-300" />
        </div>

        <div className="h-px w-full bg-silver-chalice-300" />

        <div className="h-12 md:h-14 w-full rounded-lg bg-silver-chalice-300" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 w-full">
          <div className="h-12 md:h-14 w-full rounded-lg bg-silver-chalice-300" />
          <div className="h-12 md:h-14 w-full rounded-lg bg-white-pure" />
          <div className="h-12 md:h-14 w-full rounded-lg bg-white-pure" />
        </div>
      </div>

      <div className="h-12 md:h-14 w-full rounded-xl bg-silver-chalice-100 skelton-animation" />

      <div className="btn-wrapper flex flex-col lg:flex-row justify-end gap-5 md:gap-6">
        <div className="w-full md:w-68.75 h-11 md:h-15 rounded-xl bg-silver-chalice-100 skelton-animation" />
        <div className="w-full md:w-68.75 h-11 md:h-15 rounded-xl bg-silver-chalice-300 skelton-animation" />
      </div>
    </div>
  );
};

export default MoveOutBankDetailsSkeleton;
