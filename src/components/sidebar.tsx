import { getAllAlbums, getAllSets } from "@/actions/mtgActions";
import Link from "next/link";
import CreateNewAlbumDialog from "./createNewAlbumDialog";
import { Button } from "./ui/button";

export async function Sidebar() {
  const sets = await getAllSets();
  const albums = await getAllAlbums();
  return (
    <div className="md:w-1/4 overflow-x-auto">
      <div className="md:space-y-4 py-4">
        <div className="md:px-3 flex items-center md:flex-col">
          <div className="flex items-center justify-between gap-x-3 md:pb-4">
            <h2 className="md:px-4 text-sm md:text-lg font-semibold tracking-tight">
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
                <Link href={`/view/${album.id}`}>{album.name}</Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
