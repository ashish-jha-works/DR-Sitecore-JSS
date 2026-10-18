import { SkeletonBlock } from 'components/Skeleton/SkeletonBlock';
import React from 'react';

const ManageCardsSkeleton = () => {
  return (
    <div className="container-sm bg-white-pure px-4 lg:px-0 lg:mt-6">
      {/* List items */}
      <div className="space-y-5 lg:space-y-4">
        <div className="skelton-animation bg-silver-chalice-500 rounded-xl h-15 flex flex-row items-end justify-between px-2 py-2 lg:py-2 lg:px-5">
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
        <div className="skelton-animation rounded-xl h-15 flex flex-row items-end justify-between px-2 py-2 lg:py-2 lg:px-5">
          <div className="flex flex-row gap-3 lg:gap-6 items-center">
            <div className="h-4 w-4 rounded-full border-1 border-silver-chalice-600" />
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
        <div className="skelton-animation rounded-xl h-15 flex flex-row items-end justify-between px-2 py-2 lg:py-2 lg:px-5">
          <div className="flex flex-row gap-3 lg:gap-6 items-center">
            <div className="h-4 w-4 rounded-full border-1 border-silver-chalice-600" />
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
        <div className="skelton-animation rounded-xl h-15 flex flex-row items-end justify-between px-2 py-2 lg:py-2 lg:px-5">
          <div className="flex flex-row gap-3 lg:gap-6 items-center">
            <div className="h-4 w-4 rounded-full border-1 border-silver-chalice-600" />
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
      </div>
    </div>
  );
};

export default ManageCardsSkeleton;
