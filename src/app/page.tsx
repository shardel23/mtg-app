import { getCollectionStats } from "@/actions/mtgActions";
import CollectionStats from "@/components/collectionStats";
import RedirectIfNotLoggedIn from "@/components/redirect";

export default async function Home() {
  const collectionData = await getCollectionStats();
  console.log(collectionData);
  return (
    <div>
      <RedirectIfNotLoggedIn />
      <div className="flex w-full flex-col items-center p-24 gap-y-8">
        <div className="text-2xl">Your collection status</div>
        <CollectionStats collectionData={collectionData} />
      </div>
    </div>
  );
}
