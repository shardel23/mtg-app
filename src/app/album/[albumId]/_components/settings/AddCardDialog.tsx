"use client";

import { addSetToAlbum } from "@/actions/update/addSetToAlbumAction";
import { SetData } from "@/types/types";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import SetSelector from "../../../../../components/selectors/SetSelector";
import CardSearchGridView from "../../../../../components/typeahead/CardSearchGridView";
import { Button } from "../../../../../components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../../components/ui/dialog";
import { LineSeperator } from "../../../../../components/ui/lineSeperator";

function AddCardDialog({
  albumId,
  sets,
  onCardAdd,
}: {
  albumId: string;
  sets: Array<SetData>;
  onCardAdd: () => void;
}) {
  const [selectedSetId, setSelectedSetId] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  return (
    <DialogContent className="w-full lg:max-w-5xl h-[75%] flex flex-col">
      <DialogHeader>
        <DialogTitle>Add Cards</DialogTitle>
        <DialogDescription>
          Search for a card to add to this album OR select a set to add all
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
              const res = await addSetToAlbum(selectedSetId, albumId);
              if (!res) {
                console.log("Failed to add set to album");
                return;
              }
              onCardAdd();
            });
          }}
        >
          <Button type="submit" disabled={selectedSetId === "" || isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Set
          </Button>
        </form>
      </div>
      <LineSeperator content="Or" />
      <div className="flex flex-col h-[90%]">
        <CardSearchGridView albumId={albumId} onCardAdd={onCardAdd} />
      </div>
      <DialogFooter></DialogFooter>
    </DialogContent>
  );
}

export default AddCardDialog;
