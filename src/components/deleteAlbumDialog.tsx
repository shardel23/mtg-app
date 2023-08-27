import { deleteAlbum } from "@/actions/mtgActions";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
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

function DeleteAlbumDialog({ albumId }: { albumId: number }) {
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const router = useRouter();

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size={"icon"}>
          <Trash />
        </Button>
      </DialogTrigger>
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
                setIsDialogOpen(false);
                router.push("/");
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
    </Dialog>
  );
}

export default DeleteAlbumDialog;
