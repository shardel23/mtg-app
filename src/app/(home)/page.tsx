import { getCollectionStats } from "@/actions/get/getCollectionStatsAction";
import CollectionStats from "@/components/CollectionStats";
import LandingPage from "@/components/LandingPage";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isLogged = session?.user != null;

  if (!isLogged) {
    return <LandingPage />;
  }

  const collectionData = await getCollectionStats();
  return (
    <div>
      <div className="flex w-full flex-col items-center gap-y-6 md:gap-y-8">
        <CollectionStats collectionData={collectionData} />
      </div>
    </div>
  );
}
