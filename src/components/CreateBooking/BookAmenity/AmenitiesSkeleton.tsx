import React from 'react';

const AmenitiesSkeleton = () => {
  return (
    <div className="bg-silver-chalice-100 p-5 md:p-6 rounded-xl skelton-animation">
      <div className="h-4 w-full lg:w-150 mb-2 md:mb-3 rounded-lg bg-silver-chalice-300" />
      <div className="space-y-5 lg:space-y-4 flex flex-wrap gap-3 md:gap-4 justify-between">
        {[...Array(6)].map((_, i) => (
          <div
            className="skelton-animation bg-silver-chalice-50 rounded-xl h-11 w-full md:h-14 lg:max-w-61.5 flex flex-row gap-3 mb-0 items-center justify-between p-3 lg:p-4"
            key={i}
          >
            <div className="h-3.5 lg:h-4 w-35 rounded-lg bg-silver-chalice-300" />
            <div className="h-4 w-4 rounded-full bg-silver-chalice-300" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AmenitiesSkeleton;
