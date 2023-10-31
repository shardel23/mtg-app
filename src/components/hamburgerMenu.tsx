"use client";

import { setCollectionCookie } from "@/actions/cookieActions";
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
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import CreateNewAlbumDialog from "./createNewAlbumDialog";
import Hamburger from "./icons/hamburger";
import SignOut from "./signOut";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";

function HamburgerMenu({
  user,
  sets,
  albums,
  collection,
}: {
  user: User | undefined;
  sets: SetData[];
  albums: AlbumData[];
  collection: string;
}) {
  const [_, startTransition] = useTransition();
  const router = useRouter();

  const collections = ["Default"];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Hamburger />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <div className="flex items-center justify-between">
          {user && <DropdownMenuLabel>{user.name}</DropdownMenuLabel>}
          <SignOut />
        </div>
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
            {collections.map((collectionName) => (
              <DropdownMenuItem key={collectionName}>
                <Label
                  className="mr-2"
                  onClick={() => {
                    startTransition(async () => {
                      await setCollectionCookie(collectionName);
                      router.push("/");
                    });
                  }}
                >
                  {collectionName}
                </Label>
                {collection === collectionName && (
                  <span className="text-green-500">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default HamburgerMenu;
