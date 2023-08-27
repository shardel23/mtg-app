"use client";

import { SetData, createAlbumFromSetId } from "@/actions/mtgActions";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import PlusCircle from "./icons/plus-circle";
import SetSelector from "./setSelector";
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
        <SetSelector
          sets={sets}
          onSetChange={(setId) => {
            setSelectedSetId(setId);
          }}
        />
        <DialogFooter>
          <form
            action={async () => {
              if (selectedSetId === "") {
                return;
              }
              const albumId = await createAlbumFromSetId(selectedSetId);
              setIsDialogOpen(false);
              if (albumId !== -1) {
                router.push(`/view/${albumId}`);
              }
            }}
          >
            <Button type="submit">Add Album</Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateNewAlbumDialog;
