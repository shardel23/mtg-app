import LoadingBlock from "@/components/loadingBlock";
import LoadingGrid from "@/components/loadingGrid";

export default function SearchPageLoading() {
  return (
    <div className="flex flex-col gap-y-4">
      <LoadingBlock className="h-8 w-full" />
      <LoadingGrid />
    </div>
  );
}
