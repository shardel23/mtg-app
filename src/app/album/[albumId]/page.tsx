import { getAlbum } from "@/actions/get/getAlbumAction";
import { getAllSets } from "@/actions/get/getAllSetsAction";
import { getUserConfig } from "@/actions/get/getUserConfigAction";
import AlbumView from "./_components/AlbumView";

export default async function AlbumPage({
  params: { albumId },
}: {
  params: { albumId: string };
}) {
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
  return (
    <>
      <AlbumView
        album={album}
        cards={cards}
        viewMode={viewMode}
        availableSets={sets}
        userConfig={userConfig}
      />
    </>
  );
}
