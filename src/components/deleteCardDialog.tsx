import { deleteCardFromAlbum } from "@/actions/mtgActions";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import Trash from "./icons/trash";
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

function DeleteCardDialog({
  albumId,
  cardName,
  cardIds,
}: {
  albumId: number;
  cardName: string;
  cardIds: string[];
}) {
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size={"icon"}>
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete {"'" + cardName + "'"} and all
            versions of it from this album?
          </DialogTitle>
          <DialogDescription>
            This action is irreversible. You will lose all the data associated
            to this card.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <form
            action={async () => {
              startTransition(async () => {
                // TODO: Add optimistic update
                await deleteCardFromAlbum(albumId, cardIds);
                setIsDialogOpen(false);
              });
            }}
          >
            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Card
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteCardDialog;
