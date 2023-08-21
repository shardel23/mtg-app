import { getAllSets } from "@/actions/mtgActions";
import Link from "next/link";
import CreateNewAlbum from "./createNewAlbum";
import { Button } from "./ui/button";

export async function Sidebar() {
  const sets = await getAllSets();
  return (
    <div className="pb-12 w-1/4">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="px-4 text-lg font-semibold tracking-tight">
            MTG Library
          </h2>
          <div className="space-y-1">
            <Link href={`/view`}>
              <Button variant="ghost" className="w-full justify-start">
                View Cards
              </Button>
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <div className="flex items-center justify-between">
            <h2 className="px-4 text-lg font-semibold tracking-tight">
              My Albums
            </h2>
            <div className="space-y-1">
              <CreateNewAlbum sets={sets} />
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start">
            Dominaria United
          </Button>
        </div>
      </div>
    </div>
  );
}
