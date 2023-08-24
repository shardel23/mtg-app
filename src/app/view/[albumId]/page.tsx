import { getAlbumCards } from "@/actions/mtgActions";
import AlbumView from "./AlbumView";

export default async function AlbumPage({
  params,
}: {
  params: { albumId: string };
}) {
  const albumIdInt = parseInt(params.albumId);
  const cards = await getAlbumCards(albumIdInt);
  return <AlbumView albumId={albumIdInt} cards={cards} />;
}
