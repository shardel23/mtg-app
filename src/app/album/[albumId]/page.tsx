import { getAlbum } from "@/actions/mtgActions";
import AlbumView from "./AlbumView";

export default async function AlbumPage({
  params: { albumId },
}: {
  params: { albumId: string };
}) {
  const { album, cards, viewMode } = await getAlbum("", albumId);
  if (album == null) {
    return (
      <>
        <div className="text-center">Album not found in your collection</div>
      </>
    );
  }
  return (
    <>
      <AlbumView album={album} cards={cards} viewMode={viewMode} />
    </>
  );
}
