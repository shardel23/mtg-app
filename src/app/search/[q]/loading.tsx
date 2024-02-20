import LoadingBlock from "@/temp/components/LoadingBlock";
import LoadingGrid from "@/temp/components/LoadingGrid";

export default function SearchPageLoading() {
  return (
    <div className="flex flex-col gap-y-4">
      <LoadingBlock className="h-8 w-full" />
      <LoadingGrid />
    </div>
  );
}
