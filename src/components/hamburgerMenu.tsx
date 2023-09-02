"use client";

import { AlbumData, SetData } from "@/actions/mtgActions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import CreateNewAlbumDialog from "./createNewAlbumDialog";
import Hamburger from "./icons/hamburger";
import { ScrollArea } from "./ui/scroll-area";

function HamburgerMenu({
  sets,
  albums,
}: {
  sets: SetData[];
  albums: AlbumData[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Hamburger />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <div className="flex justify-between items-center">
          <DropdownMenuLabel>My Albums</DropdownMenuLabel>
          <CreateNewAlbumDialog sets={sets} />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <ScrollArea className="h-48">
            {albums.map((album) => (
              <DropdownMenuItem
                asChild
                key={album.id}
                className="w-full justify-start"
              >
                <Link href={`/view/${album.id}`}>{album.name}</Link>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
          {/* <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default HamburgerMenu;
