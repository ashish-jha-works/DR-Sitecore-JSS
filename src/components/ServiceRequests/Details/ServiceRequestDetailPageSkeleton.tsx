export default function ServiceRequestDetailPageSkeleton() {
  return (
    <div className="mt-4 rounded-lg">
      <ul>
        <li>
          <div className="flex flex-col gap-2">
            <div className="h-4 w-full rounded-xl bg-silver-chalice-300 skelton-animation"></div>
            <div className="h-4 w-full md:w-184.25 rounded-xl bg-silver-chalice-300 skelton-animation"></div>
            <div className="h-4 w-46.75 md:hidden rounded-xl bg-silver-chalice-300 skelton-animation"></div>
            <div className="mt-3 md:hidden flex flex-col gap-3">
              <div className="h-4 w-27.75 rounded-xl bg-silver-chalice-300 skelton-animation"></div>
              <div className="h-4 w-27.75 rounded-xl bg-silver-chalice-300 skelton-animation"></div>
            </div>
            <div className="mt-3 h-4 w-46.75 md:hidden rounded-xl bg-silver-chalice-300 skelton-animation"></div>
            <div className="h-4 w-46.75 md:hidden rounded-xl bg-silver-chalice-300 skelton-animation"></div>
            <div className="mt-4 md:hidden flex flex-col gap-3">
              <div className="h-4 w-27.75 rounded-xl bg-silver-chalice-300 skelton-animation"></div>
              <div className="h-4 w-27.75 rounded-xl bg-silver-chalice-300 skelton-animation"></div>
            </div>
            <div className="mt-3 h-4 w-46.75 md:hidden rounded-xl bg-silver-chalice-300 skelton-animation"></div>
            <div className="h-4 w-46.75 md:hidden rounded-xl bg-silver-chalice-300 skelton-animation"></div>
            <div className="mt-4 md:hidden flex flex-col gap-3">
              <div className="h-4 w-27.75 rounded-xl bg-silver-chalice-300 skelton-animation"></div>
              <div className="h-4 w-27.75 rounded-xl bg-silver-chalice-300 skelton-animation"></div>
            </div>
            <div className="mt-4 md:hidden flex flex-col gap-3">
              <div className="h-4 w-37 rounded-xl bg-silver-chalice-300 skelton-animation"></div>
              <div className="h-4 w-full rounded-xl bg-silver-chalice-300 skelton-animation"></div>
            </div>
            <div className="mb-4 mt-4 md:hidden flex flex-col gap-3">
              <div className="h-4 w-37 rounded-xl bg-silver-chalice-300 skelton-animation"></div>
              <div className="h-4 w-full rounded-xl bg-silver-chalice-300 skelton-animation"></div>
            </div>
          </div>
        </li>

        <li className="pt-6 pb-6 hidden md:block">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6">
            <div className="col-span-1 flex flex-col gap-3">
              <div className="h-4 w-full md:w-60 rounded-xl bg-silver-chalice-300 skelton-animation"></div>
              <div className="h-4 w-full md:w-60 rounded-xl bg-silver-chalice-300 skelton-animation"></div>
            </div>
            <div className="col-span-1 flex flex-col gap-3">
              <div className="h-4 w-full md:w-60 rounded-xl bg-silver-chalice-300 skelton-animation"></div>
              <div className="h-4 w-full md:w-60 rounded-xl bg-silver-chalice-300 skelton-animation"></div>
            </div>
            <div className="col-span-1 hidden md:block"></div>
          </div>
        </li>

        <li className="pt-6 pb-6 hidden md:block">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6">
            <div className="col-span-1 flex flex-col gap-3">
              <div className="h-4 w-full md:w-60 rounded-xl bg-silver-chalice-300 skelton-animation"></div>
              <div className="h-4 w-full md:w-60 rounded-xl bg-silver-chalice-300 skelton-animation"></div>
              <div className="h-4 w-full md:w-60 rounded-xl bg-silver-chalice-300 skelton-animation"></div>
            </div>
            <div className="col-span-1 flex flex-col gap-3">
              <div className="h-4 w-full md:w-60 rounded-xl bg-silver-chalice-300 skelton-animation"></div>
              <div className="h-4 w-full md:w-60 rounded-xl bg-silver-chalice-300 skelton-animation"></div>
              <div className="h-4 w-full md:w-60 rounded-xl bg-silver-chalice-300 skelton-animation"></div>
            </div>
            <div className="col-span-1 flex flex-col gap-3">
              <div className="h-4 w-full md:w-60 rounded-xl bg-silver-chalice-300 skelton-animation"></div>
              <div className="h-4 w-full md:w-60 rounded-xl bg-silver-chalice-300 skelton-animation"></div>
              <div className="h-4 w-full md:w-60 rounded-xl bg-silver-chalice-300 skelton-animation"></div>
            </div>
          </div>
        </li>

        <li className="pt-6 pb-3 hidden md:block">
          <div className="flex flex-col gap-9">
            <div className="flex flex-col">
              <div className="h-4 w-full md:w-33 rounded-xl bg-silver-chalice-300 skelton-animation"></div>
              <div className="mb-2"></div>
              <div className="h-4 w-full md:w-171.5 rounded-xl bg-silver-chalice-300 skelton-animation"></div>
            </div>

            <div className="flex flex-col">
              <div className="h-4 w-full md:w-33 rounded-xl bg-silver-chalice-300 skelton-animation"></div>
              <div className="mb-2"></div>
              <div className="h-4 w-full md:w-171.5 rounded-xl bg-silver-chalice-300 skelton-animation"></div>
            </div>
          </div>
        </li>

        <li>
          <div className="flex flex-row gap-5">
            <div className="h-31.25 w-43.75 rounded-xl bg-silver-chalice-200 skelton-animation"></div>
            <div className="h-31.25 w-43.75 rounded-xl bg-silver-chalice-200 skelton-animation"></div>
            <div className="h-31.25 w-43.75 hidden md:block rounded-xl bg-silver-chalice-200 skelton-animation"></div>
          </div>
        </li>

        <li className="mt-4 md:mt-9">
          <div className="h-15 w-full md:w-68.75 rounded-xl bg-silver-chalice-200 skelton-animation"></div>
        </li>
      </ul>
    </div>
  );
}
