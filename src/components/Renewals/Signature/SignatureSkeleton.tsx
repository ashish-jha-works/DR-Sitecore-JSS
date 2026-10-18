import React from 'react';

function SignatureOptionCardSkeleton({
  variant = 'default',
}: {
  variant?: 'default' | 'selected';
}) {
  const isSelected = variant === 'selected';

  return (
    <div
      className={`w-full md:w-77.75 md:shrink-0 rounded-xl pt-5 md:pt-12.5 px-5 md:px-6 pb-5 md:pb-12.5 flex flex-col gap-5 ${
        isSelected ? 'bg-silver-chalice-300' : 'bg-white-pure border border-silver-chalice-300'
      }`}
    >
      <div
        className={`size-4 md:size-5 rounded-full ${
          isSelected ? 'bg-silver-chalice-100' : 'bg-silver-chalice-300'
        }`}
      />
      <div className="flex flex-col">
        <div className="flex flex-col gap-3 md:gap-4">
          <div
            className={`h-4 w-60 rounded-lg ${
              isSelected ? 'bg-silver-chalice-100' : 'bg-silver-chalice-300'
            }`}
          />
          <div
            className={`h-2 w-full rounded-full mb-7 ${
              isSelected ? 'bg-silver-chalice-100' : 'bg-silver-chalice-300'
            }`}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div
            className={`h-2 w-full rounded-full ${
              isSelected ? 'bg-silver-chalice-100' : 'bg-silver-chalice-300'
            }`}
          />
          <div
            className={`h-2 w-full rounded-full ${
              isSelected ? 'bg-silver-chalice-100' : 'bg-silver-chalice-300'
            }`}
          />
          <div
            className={`h-2 w-full rounded-full ${
              isSelected ? 'bg-silver-chalice-100' : 'bg-silver-chalice-300'
            }`}
          />
          <div
            className={`h-2 w-full rounded-full ${
              isSelected ? 'bg-silver-chalice-100' : 'bg-silver-chalice-300'
            }`}
          />
        </div>
      </div>
    </div>
  );
}

const SignatureSkeleton = () => {
  return (
    <div className="relative lg:static container-sm py-8 md:py-10 flex flex-col gap-5 md:gap-6">
      <div className="bg-silver-chalice-100 flex flex-col gap-5 lg:gap-6 p-4 md:p-8 rounded-xl skelton-animation w-full">
        <div className="flex flex-col gap-5 md:gap-11 w-full md:w-max">
          <div className="h-4 w-27.75 md:w-145 rounded-lg bg-silver-chalice-300" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full md:w-max">
            <SignatureOptionCardSkeleton variant="selected" />
            <SignatureOptionCardSkeleton />
          </div>
        </div>
      </div>

      <div className="btn-wrapper flex justify-end">
        <div className="w-full md:w-68.75 h-11 md:h-15 rounded-xl bg-silver-chalice-300 skelton-animation" />
      </div>
    </div>
  );
};

export default SignatureSkeleton;
