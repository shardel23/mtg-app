"use client";

import { SetData, createAlbum } from "@/actions/mtgActions";
import { useTransition } from "react";
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
        <SetSelector sets={sets} onSetChange={(set) => {}} />
        <DialogFooter>
          <Button
            type="submit"
            onClick={() =>
              startTransition(() =>
                createAlbum(
                  "March of the Machine",
                  "392f7315-dc53-40a3-a2cc-5482dbd498b3"
                )
              )
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
