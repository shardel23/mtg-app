import { getAlbumCards } from "@/actions/mtgActions";
import RedirectIfNotLoggedIn from "@/components/redirect";
import AlbumView from "./AlbumView";

export default async function AlbumPage({
  params,
}: {
  params: { albumId: string };
}) {
  const albumIdInt = parseInt(params.albumId);
  const { albumName, cards } = await getAlbumCards(albumIdInt);
  if (albumName === "") {
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
      <AlbumView albumId={albumIdInt} albumName={albumName} cards={cards} />
    </>
  );
}
