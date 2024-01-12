import { getCollectionStats } from "@/actions/mtgActions";
import CollectionStats from "@/components/collectionStats";

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
