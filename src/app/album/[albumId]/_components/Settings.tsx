"use client";

import { deleteAlbum } from "@/actions/delete/deleteAlbumAction";
import { updateUserConfig } from "@/actions/update/updateUserConfigAction";
import { useUserConfigContext } from "@/components/context/UserConfigContext";
import SettingsIcon from "@/components/icons/SettingsIcon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function Settings({
  isEditMode,
  album,
}: {
  isEditMode: boolean;
  album: { id: string; name: string; setId: string | null | undefined };
}) {
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
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
              <DialogTrigger>Delete album</DialogTrigger>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this album?</DialogTitle>
          <DialogDescription>
            This action is irreversible. You will lose all the data associated
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <form
            action={async () => {
              startTransition(async () => {
                await deleteAlbum(album.id);
                setIsDialogOpen(false);
                router.push("/");
              });
            }}
          >
            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Album
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
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
