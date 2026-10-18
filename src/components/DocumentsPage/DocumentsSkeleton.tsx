export const DocumentsSkeleton = () => {
  return (
    <div className="relative lg:static">
      <div className="flex justify-center items-center gap-4 h-10">
        {[...Array(3)].map((_, i) => (
          <div className="h-4 w-25 rounded-lg bg-silver-chalice-300" key={i} />
        ))}
      </div>
      <div className="container-sm py-8 md:py-10 flex flex-col gap-5 md:gap-6">
        <div className="h-29 lg:h-12 w-full rounded-xl bg-silver-chalice-300" />
        <div className="w-full">
          <div className="flex flex-wrap gap-5 md:gap-6 justify-between">
            {[...Array(3)].map((_, i) => (
              <div
                className="w-full rounded-xl gap-3 bg-white-pure mb-0 flex flex-col items-center justify-between p-4 md:p-8"
                key={i}
              >
                <div className="flex justify-start items-center w-full gap-6">
                  <div className="h-3 w-16.5 rounded-lg bg-silver-chalice-300" />
                  <div className="h-7.5 lg:h-9 w-25 rounded-full bg-silver-chalice-300" />
                </div>
                <div
                  className="w-full rounded-xl bg-white-pure mb-0 flex items-center justify-between"
                  key={i}
                >
                  <div className="h-3 w-full lg:w-137 rounded-lg bg-silver-chalice-300" />
                </div>
                <div className="flex flex-col lg:flex-row justify-between items-end lg:items-center w-full px-6 py-4 bg-silver-chalice-50 lg:h-15.5">
                  <div className="flex gap-3 items-center w-full justify-between lg:justify-start">
                    <div className="flex gap-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-7.5 w-7.5 rounded-sm bg-silver-chalice-300" />
                      ))}
                    </div>
                    <div className="h-3 w-32.25 rounded-lg bg-silver-chalice-300" />
                  </div>
                  <div className="h-3 w-16.5 rounded-lg bg-silver-chalice-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
