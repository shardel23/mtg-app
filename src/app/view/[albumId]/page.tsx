import { getAlbumCards } from "@/actions/mtgActions";
import AlbumView from "./AlbumView";

export default async function AlbumPage({
  params,
}: {
  params: { albumId: string };
}) {
  const albumIdInt = parseInt(params.albumId);
  const { albumName, cards } = await getAlbumCards(albumIdInt);
  if (albumName === "") {
    return <div className="text-center">Album not found</div>;
  }
  return <AlbumView albumId={albumIdInt} albumName={albumName} cards={cards} />;
}
