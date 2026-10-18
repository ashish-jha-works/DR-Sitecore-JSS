import React from 'react';

const ChequePaymentPageSkeleton = () => {
  return (
    <div className="container-sm py-8 md:py-10 flex flex-col gap-5 md:gap-6">
      <div className="flex flex-col gap-1 lg:gap-2">
        <div className="h-4 w-80 rounded-lg bg-silver-chalice-300 skelton-animation" />
        <div className="h-18 w-full rounded-lg bg-silver-chalice-300 skelton-animation" />
      </div>
      <div>
        <div className="h-4 w-80 rounded-lg bg-silver-chalice-300 skelton-animation" />
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-x-0 gap-y-2 md:gap-x-5 md:gap-y-4">
          <div className="h-11 lg:h-14 w-full rounded-lg bg-silver-chalice-300 skelton-animation" />
          <div className="h-11 lg:h-14 w-full rounded-lg bg-silver-chalice-300 skelton-animation" />
        </div>
      </div>
    </div>
  );
};

export default ChequePaymentPageSkeleton;
