"use client";

import { SetData, createAlbumFromSetId } from "@/actions/mtgActions";
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

async function CreateNewAlbum({ sets }: { sets: Array<SetData> }) {
  const [isPending, startTransition] = useTransition();
  const [selectedSetId, setSelectedSetId] = useState<string>("");

  return (
    <Dialog>
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
          <Button
            type="submit"
            onClick={() =>
              startTransition(() => {
                if (selectedSetId === "") {
                  return;
                }
                createAlbumFromSetId(selectedSetId);
              })
            }
          >
            Add Album
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateNewAlbum;
