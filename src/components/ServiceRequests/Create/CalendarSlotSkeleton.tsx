export const CalendarSlotSkeleton = ({ version }: { version?: number }) => {
  return (
    <>
      <div
        className={`bg-silver-chalice-100 p-4 md:p-6 rounded-xl skelton-animation flex flex-col md:flex-row gap-4 md:gap-16.5 ${
          version === 1 ? 'my-4' : ''
        }`}
      >
        <div className="h-78 md:h-95 w-full md:w-[50%] rounded-xl bg-white-pure flex flex-col gap-4 p-3 md:p-4">
          <div className="flex justify-between items-center w-full">
            <div className="h-4 w-15 rounded-lg bg-silver-chalice-300" />
            <div className="flex gap-5">
              <div className="h-6 w-6 rounded-full bg-silver-chalice-300" />
              <div className="h-6 w-6 rounded-full bg-silver-chalice-300" />
            </div>
          </div>
          <div className="flex justify-between md:mb-4">
            {[...Array(7)].map((_, i) => (
              <div className="h-4 w-8.5 md:w-9 rounded-lg bg-silver-chalice-300" key={i} />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4.5 md:gap-y-1">
            {[...Array(35)].map((_, i) => (
              <div key={i} className={`${version === 1 ? 'w-[9%]' : 'w-[10%]'} pl-2 h-9 md:h-12.5`}>
                <div className="h-6 w-6 rounded-full bg-silver-chalice-300" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4 md:w-[50%] flex flex-wrap gap-2 md:gap-3 justify-between">
          {[...Array(6)].map((_, i) => (
            <div
              className="h-12 w-full rounded-xl bg-white-pure mb-0 flex items-center justify-between p-3 md:p-4"
              key={i}
            >
              <div className="h-4 w-54 rounded-lg bg-silver-chalice-300" />
              <div className="h-6 w-6 rounded-full bg-silver-chalice-300" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
