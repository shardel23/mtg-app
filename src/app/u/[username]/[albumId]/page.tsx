import { getAlbum } from "@/actions/mtgActions";
import AlbumView from "@/app/album/[albumId]/AlbumView";
import RedirectIfNotLoggedIn from "@/components/redirect";

type PageParams = { username: string; albumId: string };

export default async function AlbumPage({ params }: { params: PageParams }) {
  const { album, cards, viewMode } = await getAlbum(
    params.username,
    params.albumId,
  );
  if (album == null) {
    return (
      <>
        <RedirectIfNotLoggedIn />
        <div className="text-center"> Album not found </div>
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
