import LoadingBlock from "@/components/LoadingBlock";

export default function HomePageLoading() {
  return (
    <div className="flex w-full justify-center gap-x-8">
      <div className="flex flex-col gap-y-8 w-full items-center">
        {/* Set Albums Section */}
        <div className="flex flex-col w-full items-center gap-y-4">
          <LoadingBlock className="h-6 w-32" />
          <div className="grid px-2 grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-full">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-y-2 rounded-lg border-2 bg-slate-500 p-4"
              >
                <LoadingBlock className="h-6 w-3/4" />
                <LoadingBlock className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>

        {/* Custom Albums Section */}
        <div className="flex flex-col w-full items-center gap-y-4">
          <LoadingBlock className="h-6 w-32" />
          <div className="grid px-2 grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-full">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-y-2 rounded-lg border-2 bg-slate-500 p-4"
              >
                <LoadingBlock className="h-6 w-3/4" />
                <LoadingBlock className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Collection Details */}
      <div className="hidden lg:block w-80">
        <div className="flex flex-col gap-y-4 rounded-lg border-2 bg-slate-500 p-4">
          <LoadingBlock className="h-6 w-3/4" />
          <LoadingBlock className="h-4 w-1/2" />
          <LoadingBlock className="h-4 w-1/2" />
          <LoadingBlock className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
}
