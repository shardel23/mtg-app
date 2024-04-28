import { deleteAlbum } from "@/actions/delete/deleteAlbumAction";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { Button } from "../../../../../components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../../components/ui/dialog";

function DeleteAlbumDialog({
  albumId,
  onDelete,
}: {
  albumId: string;
  onDelete: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you sure you want to delete this album?</DialogTitle>
        <DialogDescription>
          This action is irreversible. You will lose all the data associated
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <form
          action={async () => {
            startTransition(async () => {
              await deleteAlbum(albumId);
              onDelete();
            });
          }}
        >
          <Button type="submit" variant="destructive" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Album
          </Button>
        </form>
      </DialogFooter>
    </DialogContent>
  );
}

export default DeleteAlbumDialog;
