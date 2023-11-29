"use client";

import { changeUsername } from "@/actions/mtgActions";
import { Loader2 } from "lucide-react";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import { useState, useTransition } from "react";
import Pencil from "./icons/pencil";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";

export function UserNav({ user }: { user: User }) {
  const [displayedUsername, setDisplayedUsername] = useState(user.username);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [editedUsername, setEditedUsername] = useState(user.username);
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenu
      onOpenChange={() => {
        setIsEditingUsername(false);
        setEditedUsername(displayedUsername);
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.image!} alt={user.name!} />
            <AvatarFallback>MTG</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            {isEditingUsername ? (
              <div className="flex justify-between gap-x-2">
                <Input
                  className="h-6"
                  value={editedUsername}
                  onChange={(e) => {
                    setEditedUsername(e.target.value);
                  }}
                />
                <form
                  action={() => {
                    startTransition(async () => {
                      const isSuccess = await changeUsername(editedUsername);
                      if (isSuccess) {
                        setDisplayedUsername(editedUsername);
                        setIsEditingUsername(false);
                      }
                    });
                  }}
                >
                  <Button
                    disabled={
                      editedUsername.length <= 2 ||
                      editedUsername === displayedUsername
                    }
                    variant="secondary"
                    className="h-6 w-12"
                  >
                    {isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <span>Save</span>
                    )}
                  </Button>
                </form>
              </div>
            ) : (
              <div className="flex justify-between">
                <p className="text-sm font-medium leading-none">
                  {displayedUsername}
                </p>
                <Pencil
                  className="hover:cursor-pointer"
                  onClick={() => {
                    setIsEditingUsername(true);
                  }}
                />
              </div>
            )}
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={() => signOut()}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
