import { SkeletonBlock } from 'components/Skeleton/SkeletonBlock';
import React from 'react';

const OutstandingPaymentsSkeleton = () => {
  return (
    <>
      <div className="container-sm bg-white-pure px-4 lg:px-0 pt-6">
        <div className="mx-auto max-w-6xl rounded-xl">
          {/* List items */}
          <div className="space-y-2">
            <SkeletonBlock className="h-16 w-full rounded-xl" />
            <SkeletonBlock className="h-16 w-full rounded-xl" />
            <SkeletonBlock className="h-16 w-full rounded-xl" />
            <SkeletonBlock className="h-16 w-full rounded-xl" />
            <SkeletonBlock className="h-10 w-full rounded-xl" />
          </div>

          {/* CTA */}
          <div className="mt-2 lg:mt-3 flex justify-end">
            <SkeletonBlock className="h-11 lg:h-15 w-full lg:w-68.75 rounded-xl" />
          </div>
        </div>
      </div>
    </>
  );
};

const UpcomingPaymentsSkeleton = () => {
  return (
    <>
      <div className="container-sm bg-white-pure px-4 lg:px-0 lg:mt-6">
        {/* List items */}
        <div className="space-y-2">
          <SkeletonBlock className="h-16 w-full" />
          <SkeletonBlock className="h-16 w-full" />
          <SkeletonBlock className="h-16 w-full" />
          <SkeletonBlock className="h-16 w-full" />
        </div>
      </div>
    </>
  );
};

const PaymentsHistorySkeleton = () => {
  return (
    <>
      <div className="container-sm bg-white-pure px-4 lg:px-0">
        {/* List items */}
        <div className="space-y-2">
          <SkeletonBlock className="h-16 w-full" />
          <SkeletonBlock className="h-16 w-full" />
          <SkeletonBlock className="h-16 w-full" />
          <SkeletonBlock className="h-16 w-full" />
        </div>
      </div>
    </>
  );
};

export { OutstandingPaymentsSkeleton, UpcomingPaymentsSkeleton, PaymentsHistorySkeleton };
