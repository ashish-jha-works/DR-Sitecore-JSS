import React from 'react';

const DirectDebitPageSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0 gap-y-1 md:gap-x-5 md:gap-y-3">
      {[...Array(6)].map((_, i) => (
        <div className="flex flex-col gap-1 lg:gap-2" key={i}>
          <div className="h-4 w-60 rounded-lg bg-silver-chalice-300 skelton-animation" />
          <div className="h-11 w-full rounded-lg bg-silver-chalice-300 skelton-animation" />
        </div>
      ))}
    </div>
  );
};

export default DirectDebitPageSkeleton;
