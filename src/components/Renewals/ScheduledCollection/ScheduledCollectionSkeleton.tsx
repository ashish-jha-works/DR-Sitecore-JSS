import React from 'react';
import { CalendarSlotSkeleton } from 'components/ServiceRequests/Create/CalendarSlotSkeleton';

function FormFieldSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="h-2 w-21 rounded-full bg-silver-chalice-300" />
      <div className="h-11 md:h-12 w-full rounded-xl bg-white-pure" />
    </div>
  );
}

const ScheduledCollectionSkeleton = () => {
  return (
    <div className="container-sm py-8 md:py-10 relative lg:static flex flex-col gap-5 md:gap-6">
      <div className="h-4 w-27.75 md:w-56 rounded-lg bg-silver-chalice-300 skelton-animation" />

      <div className="bg-silver-chalice-100 p-4 md:p-6 rounded-xl skelton-animation flex flex-col gap-4 lg:gap-6">
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-5 w-42.5">
            <div className="h-6 w-6 rounded-full bg-silver-chalice-300 shrink-0" />
            <div className="h-4 flex-1 min-w-0 rounded-lg bg-silver-chalice-300" />
          </div>
          <div className="h-2 w-full rounded-full bg-silver-chalice-300" />
          <div className="h-2 w-10/12 rounded-full bg-silver-chalice-300" />
        </div>

        <div className="h-29 md:h-12 w-full rounded-lg bg-silver-chalice-300 mt-6 mb-6" />

        <div className="[&>div]:!bg-transparent [&>div]:!p-0 [&>div]:rounded-none [&>div]:after:hidden">
          <CalendarSlotSkeleton />
        </div>
      </div>

      <div className="bg-silver-chalice-100 p-4 md:p-6 rounded-xl skelton-animation flex flex-col gap-5 md:gap-10">
        <div className="flex items-center gap-5">
          <div className="h-6 w-6 rounded-full bg-silver-chalice-300" />
          <div className="h-4 w-28 lg:w-90 rounded-lg bg-silver-chalice-300" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10">
          <FormFieldSkeleton />
          <FormFieldSkeleton />
          <FormFieldSkeleton />
          <FormFieldSkeleton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10">
          <FormFieldSkeleton />
          <FormFieldSkeleton />
        </div>

        <div className="flex items-center gap-3">
          <div className="size-4 rounded bg-silver-chalice-300 shrink-0" />
          <div className="h-2 w-full max-w-145 rounded-full bg-silver-chalice-300" />
        </div>

        <div className="btn-wrapper flex justify-end">
          <div className="w-full md:w-68.75 h-11 md:h-15 rounded-xl bg-silver-chalice-300" />
        </div>
      </div>

      <div className="bg-silver-chalice-100 p-4 md:p-6 rounded-xl skelton-animation flex flex-col gap-2">
        <div className="flex items-center gap-5 w-42.5">
          <div className="h-6 w-6 rounded-full bg-silver-chalice-300 shrink-0" />
          <div className="h-4 flex-1 min-w-0 rounded-lg bg-silver-chalice-300" />
        </div>
        <div className="h-2 w-full rounded-full bg-silver-chalice-300 mb-6" />
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-5 min-w-0">
            <div className="h-6 w-6 rounded-full bg-silver-chalice-300 shrink-0" />
            <div className="h-2 w-60 max-w-full rounded-full bg-silver-chalice-300" />
          </div>
          <div className="h-6 w-6 rounded-full bg-silver-chalice-300 shrink-0" />
        </div>
      </div>

      <div className="btn-wrapper flex justify-end">
        <div className="w-full md:w-68.75 h-11 md:h-15 rounded-xl bg-silver-chalice-300 skelton-animation" />
      </div>
    </div>
  );
};

export default ScheduledCollectionSkeleton;
