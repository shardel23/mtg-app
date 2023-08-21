"use client";

import { SetData } from "@/actions/mtgActions";
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
          <Button type="submit">Add Album</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateNewAlbum;
