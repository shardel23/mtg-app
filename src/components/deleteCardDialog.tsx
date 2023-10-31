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
} from "./ui/dialog";

function DeleteCardDialog({
  albumId,
  cardName,
}: {
  albumId: number;
  cardName: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Trash
        className="invisible md:visible md:cursor-pointer md:hover:text-red-500"
        onClick={() => setIsDialogOpen(true)}
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete {cardName}?</DialogTitle>
          <DialogDescription>
            This action is irreversible. You will lose all the data associated
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <form
            action={async () => {
              startTransition(async () => {
                // TODO: Add optimistic update
                await deleteCardFromAlbum(albumId, cardName);
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
