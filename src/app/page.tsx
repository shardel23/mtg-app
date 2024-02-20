import { getCollectionStats } from "@/actions/get/getCollectionStatsAction";
import CollectionStats from "@/temp/components/CollectionStats";

export default async function Home() {
  const collectionData = await getCollectionStats();
  return (
    <div>
      <div className="flex w-full flex-col items-center gap-y-6 md:gap-y-8">
        <CollectionStats collectionData={collectionData} />
      </div>
    </div>
  );
}
