import React from 'react';

function SummaryRowSkeleton({ variant = 'default' }: { variant?: 'default' | 'withCircle' }) {
  if (variant === 'withCircle') {
    return (
      <div className="bg-white-pure rounded-xl p-4 md:p-5 flex items-center justify-between gap-4">
        <div className="h-3 w-2/5 max-w-65 rounded-full bg-silver-chalice-300" />
        <div className="size-6 rounded-full bg-silver-chalice-300 shrink-0" />
      </div>
    );
  }

  return (
    <div className="bg-white-pure rounded-xl p-4 md:p-5 flex flex-col gap-5.5">
      <div className="h-3 w-2/5 max-w-65 rounded-full bg-silver-chalice-300" />
      <div className="h-3 w-11/12 rounded-full bg-silver-chalice-300" />
    </div>
  );
}

const RenewalSummarySkeleton = () => {
  return (
    <div className="container-sm py-8 md:py-10 relative lg:static flex flex-col gap-5 md:gap-6">
      <div className="bg-silver-chalice-100 p-4 md:p-8 rounded-xl skelton-animation flex flex-col">
        <div className="flex flex-col">
          <div className="h-29 md:h-19 w-full rounded-lg bg-silver-chalice-300 mb-5 md:mb-10" />
          <div className="h-4 w-27.75 md:w-56 rounded-full bg-silver-chalice-300 mb-5 md:mb-10" />
        </div>

        <div className="flex flex-col gap-5 md:gap-10">
          <SummaryRowSkeleton />
          <SummaryRowSkeleton />
          <SummaryRowSkeleton variant="withCircle" />
        </div>
      </div>
    </div>
  );
};

export default RenewalSummarySkeleton;
