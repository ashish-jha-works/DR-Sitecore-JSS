import React from 'react';

const CostBreakdownLines = ({ count = 4 }: { count?: number }) => (
  <div className="flex flex-col gap-3 w-full">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="h-2 w-full rounded-full bg-silver-chalice-300" />
    ))}
  </div>
);

const BranchContactRows = () => (
  <div className="flex flex-col gap-2 md:gap-8">
    {[...Array(2)].map((_, i) => (
      <div key={i} className="flex items-center gap-4">
        <div className="h-6 w-6 shrink-0 rounded-full bg-silver-chalice-300" />
        <div className="h-3 w-40 md:w-48 rounded-full bg-silver-chalice-300" />
      </div>
    ))}
  </div>
);

const PaymentCardGridDesktop = () => (
  <div className="grid grid-cols-4 gap-4 w-full">
    {[...Array(7)].map((_, i) => (
      <div
        key={i}
        className={`h-28 w-full rounded-lg ${i === 0 ? 'bg-silver-chalice-300' : 'bg-white-pure'}`}
      />
    ))}
  </div>
);

const PaymentCardListMobile = () => (
  <div className="flex flex-col gap-5 w-full">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className={`rounded-xl h-15 flex flex-row items-center justify-between px-3 py-2 ${
          i === 0 ? 'bg-silver-chalice-300' : 'bg-white-pure'
        }`}
      >
        <div className="flex flex-row gap-3 items-center min-w-0">
          <div className="h-4 w-4 shrink-0 rounded-full border border-silver-chalice-600" />
          <div className="h-6 w-9 shrink-0 rounded-sm bg-silver-chalice-200" />
          <div className="flex flex-col gap-1 min-w-0">
            <div className="h-2.5 w-28 rounded-full bg-silver-chalice-300" />
            <div className="h-2.5 w-36 rounded-full bg-silver-chalice-300" />
          </div>
        </div>
        <div className="h-6 w-6 shrink-0 rounded-lg bg-silver-chalice-300" />
      </div>
    ))}
  </div>
);

/** Desktop + mobile skeletons for move-out outstanding payment. */
const MoveOutOutstandingPaymentSkeleton = () => {
  return (
    <div className="flex flex-col gap-5 md:gap-6 w-full">
      {/* —— Desktop —— */}
      <div className="hidden md:flex flex-col gap-6 w-full">
        <div className="bg-silver-chalice-100 flex flex-col gap-5 p-6 rounded-xl skelton-animation w-full">
          <div className="flex items-center gap-4 w-full">
            <div className="h-6 w-6 shrink-0 rounded-full bg-silver-chalice-300" />
            <div className="h-4 w-[65%] max-w-145 rounded-lg bg-silver-chalice-300" />
          </div>

          <CostBreakdownLines count={4} />

          <div className="flex items-center justify-between gap-4 w-full">
            <div className="h-3 w-[40%] max-w-70 rounded-full bg-silver-chalice-300" />
            <div className="h-5 w-5 shrink-0 rounded-md bg-silver-chalice-300" />
          </div>

          <div className="grid grid-cols-2 gap-12 items-center w-full">
            <div className="h-64 w-full rounded-lg bg-silver-chalice-300" />
            <BranchContactRows />
          </div>

          <div className="h-12 w-full rounded-xl bg-silver-chalice-300" />
        </div>

        <div className="bg-silver-chalice-100 flex flex-col gap-5 p-6 rounded-xl skelton-animation w-full">
          <div className="h-4 w-48 rounded-lg bg-silver-chalice-300" />
          <PaymentCardGridDesktop />
          <div className="h-10 w-16 rounded-lg bg-white-pure" />
          <div className="flex items-center gap-4">
            <div className="h-11 w-40 rounded-xl bg-silver-chalice-300" />
            <div className="h-3 w-48 rounded-full bg-silver-chalice-300" />
          </div>
        </div>

        <div className="btn-wrapper flex justify-end">
          <div className="w-68.75 h-15 rounded-xl bg-silver-chalice-300 skelton-animation" />
        </div>
      </div>

      {/* —— Mobile —— */}
      <div className="flex md:hidden flex-col gap-5 w-full">
        <div className="bg-silver-chalice-100 flex flex-col gap-5 p-4 rounded-xl skelton-animation w-full">
          <div className="flex items-center gap-4 w-full">
            <div className="h-6 w-6 shrink-0 rounded-full bg-silver-chalice-300" />
            <div className="h-4 w-[28%] min-w-24 rounded-lg bg-silver-chalice-300" />
          </div>

          <CostBreakdownLines count={4} />

          <div className="flex items-center justify-between gap-4 w-full">
            <div className="h-3 w-[22%] min-w-20 rounded-full bg-silver-chalice-300" />
            <div className="h-5 w-5 shrink-0 rounded-md bg-silver-chalice-300" />
          </div>

          <div className="h-48 w-full rounded-lg bg-silver-chalice-300" />
          <BranchContactRows />
          <div className="h-12 w-full rounded-xl bg-silver-chalice-300" />
        </div>

        <div className="bg-silver-chalice-100 flex flex-col gap-5 p-4 rounded-xl skelton-animation w-full">
          <div className="h-4 w-40 rounded-lg bg-silver-chalice-300" />
          <PaymentCardListMobile />
          <div className="h-10 w-14 rounded-lg bg-white-pure" />
          <div className="h-11 w-full rounded-xl bg-silver-chalice-300" />
        </div>

        <div className="btn-wrapper">
          <div className="w-full h-11 rounded-xl bg-silver-chalice-300 skelton-animation" />
        </div>
      </div>
    </div>
  );
};

export default MoveOutOutstandingPaymentSkeleton;
