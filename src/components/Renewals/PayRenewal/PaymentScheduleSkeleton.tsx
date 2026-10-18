import React from 'react';

const PaymentScheduleSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {[...Array(8)].map((_, i) => (
        <div className="flex flex-col gap-2" key={i}>
          <div className="h-2 w-full rounded-full bg-silver-chalice-300" />
          <div className="flex justify-between">
            <div className="h-2 w-48 rounded-full bg-silver-chalice-300" />
            <div className="h-2 w-48 rounded-full bg-silver-chalice-300" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentScheduleSkeleton;
