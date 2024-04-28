import { getAlbum } from "@/actions/get/getAlbumAction";
import { getAllSets } from "@/actions/get/getAllSetsAction";
import { getUserConfig } from "@/actions/get/getUserConfigAction";
import AlbumView from "@/app/album/[albumId]/_components/AlbumView";

type PageParams = { username: string; albumId: string };

export default async function AlbumPage({ params }: { params: PageParams }) {
  const { album, cards, viewMode } = await getAlbum(
    params.username,
    params.albumId,
  );
  const sets = await getAllSets();
  const userConfig = await getUserConfig();
  if (album == null) {
    return (
      <>
        <div className="text-center"> Album not found </div>
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
