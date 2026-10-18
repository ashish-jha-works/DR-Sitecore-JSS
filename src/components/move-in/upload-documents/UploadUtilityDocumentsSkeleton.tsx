import React from 'react';

const UploadUtilityDocumentsSkeleton = () => {
  return (
    <div className="bg-silver-chalice-100 flex flex-col gap-5 lg:gap-10 p-5 md:p-6 rounded-xl skelton-animation w-full">
      <div className="flex flex-col items-start gap-2 lg:gap-3">
        <div className="flex justify-center items-center gap-5">
          <div className="h-6 w-6 rounded-full bg-silver-chalice-300" />
          <div className="h-4 w-28 lg:w-145 rounded-lg bg-silver-chalice-300" />
        </div>
        <div className="h-2 w-full rounded-full bg-silver-chalice-300" />
      </div>
      {[...Array(3)].map((_, i) => (
        <div className="flex flex-col" key={i}>
          <div className="flex flex-col gap-3 justify-between">
            <div className="h-3 w-full lg:w-142.5 rounded-full bg-silver-chalice-300" />
            <div className="lg:hidden h-3 w-51.5 rounded-full bg-silver-chalice-300" />
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              <div className="h-25 lg:h-23 w-full rounded-xl bg-white-pure flex items-center justify-between p-3 md:p-4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UploadUtilityDocumentsSkeleton;
