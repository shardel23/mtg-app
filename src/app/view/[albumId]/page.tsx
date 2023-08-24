import { getAlbumCards } from "@/actions/mtgActions";
import AlbumView from "./AlbumView";

export default async function AlbumPage({
  params,
}: {
  params: { albumId: string };
}) {
  const cards = await getAlbumCards(parseInt(params.albumId));
  return <AlbumView cards={cards} />;
}
