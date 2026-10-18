import React from 'react';

const CollectionScheduledSkeleton = () => {
  return (
    <div className="container-sm py-8 md:py-10 relative lg:static flex flex-col gap-5 md:gap-6">
      <div className="bg-silver-chalice-100 p-4 md:p-8 rounded-xl skelton-animation flex flex-col gap-5 md:gap-6">
        <div className="flex flex-col items-start gap-0 md:gap-2">
          <div className="flex items-center gap-5 w-60.25 mb-5 md:mb-0">
            <div className="h-6 w-6 rounded-full bg-silver-chalice-300 shrink-0" />
            <div className="h-4 flex-1 min-w-0 rounded-lg bg-silver-chalice-300" />
          </div>
          <div className="h-2 w-full md:w-150 max-w-full rounded-full bg-silver-chalice-300" />
        </div>

        <div className="flex flex-col md:flex-row gap-5 md:gap-10">
          <div className="flex flex-col gap-2 md:w-1/2">
            <div className="h-2 w-65 max-w-full rounded-full bg-silver-chalice-300" />
            <div className="h-2 w-51.25 max-w-full rounded-full bg-silver-chalice-300" />
            <div className="h-2 w-51.25 max-w-full rounded-full bg-silver-chalice-300" />
          </div>

          <div className="flex flex-col gap-2 md:w-1/2">
            <div className="h-2 w-65 max-w-full rounded-full bg-silver-chalice-300" />
            <div className="flex items-center gap-3 w-60 max-w-full">
              <div className="size-6 rounded-full bg-silver-chalice-300 shrink-0" />
              <div className="h-4 flex-1 min-w-0 rounded-lg bg-silver-chalice-300" />
            </div>
            <div className="flex items-center gap-3 w-60 max-w-full">
              <div className="size-6 rounded-full bg-silver-chalice-300 shrink-0" />
              <div className="h-4 flex-1 min-w-0 rounded-lg bg-silver-chalice-300" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 md:gap-6">
          <div className="h-11 md:h-12 w-full md:w-68.75 rounded-xl bg-white-pure" />
          <div className="h-41.25 md:h-18 w-full rounded-lg bg-silver-chalice-300" />
        </div>
      </div>
    </div>
  );
};

export default CollectionScheduledSkeleton;
