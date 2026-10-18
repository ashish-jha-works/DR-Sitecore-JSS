import { SkeletonBlock } from 'components/Skeleton/SkeletonBlock';
import React from 'react';

const PaymentWithCardSkeleton = () => {
  return (
    <div className="bg-white-pure">
      {/* List items Desktop */}
      <div className="hidden lg:flex flex-col gap-6">
        <div className="lg:grid grid-cols-4 gap-4">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className={`${
                i === 0 ? 'bg-silver-chalice-500' : ''
              } skelton-animation rounded-md h-31 min-w-50 flex flex-row items-end justify-between px-2 py-2 lg:py-2 lg:px-5`}
            ></div>
          ))}
        </div>
      </div>
      {/* List items Mobile */}
      <div className="lg:hidden space-y-5 lg:space-y-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`${
              i === 0 ? 'bg-silver-chalice-500' : ''
            } skelton-animation rounded-xl h-15 flex flex-row items-end justify-between px-2 py-2 lg:py-2 lg:px-5`}
          >
            <div className="flex flex-row gap-3 lg:gap-6 items-center">
              <div className="h-4 w-4 rounded-full border-1 border-silver-chalice-600 bg-silver-chalice-500" />
              <div className="h-6 w-9 lg:h-10 lg:w-15 rounded-sm bg-silver-chalice-200" />
              <div className="gap-1 flex flex-col">
                <SkeletonBlock className="h-3 w-34.5 rounded-md bg-silver-chalice-300" />
                <SkeletonBlock className="h-3 w-42.5 rounded-md bg-silver-chalice-300" />
                <SkeletonBlock className="h-3 w-34.5 rounded-md bg-silver-chalice-300" />
              </div>
            </div>
            <div>
              <div className="h-6 w-6 rounded-lg bg-silver-chalice-300" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-5 lg:gap-6 mt-5 lg:mt-6">
        <SkeletonBlock className="w-21 lg:h-15" />
        <SkeletonBlock className="w-full md:max-w-68.75 h-11 lg:h-15" />
        <SkeletonBlock className="hidden lg:block w-full h-11" />
        <div className="flex flex-col gap-5 lg:gap-6">
          {[...Array(4)].map((_, i) => (
            <div className="flex gap-5 items-center" key={i}>
              <SkeletonBlock className="w-6 h-6" />
              <SkeletonBlock className="w-full h-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentWithCardSkeleton;
