"use client";

import { changeUsername } from "@/actions/mtgActions";
import { Loader2 } from "lucide-react";
import { User } from "next-auth";
import { useState, useTransition } from "react";
import Pencil from "./icons/PencilIcon";
import { Button } from "./ui/button";
import { DropdownMenuLabel } from "./ui/dropdown-menu";
import { Input } from "./ui/input";

interface Props {
  user: User;
}

function Username({ user }: Props) {
  const [displayedUsername, setDisplayedUsername] = useState(user.username);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [editedUsername, setEditedUsername] = useState(user.username);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <DropdownMenuLabel className="font-normal">
      <div className="flex flex-col space-y-2">
        {isEditingUsername ? (
          <div className="flex justify-between gap-x-2">
            <Input
              className="h-6"
              value={editedUsername}
              onChange={(e) => {
                setEditedUsername(e.target.value);
                setError(null);
              }}
            />
            <form
              action={() => {
                startTransition(async () => {
                  const { result, error } =
                    await changeUsername(editedUsername);
                  if (result) {
                    setDisplayedUsername(editedUsername);
                    setIsEditingUsername(false);
                  } else {
                    setError(error!);
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
        {error && <p className="text-xs leading-none text-red-500">{error}</p>}
        <p className="text-xs leading-none text-muted-foreground">
          {user.email}
        </p>
      </div>
    </DropdownMenuLabel>
  );
}

export default Username;
