import { getAlbumCards } from "@/actions/mtgActions";
import RedirectIfNotLoggedIn from "@/components/redirect";
import AlbumView from "./AlbumView";

export default async function AlbumPage({
  params: { albumId },
}: {
  params: { albumId: string };
}) {
  const { album, cards, viewMode } = await getAlbumCards(albumId);
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
      <AlbumView album={album} cards={cards} viewMode={viewMode} />
    </>
  );
}
