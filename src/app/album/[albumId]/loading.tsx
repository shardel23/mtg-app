import LoadingBlock from "@/components/loadingBlock";
import LoadingGrid from "@/components/loadingGrid";

export default function AlbumPageLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <LoadingBlock className="h-6 w-72" />
      <LoadingBlock className="h-4 w-24" />
      <div className="flex justify-between">
        <LoadingBlock className="h-12 w-48" />
        <LoadingBlock className="h-12 w-48" />
      </div>
      <LoadingBlock className="h-12 w-full" />
      <LoadingGrid />
    </div>
  );
}
