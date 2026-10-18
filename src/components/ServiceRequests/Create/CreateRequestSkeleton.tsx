export const CreateRequestSkeleton = () => {
  return (
    <>
      <div className="bg-silver-chalice-100 p-5 md:p-6 rounded-xl skelton-animation">
        <div className="h-4 w-24 md:w-42.5 mb-2 md:mb-3 rounded-full bg-silver-chalice-300" />
        <div className="h-2 w-full md:w-150 mb-2 md:mb-3 rounded-full bg-silver-chalice-300" />
        <div className="h-4 w-38 mb-2 md:mb-3 rounded-full bg-silver-chalice-300" />
        <div className="h-12 w-full mb-5 md:mb-6 md:w-93.75 rounded-xl bg-white-pure flex items-center justify-between p-3 md:p-4">
          <div className="h-4 w-54 rounded-lg bg-silver-chalice-300" />
          <div className="h-6 w-6 rounded-full bg-silver-chalice-300" />
        </div>
        <div className="h-4 w-32.5 mb-2 md:mb-3 rounded-lg bg-silver-chalice-300" />
        <div className="space-y-5 lg:space-y-4 flex flex-wrap gap-3 md:gap-4 justify-between">
          {[...Array(12)].map((_, i) => (
            <div
              className="skelton-animation bg-silver-chalice-50 rounded-xl h-25 w-[47.5%] md:h-30 md:w-32 flex flex-col gap-3 mb-0 items-center justify-center"
              key={i}
            >
              <div className="h-8 w-8 rounded-full bg-silver-chalice-300" />
              <div className="h-3 w-14 rounded-lg bg-silver-chalice-300" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
