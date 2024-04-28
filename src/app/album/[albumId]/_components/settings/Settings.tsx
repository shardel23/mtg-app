"use client";

import { updateUserConfig } from "@/actions/update/updateUserConfigAction";
import AddCardDialog from "@/app/album/[albumId]/_components/settings/AddCardDialog";
import DeleteAlbumDialog from "@/app/album/[albumId]/_components/settings/DeleteAlbumDialog";
import { useUserConfigContext } from "@/components/context/UserConfigContext";
import SettingsIcon from "@/components/icons/SettingsIcon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SetData } from "@/types/types";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const dialogs = {
  addCard: "addCard",
  deleteAlbum: "deleteAlbum",
};

export default function Settings({
  isEditMode,
  albumId,
  availableSets,
}: {
  isEditMode: boolean;
  albumId: string;
  availableSets: Array<SetData>;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<string>(
    "" as keyof typeof dialogs,
  );
  const router = useRouter();
  const userConfig = useUserConfigContext();

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"icon"}>
            <SettingsIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Toggle17LandsStats isEnabled={userConfig.show17LandsSection} />
          </DropdownMenuItem>
          {isEditMode && (
            <DropdownMenuItem>
              <DialogTrigger
                className="flex justify-start w-full"
                onClick={() => {
                  setDialogType(dialogs.addCard);
                }}
              >
                Add cards
              </DialogTrigger>
            </DropdownMenuItem>
          )}
          {isEditMode && (
            <DropdownMenuItem>
              <DialogTrigger
                className="flex justify-start w-full"
                onClick={() => {
                  setDialogType(dialogs.deleteAlbum);
                }}
              >
                Delete album
              </DialogTrigger>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogType === dialogs.addCard && (
        <AddCardDialog
          albumId={albumId}
          sets={availableSets}
          onCardAdd={() => {
            setIsDialogOpen(false);
          }}
        />
      )}
      {dialogType === dialogs.deleteAlbum && (
        <DeleteAlbumDialog
          albumId={albumId}
          onDelete={() => {
            setIsDialogOpen(false);
            router.push("/");
          }}
        />
      )}
    </Dialog>
  );
}

const Toggle17LandsStats = ({ isEnabled }: { isEnabled: boolean }) => {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex justify-between items-center w-full">
      <span>Enable 17Lands stats</span>
      <Checkbox
        checked={isEnabled}
        onCheckedChange={(checked) => {
          startTransition(async () => {
            await updateUserConfig({ show17LandsSection: checked as boolean });
          });
        }}
      />
    </div>
  );
};
