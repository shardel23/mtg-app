"use client";

import { useState } from "react";
import CardSearchGridView from "./typeahead/cardSearchGridView";
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

function AddCardDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Add Cards</Button>
      </DialogTrigger>
      <DialogContent className="w-full lg:max-w-5xl h-[75%] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Card</DialogTitle>
          <DialogDescription>
            Search for a crad to add to this album
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col h-[90%]">
          <CardSearchGridView />
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddCardDialog;
