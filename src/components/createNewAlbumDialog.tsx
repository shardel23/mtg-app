"use client";

import { createAlbumFromSetId } from "@/actions/mtgActions";
import { SetData } from "@/types/types";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import PlusCircle from "./icons/plus-circle";
import SetSelector from "./selectors/setSelector";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

function CreateNewAlbumDialog({ sets }: { sets: Array<SetData> }) {
  const [isPending, startTransition] = useTransition();
  const [selectedSetId, setSelectedSetId] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const router = useRouter();

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>
        <PlusCircle className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Album</DialogTitle>
          <DialogDescription>
            Select a magic set to create a new album
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between">
          <div className="w-3/4">
            <SetSelector
              sets={sets}
              onSetChange={(setId) => {
                setSelectedSetId(setId);
              }}
            />
          </div>
          <form
            action={async () => {
              if (selectedSetId === "") {
                return;
              }
              startTransition(async () => {
                const albumId = await createAlbumFromSetId(selectedSetId);
                setIsDialogOpen(false);
                if (albumId !== -1) {
                  router.push(`/album/${albumId}`);
                }
              });
            }}
          >
            <Button type="submit" disabled={selectedSetId === "" || isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Album
            </Button>
          </form>
        </div>
        <div>Or</div>
        {/* <CSVUploader
          onUploadSuccess={(albumId: number) => {
            setIsDialogOpen(false);
            if (albumId !== -1) {
              router.push(`/album/${albumId}`);
            }
          }}
        /> */}
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateNewAlbumDialog;
