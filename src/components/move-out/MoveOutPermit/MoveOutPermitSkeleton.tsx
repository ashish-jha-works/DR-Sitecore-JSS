/** Desktop + mobile skeletons for move-out permit. */
const MoveOutPermitSkeleton = () => {
  return (
    <div className="flex flex-col gap-5 md:gap-6 w-full">
      {/* Desktop */}
      <div className="hidden md:flex flex-col gap-6 w-full">
        <div className="bg-silver-chalice-100 flex flex-col gap-5 p-6 md:p-8 rounded-xl skelton-animation w-full">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 shrink-0 rounded-full bg-silver-chalice-300" />
            <div className="h-5 w-48 rounded-full bg-silver-chalice-300" />
          </div>
          <div className="flex flex-col gap-3">
            <div className="h-2.5 w-full rounded-full bg-silver-chalice-300" />
            <div className="h-2.5 w-[75%] rounded-full bg-silver-chalice-300" />
          </div>
          <div className="mx-auto mt-1 w-full max-w-68.5 h-14 rounded-xl bg-white-pure" />
        </div>
        <div className="btn-wrapper flex justify-end">
          <div className="w-68.75 h-15 rounded-xl bg-silver-chalice-300 skelton-animation" />
        </div>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden flex-col gap-5 w-full">
        <div className="bg-silver-chalice-100 flex flex-col gap-5 p-4 rounded-xl skelton-animation w-full">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 shrink-0 rounded-full bg-silver-chalice-300" />
            <div className="h-5 w-36 rounded-full bg-silver-chalice-300" />
          </div>
          <div className="w-full h-28 rounded-xl bg-white-pure" />
        </div>
        <div className="btn-wrapper">
          <div className="w-full h-11 rounded-xl bg-silver-chalice-300 skelton-animation" />
        </div>
      </div>
    </div>
  );
};

export default MoveOutPermitSkeleton;
