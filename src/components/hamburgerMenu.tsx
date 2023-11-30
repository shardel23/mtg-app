"use client";

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
import { AlbumData, SetData } from "@/types/types";
import { User } from "next-auth";
import Link from "next/link";
import CreateNewAlbumDialog from "./createNewAlbumDialog";
import Hamburger from "./icons/hamburger";
import SignOut from "./signOut";
import { ScrollArea } from "./ui/scroll-area";
import Username from "./username";

function HamburgerMenu({
  user,
  sets,
  albums,
}: {
  user: User;
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
        <Username user={user} />
        <DropdownMenuSeparator />
        <div className="flex items-center justify-between">
          <DropdownMenuLabel>My Albums</DropdownMenuLabel>
          <CreateNewAlbumDialog sets={sets} />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <ScrollArea viewportClassName="max-h-48">
            {albums.map((album) => (
              <DropdownMenuItem
                asChild
                key={album.id}
                className="w-full justify-start"
              >
                <Link href={`/album/${album.id}`}>{album.name}</Link>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className="flex justify-end">
          <SignOut />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default HamburgerMenu;
