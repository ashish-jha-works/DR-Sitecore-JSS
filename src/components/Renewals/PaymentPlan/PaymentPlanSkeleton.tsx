import React from 'react';

const PaymentPlanSkeleton = () => {
  return (
    <div className="container-sm my-6 relative lg:static flex flex-col gap-5 md:gap-6">
      <div className="bg-silver-chalice-100 flex flex-col gap-5 lg:gap-10 p-5 md:p-6 rounded-xl skelton-animation w-full">
        <div className="flex flex-col gap-6 items-start">
          <div className="flex justify-center items-center gap-3 lg:gap-6">
            <div className="h-3 lg:h-5 w-3 lg:w-5 rounded-full bg-silver-chalice-300" />
            <div className="h-2 lg:h-4 w-28 lg:w-145 rounded-lg bg-silver-chalice-300" />
          </div>
          <div className="grid md:grid-cols-3 gap-4 lg:gap-6 w-full">
            <div className="h-10 lg:h-20 w-full flex-1 rounded-lg bg-silver-chalice-300" />
            <div className="h-10 lg:h-20 w-full flex-1 rounded-lg bg-white-pure" />
            <div className="h-10 lg:h-20 w-full flex-1 rounded-lg bg-white-pure" />
            <div className="h-10 lg:h-20 w-full flex-1 rounded-lg bg-white-pure" />
            <div className="h-10 lg:h-20 w-full flex-1 rounded-lg bg-white-pure" />
          </div>
          <div className="h-23 lg:h-12 w-full rounded-lg bg-silver-chalice-300" />
          <div className="flex justify-center items-center gap-3 lg:gap-6">
            <div className="h-3 lg:h-5 w-3 lg:w-5 rounded-full bg-silver-chalice-300" />
            <div className="h-2 lg:h-4 w-28 lg:w-70 rounded-lg bg-silver-chalice-300" />
          </div>
          <div className="flex flex-col gap-6 w-full">
            <div className="h-2 w-full rounded-full bg-silver-chalice-300" />
            <div className="h-2 w-full rounded-lg bg-silver-chalice-300" />
            <div className="h-2 w-full rounded-lg bg-silver-chalice-300" />
            <div className="h-2 w-full rounded-lg bg-silver-chalice-300" />
            <div className="h-2 w-full rounded-lg bg-silver-chalice-300" />
            <div className="h-2 lg:hidden w-full rounded-lg bg-silver-chalice-300" />
            <div className="h-2 lg:w-157 w-50 rounded-lg bg-silver-chalice-300" />
          </div>
        </div>
      </div>
      <div className="bg-silver-chalice-100 flex flex-col gap-5 lg:gap-10 p-5 md:p-6 rounded-xl skelton-animation w-full">
        <div className="flex flex-col gap-6 items-start">
          <div className="flex justify-center items-center gap-3 lg:gap-6">
            <div className="h-3 lg:h-5 w-3 lg:w-5 rounded-full bg-silver-chalice-300" />
            <div className="h-2 lg:h-4 w-28 lg:w-145 rounded-lg bg-silver-chalice-300" />
          </div>
          <div className="grid md:grid-cols-4 gap-4 lg:gap-6 w-full">
            <div className="h-10 lg:h-20 w-full flex-1 rounded-lg bg-silver-chalice-300" />
            <div className="h-10 lg:h-20 w-full flex-1 rounded-lg bg-white-pure" />
            <div className="h-10 lg:h-20 w-full flex-1 rounded-lg bg-white-pure" />
            <div className="h-10 lg:h-20 w-full flex-1 rounded-lg bg-white-pure" />
          </div>
          <div className="h-3 w-41 rounded-lg bg-silver-chalice-300" />
          <div className="flex flex-col gap-4 w-full">
            {[...Array(8)].map((_, i) => (
              <div className="flex flex-col gap-2" key={i}>
                <div className="h-2 w-full rounded-full bg-silver-chalice-300" />
                <div className="flex justify-between">
                  <div className="h-2 w-48 rounded-full bg-silver-chalice-300" />
                  <div className="h-2 w-48 rounded-full bg-silver-chalice-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="btn-wrapper flex justify-end gap-5 lg:gap-6">
        <div className="w-full md:w-68.75 h-11 md:h-15 rounded-xl bg-silver-chalice-100" />
        <div className="w-full md:w-68.75 h-11 md:h-15 rounded-xl bg-silver-chalice-300" />
      </div>
    </div>
  );
};

export default PaymentPlanSkeleton;
