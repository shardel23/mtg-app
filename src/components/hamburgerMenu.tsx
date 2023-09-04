"use client";

import { AlbumData, SetData, setCollection } from "@/actions/mtgActions";
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
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import CreateNewAlbumDialog from "./createNewAlbumDialog";
import Hamburger from "./icons/hamburger";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";

function HamburgerMenu({
  sets,
  albums,
  collection,
}: {
  sets: SetData[];
  albums: AlbumData[];
  collection: string;
}) {
  const [_, startTransition] = useTransition();
  const router = useRouter();

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
          <ScrollArea viewportClassName="max-h-48">
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
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Collection</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <ScrollArea viewportClassName="max-h-36">
            <DropdownMenuItem>
              <Label
                className="mr-2"
                onClick={() => {
                  startTransition(async () => {
                    await setCollection("Default");
                    router.push("/");
                  });
                }}
              >
                Default
              </Label>
              {collection === "Default" && (
                <span className="text-green-500">✓</span>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Label
                className="mr-2"
                onClick={() => {
                  startTransition(async () => {
                    await setCollection("Test");
                    router.push("/");
                  });
                }}
              >
                Test
              </Label>
              {collection === "Test" && (
                <span className="text-green-500">✓</span>
              )}
            </DropdownMenuItem>
          </ScrollArea>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default HamburgerMenu;
