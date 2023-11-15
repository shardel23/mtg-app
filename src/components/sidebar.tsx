import { getAllAlbums, getAllSets } from "@/actions/mtgActions";
import Link from "next/link";
import CreateNewAlbumDialog from "./createNewAlbumDialog";
import ExportCollectionButton from "./exportCollectionButton";
import ImportCollectionButton from "./importCollectionButton";
import { Button } from "./ui/button";

export async function Sidebar() {
  const sets = await getAllSets();
  const albums = await getAllAlbums();
  return (
    <div className="fixed left-0 hidden h-[85%] overflow-x-auto overflow-y-scroll no-scrollbar md:flex md:w-1/4">
      <div className="py-4 md:space-y-4">
        <div className="flex items-center md:flex-col md:px-3">
          <div className="flex w-full items-center justify-between gap-x-3 md:pb-4 md:pt-4">
            <h2 className="text-sm font-semibold tracking-tight md:px-4 md:text-lg">
              My Albums
            </h2>
            <CreateNewAlbumDialog sets={sets} />
          </div>
          <div className="flex flex-row md:flex-col md:space-y-1">
            {albums.map((album) => (
              <Button
                asChild
                key={album.id}
                variant="ghost"
                className="w-full justify-start"
              >
                <Link href={`/album/${album.id}`}>{album.name}</Link>
              </Button>
            ))}
          </div>
          <div className="flex w-full items-center justify-start md:pb-4 md:pt-4">
            <h2 className="text-sm font-semibold tracking-tight md:px-4 md:text-lg">
              More
            </h2>
          </div>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href={`/trades`}>Tradeable Cards</Link>
          </Button>
          <div className="flex w-full items-center justify-start md:pb-4 md:pt-4">
            <h2 className="text-sm font-semibold tracking-tight md:px-4 md:text-lg">
              Options
            </h2>
          </div>
          <div className="flex w-full flex-row md:flex-col md:space-y-1">
            <ExportCollectionButton />
          </div>
          <div className="flex w-full flex-row md:flex-col md:space-y-1">
            <ImportCollectionButton />
          </div>
        </div>
      </div>
    </div>
  );
}
