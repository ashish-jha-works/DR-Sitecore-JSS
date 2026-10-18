import React from 'react';

const RegisterUtilityDetailsSkeleton = () => {
  return (
    <>
      <div className="container-sm relative -top-16.5 lg:static py-8 md:py-10 flex flex-col gap-5 md:gap-6">
        <div className="bg-silver-chalice-100 flex flex-col gap-5 lg:gap-10 p-5 md:p-6 rounded-xl skelton-animation w-full">
          <div className="flex flex-col gap-3 items-start">
            <div className="flex justify-center items-center gap-5">
              <div className="h-6 w-6 rounded-full bg-silver-chalice-300" />
              <div className="h-4 w-28 lg:w-145 rounded-lg bg-silver-chalice-300" />
            </div>
            <div className="flex flex-col gap-3 w-full">
              <div className="h-2 w-full rounded-full bg-silver-chalice-300" />
              <div className="h-2 w-41 rounded-full bg-silver-chalice-300" />
              <div className="h-2 w-41 rounded-full bg-silver-chalice-300" />
              <div className="h-2 w-41 rounded-full bg-silver-chalice-300" />
            </div>
          </div>

          {[...Array(3)].map((_, i) => (
            <div className="flex flex-col" key={i}>
              <div className="flex flex-col gap-3 md:gap-4 justify-between">
                <div className="flex gap-4 lg:gap-6 items-center">
                  <div className="h-13.5 w-13.5 rounded-xl bg-silver-chalice-300" />
                  <div className="flex flex-1 flex-col">
                    <div className="h-3 w-21 mb-1 rounded-full bg-silver-chalice-300" />
                    <div className="h-3 w-full lg:w-112 rounded-full bg-silver-chalice-300" />
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                  <div className="h-10 lg:h-12 w-full rounded-xl bg-white-pure flex items-center justify-between p-3 md:p-4">
                    <div className="flex justify-center items-center gap-5">
                      <div className="h-6 w-6 rounded-full bg-silver-chalice-300" />
                      <div className="h-4 w-28 rounded-lg bg-silver-chalice-300" />
                    </div>
                    <div className="h-6 w-6 rounded-full bg-silver-chalice-300" />
                  </div>
                  <div className="h-10 lg:h-12 w-full rounded-xl bg-white-pure flex items-center justify-between p-3 md:p-4">
                    <div className="flex justify-center items-center gap-5">
                      <div className="h-6 w-6 rounded-full bg-silver-chalice-300" />
                      <div className="h-4 w-28 rounded-lg bg-silver-chalice-300" />
                    </div>
                    <div className="h-6 w-6 rounded-full bg-silver-chalice-300" />
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-silver-chalice-300" />
              </div>
            </div>
          ))}
        </div>
        <div className="btn-wrapper flex justify-end">
          <div className="w-full md:w-68.75 h-11 md:h-15 rounded-xl bg-silver-chalice-300" />
        </div>
      </div>
    </>
  );
};

export default RegisterUtilityDetailsSkeleton;
