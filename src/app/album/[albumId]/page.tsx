import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getAlbum } from "@/actions/get/getAlbumAction";
import { getAllSets } from "@/actions/get/getAllSetsAction";
import { getUserConfig } from "@/actions/get/getUserConfigAction";
import AlbumView from "./_components/AlbumView";
import { getServerSession } from "next-auth/next";

export default async function AlbumPage({
  params: { albumId },
}: {
  params: { albumId: string };
}) {
  const session = await getServerSession(authOptions);
  const { album, cards, viewMode } = await getAlbum("", albumId);
  const sets = await getAllSets();
  const userConfig = await getUserConfig();
  if (album == null) {
    return (
      <>
        <div className="text-center">Album not found in your collection</div>
      </>
    );
  }

  const username = session?.user?.username;
  const albumSharePath =
    username != null
      ? `/u/${encodeURIComponent(username)}/${encodeURIComponent(albumId)}`
      : undefined;

  return (
    <>
      <AlbumView
        album={album}
        cards={cards}
        viewMode={viewMode}
        availableSets={sets}
        userConfig={userConfig}
        albumSharePath={albumSharePath}
      />
    </>
  );
}
