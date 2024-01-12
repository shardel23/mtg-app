import { getAlbum } from "@/actions/mtgActions";
import AlbumView from "@/app/album/[albumId]/AlbumView";

type PageParams = { username: string; albumId: string };

export default async function AlbumPage({ params }: { params: PageParams }) {
  const { album, cards, viewMode } = await getAlbum(
    params.username,
    params.albumId,
  );
  if (album == null) {
    return (
      <>
        <div className="text-center"> Album not found </div>
      </>
    );
  }
  return (
    <>
      <AlbumView album={album} cards={cards} viewMode={viewMode} />
    </>
  );
}
