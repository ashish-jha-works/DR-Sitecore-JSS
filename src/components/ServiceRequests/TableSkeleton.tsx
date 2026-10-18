export default function TableSkeleton({ version }: { version?: number }) {
  return (
    <div
      className={`w-full lg:table lg:rounded-t-3xl lg:bg-silver-chalice-100 lg:overflow-hidden ${
        version == 1 && 'mt-5 lg:mt-6'
      }`}
    >
      <div className="hidden lg:table-row bg-silver-chalice-300">
        <div className="lg:table-cell lg:p-6 lg:align-middle">
          <div className="h-4 bg-silver-chalice-400 rounded-lg relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
        </div>
        <div className="lg:table-cell lg:p-6 lg:align-middle">
          <div className="h-4 bg-silver-chalice-400 rounded-lg relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
        </div>
        <div className="lg:table-cell lg:p-6 lg:align-middle">
          <div className="h-4 bg-silver-chalice-400 rounded-lg relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
        </div>
        <div className="lg:table-cell lg:p-6 lg:align-middle">
          <div className="h-4 bg-silver-chalice-400 rounded-lg relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
        </div>
        <div className="lg:table-cell lg:p-6 lg:align-middle lg:last:table-cell">
          <div className="h-4 bg-silver-chalice-400 rounded-lg relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
        </div>
        <div className="lg:table-cell lg:p-6 lg:align-middle lg:last:table-cell"></div>
      </div>

      <div className="flex flex-col gap-3 lg:table-row-group mt-3 lg:mt-0">
        <div className="flex flex-wrap gap-3 p-3 rounded-xl bg-silver-chalice-100 lg:table-row lg:bg-transparent lg:p-0">
          <div className="hidden lg:table-cell lg:p-6 lg:align-middle">
            <div className="h-2.5 rounded-lg bg-silver-chalice-200 lg:h-4 lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
          </div>

          <div className="order-1 flex-[1_1_45%] lg:table-cell lg:p-6 lg:align-middle lg:order-0 lg:flex-none">
            <div className="h-5 max-w-18.75 rounded-full bg-silver-chalice-200 lg:h-9 lg:max-w-none lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
          </div>

          <div className="order-3 flex-[1_1_45%] text-left lg:table-cell lg:p-6 lg:align-middle lg:order-0 lg:flex-none">
            <div className="h-2.5 rounded-lg bg-silver-chalice-200 lg:h-4 lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
            <div className="mt-1 h-2.5 rounded-lg bg-silver-chalice-200 lg:h-4 lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
          </div>

          <div className="hidden lg:table-cell lg:p-6 lg:align-middle">
            <div className="h-2.5 rounded-lg bg-silver-chalice-200 lg:h-4 lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
          </div>
          <div className="hidden lg:table-cell lg:p-6 lg:align-middle">
            <div className="h-2.5 rounded-lg bg-silver-chalice-200 lg:h-4 lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
          </div>

          <div className="order-2 flex-[1_1_45%] text-right lg:table-cell lg:p-6 lg:align-middle lg:order-0 lg:flex-none">
            <div className="h-2.5 w-4.5 inline-block rounded-lg bg-silver-chalice-200 lg:h-9 lg:w-full lg:block lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
          </div>

          <div className="flex flex-col gap-1 order-4 flex-[1_1_45%] text-left lg:hidden">
            <div className="h-2.5 rounded-lg bg-silver-chalice-200 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
            <div className="h-2.5 rounded-lg bg-silver-chalice-200 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
            <div className="h-2.5 rounded-lg bg-silver-chalice-200 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 lg:table-row-group mt-3 lg:mt-0">
        <div className="flex flex-wrap gap-3 p-3 rounded-xl bg-silver-chalice-100 lg:table-row lg:bg-transparent lg:p-0">
          <div className="hidden lg:table-cell lg:p-6 lg:align-middle">
            <div className="h-2.5 rounded-lg bg-silver-chalice-200 lg:h-4 lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
          </div>

          <div className="order-1 flex-[1_1_45%] lg:table-cell lg:p-6 lg:align-middle lg:order-0 lg:flex-none">
            <div className="h-5 max-w-18.75 rounded-full bg-silver-chalice-200 lg:h-9 lg:max-w-none lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
          </div>

          <div className="order-3 flex-[1_1_45%] text-left lg:table-cell lg:p-6 lg:align-middle lg:order-0 lg:flex-none">
            <div className="h-2.5 rounded-lg bg-silver-chalice-200 lg:h-4 lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
            <div className="mt-1 h-2.5 rounded-lg bg-silver-chalice-200 lg:h-4 lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
          </div>

          <div className="hidden lg:table-cell lg:p-6 lg:align-middle">
            <div className="h-2.5 rounded-lg bg-silver-chalice-200 lg:h-4 lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
          </div>
          <div className="hidden lg:table-cell lg:p-6 lg:align-middle">
            <div className="h-2.5 rounded-lg bg-silver-chalice-200 lg:h-4 lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
          </div>

          <div className="order-2 flex-[1_1_45%] text-right lg:table-cell lg:p-6 lg:align-middle lg:order-0 lg:flex-none">
            <div className="h-2.5 w-4.5 inline-block rounded-lg bg-silver-chalice-200 lg:h-9 lg:w-full lg:block lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
          </div>

          <div className="flex flex-col gap-1 order-4 flex-[1_1_45%] text-left lg:hidden">
            <div className="h-2.5 rounded-lg bg-silver-chalice-200 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
            <div className="h-2.5 rounded-lg bg-silver-chalice-200 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
            <div className="h-2.5 rounded-lg bg-silver-chalice-200 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 lg:table-row-group mt-3 lg:mt-0">
        <div className="flex flex-wrap gap-3 p-3 rounded-xl bg-silver-chalice-100 lg:table-row lg:bg-transparent lg:p-0">
          <div className="hidden lg:table-cell lg:p-6 lg:align-middle">
            <div className="h-2.5 rounded-lg bg-silver-chalice-200 lg:h-4 lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
          </div>

          <div className="order-1 flex-[1_1_45%] lg:table-cell lg:p-6 lg:align-middle lg:order-0 lg:flex-none">
            <div className="h-5 max-w-18.75 rounded-full bg-silver-chalice-200 lg:h-9 lg:max-w-none lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
          </div>

          <div className="order-3 flex-[1_1_45%] text-left lg:table-cell lg:p-6 lg:align-middle lg:order-0 lg:flex-none">
            <div className="h-2.5 rounded-lg bg-silver-chalice-200 lg:h-4 lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
            <div className="mt-1 h-2.5 rounded-lg bg-silver-chalice-200 lg:h-4 lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
          </div>

          <div className="hidden lg:table-cell lg:p-6 lg:align-middle">
            <div className="h-2.5 rounded-lg bg-silver-chalice-200 lg:h-4 lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
          </div>
          <div className="hidden lg:table-cell lg:p-6 lg:align-middle">
            <div className="h-2.5 rounded-lg bg-silver-chalice-200 lg:h-4 lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
          </div>

          <div className="order-2 flex-[1_1_45%] text-right lg:table-cell lg:p-6 lg:align-middle lg:order-0 lg:flex-none">
            <div className="h-2.5 w-4.5 inline-block rounded-lg bg-silver-chalice-200 lg:h-9 lg:w-full lg:block lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
          </div>

          <div className="flex flex-col gap-1 order-4 flex-[1_1_45%] text-left lg:hidden">
            <div className="h-2.5 rounded-lg bg-silver-chalice-200 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
            <div className="h-2.5 rounded-lg bg-silver-chalice-200 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
            <div className="h-2.5 rounded-lg bg-silver-chalice-200 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 lg:table-row-group mt-3 lg:mt-0">
        <div className="flex flex-wrap gap-3 p-3 rounded-xl bg-silver-chalice-100 lg:table-row lg:bg-transparent lg:p-0">
          <div className="hidden lg:table-cell lg:p-6 lg:align-middle">
            <div className="h-2.5 rounded-lg bg-silver-chalice-200 lg:h-4 lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
          </div>

          <div className="order-1 flex-[1_1_45%] lg:table-cell lg:p-6 lg:align-middle lg:order-0 lg:flex-none">
            <div className="h-5 max-w-18.75 rounded-full bg-silver-chalice-200 lg:h-9 lg:max-w-none lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
          </div>

          <div className="order-3 flex-[1_1_45%] text-left lg:table-cell lg:p-6 lg:align-middle lg:order-0 lg:flex-none">
            <div className="h-2.5 rounded-lg bg-silver-chalice-200 lg:h-4 lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
            <div className="mt-1 h-2.5 rounded-lg bg-silver-chalice-200 lg:h-4 lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
          </div>

          <div className="hidden lg:table-cell lg:p-6 lg:align-middle">
            <div className="h-2.5 rounded-lg bg-silver-chalice-200 lg:h-4 lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
          </div>
          <div className="hidden lg:table-cell lg:p-6 lg:align-middle">
            <div className="h-2.5 rounded-lg bg-silver-chalice-200 lg:h-4 lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
          </div>

          <div className="order-2 flex-[1_1_45%] text-right lg:table-cell lg:p-6 lg:align-middle lg:order-0 lg:flex-none">
            <div className="h-2.5 w-4.5 inline-block rounded-lg bg-silver-chalice-200 lg:h-9 lg:w-full lg:block lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
          </div>

          <div className="flex flex-col gap-1 order-4 flex-[1_1_45%] text-left lg:hidden">
            <div className="h-2.5 rounded-lg bg-silver-chalice-200 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
            <div className="h-2.5 rounded-lg bg-silver-chalice-200 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
            <div className="h-2.5 rounded-lg bg-silver-chalice-200 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
