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

function deleteCardDialog({
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
      <DialogTrigger>
        <Trash className="invisible md:visible absolute bottom-1/10 right-1/10 md:hover:text-red-500 md:cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this card?</DialogTitle>
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

export default deleteCardDialog;
