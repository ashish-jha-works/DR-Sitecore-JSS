import React from 'react';

const UtilityRowDesktop = () => (
  <div className="flex flex-col gap-5 w-full">
    <div className="flex gap-5 items-start">
      <div className="h-13.5 w-13.5 shrink-0 rounded-xl bg-silver-chalice-300" />
      <div className="flex flex-col gap-2 flex-1 pt-1">
        <div className="h-4 w-28 rounded-full bg-silver-chalice-300" />
        <div className="h-4 w-72 max-w-full rounded-full bg-silver-chalice-300" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4 lg:gap-6 w-full">
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className="h-14 w-full rounded-xl bg-white-pure flex items-center justify-between px-4"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-6 w-6 shrink-0 rounded-full bg-silver-chalice-300" />
            <div
              className={`h-4 rounded-full bg-silver-chalice-300 ${i === 0 ? 'w-36' : 'w-48'}`}
            />
          </div>
          <div className="h-6 w-6 shrink-0 rounded-full bg-silver-chalice-300" />
        </div>
      ))}
    </div>
    <div className="h-2.5 w-full rounded-full bg-silver-chalice-300" />
  </div>
);

const UtilityRowMobile = () => (
  <div className="flex flex-col gap-4 w-full">
    <div className="flex gap-4 items-start">
      <div className="h-13.5 w-13.5 shrink-0 rounded-xl bg-silver-chalice-300" />
      <div className="flex flex-col gap-2 flex-1 pt-1">
        <div className="h-4 w-24 rounded-full bg-silver-chalice-300" />
        <div className="h-4 w-full rounded-full bg-silver-chalice-300" />
      </div>
    </div>
    <div className="flex flex-col gap-3 w-full">
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className="h-14 w-full rounded-xl bg-white-pure flex items-center justify-between px-4"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-6 w-6 shrink-0 rounded-full bg-silver-chalice-300" />
            <div className="h-4 w-32 rounded-full bg-silver-chalice-300" />
          </div>
          <div className="h-6 w-6 shrink-0 rounded-full bg-silver-chalice-300" />
        </div>
      ))}
    </div>
    <div className="h-2.5 w-full rounded-full bg-silver-chalice-300" />
  </div>
);

/** Desktop + mobile skeletons for move-out terminate utilities (step 2). */
const TerminateUtilitiesSkeleton = () => {
  return (
    <div className="flex flex-col gap-5 md:gap-6 w-full">
      {/* Desktop */}
      <div className="hidden md:flex flex-col gap-6 w-full">
        <div className="bg-silver-chalice-100 flex flex-col gap-6 p-6 md:p-8 rounded-xl skelton-animation w-full">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="h-6 w-6 shrink-0 rounded-full bg-silver-chalice-300" />
              <div className="h-5 w-[55%] max-w-145 rounded-full bg-silver-chalice-300" />
            </div>
            <div className="h-2.5 w-full rounded-full bg-silver-chalice-300" />
            <div className="h-4 w-48 rounded-full bg-silver-chalice-300" />
          </div>

          <div className="flex flex-col gap-8 w-full">
            {[...Array(3)].map((_, i) => (
              <UtilityRowDesktop key={i} />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="h-5 w-5 shrink-0 rounded-md bg-silver-chalice-300" />
            <div className="h-4 w-[70%] max-w-120 rounded-full bg-silver-chalice-300" />
          </div>
        </div>

        <div className="btn-wrapper flex justify-end">
          <div className="w-68.75 h-15 rounded-xl bg-silver-chalice-300 skelton-animation" />
        </div>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden flex-col gap-5 w-full">
        <div className="bg-silver-chalice-100 flex flex-col gap-5 p-4 rounded-xl skelton-animation w-full">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="h-6 w-6 shrink-0 rounded-full bg-silver-chalice-300" />
              <div className="h-5 w-[40%] min-w-28 rounded-full bg-silver-chalice-300" />
            </div>
            <div className="h-2.5 w-full rounded-full bg-silver-chalice-300" />
            <div className="h-4 w-36 rounded-full bg-silver-chalice-300" />
          </div>

          <div className="flex flex-col gap-6 w-full">
            {[...Array(3)].map((_, i) => (
              <UtilityRowMobile key={i} />
            ))}
          </div>

          <div className="flex items-start gap-4">
            <div className="h-5 w-5 shrink-0 rounded-md bg-silver-chalice-300 mt-0.5" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-4 w-full rounded-full bg-silver-chalice-300" />
              <div className="h-4 w-[70%] rounded-full bg-silver-chalice-300" />
            </div>
          </div>
        </div>

        <div className="btn-wrapper">
          <div className="w-full h-11 rounded-xl bg-silver-chalice-300 skelton-animation" />
        </div>
      </div>
    </div>
  );
};

export default TerminateUtilitiesSkeleton;
