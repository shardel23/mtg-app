import { getAlbumCards } from "@/actions/mtgActions";
import RedirectIfNotLoggedIn from "@/components/redirect";
import AlbumView from "./AlbumView";

export default async function AlbumPage({
  params,
}: {
  params: { albumId: string };
}) {
  const albumIdInt = parseInt(params.albumId);
  const { album, cards } = await getAlbumCards(albumIdInt);
  if (album == null) {
    return (
      <>
        <RedirectIfNotLoggedIn />
        <div className="text-center">Album not found in your collection</div>
      </>
    );
  }
  return (
    <>
      <RedirectIfNotLoggedIn />
      <AlbumView album={album} cards={cards} />
    </>
  );
}
