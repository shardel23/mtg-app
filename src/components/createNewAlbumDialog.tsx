"use client";

import { createAlbumFromSetId, createEmptyAlbum } from "@/actions/mtgActions";
import { SetData } from "@/types/types";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import PlusCircle from "./icons/plus-circle";
import SetSelector from "./selectors/setSelector";
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
import { Input } from "./ui/input";
import { LineSeperator } from "./ui/lineSeperator";

function CreateNewAlbumDialog({ sets }: { sets: Array<SetData> }) {
  const [isPending, startTransition] = useTransition();
  const [isPendingNewEmptyAlbum, startTransitionNewEmptyAlbum] =
    useTransition();
  const [selectedSetId, setSelectedSetId] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [emptyAlbumName, setEmptyAlbumName] = useState<string>("");
  const router = useRouter();

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>
        <PlusCircle
          data-testid="create-album-button"
          className="cursor-pointer"
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Album</DialogTitle>
          <DialogDescription>
            Select a magic set to create a new album or create an empty album
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between">
          <div className="w-3/4">
            <Input
              value={emptyAlbumName}
              onChange={(e) => setEmptyAlbumName(e.target.value)}
            />
          </div>
          <form
            action={async () => {
              startTransitionNewEmptyAlbum(async () => {
                const albumId = await createEmptyAlbum(emptyAlbumName);
                setIsDialogOpen(false);
                if (albumId !== -1) {
                  router.push(`/album/${albumId}`);
                }
              });
            }}
          >
            <Button
              type="submit"
              disabled={emptyAlbumName.length < 2 || isPendingNewEmptyAlbum}
            >
              {isPendingNewEmptyAlbum && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Album
            </Button>
          </form>
        </div>
        <LineSeperator content="Or" />
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
                const albumId = await createAlbumFromSetId(selectedSetId);
                setIsDialogOpen(false);
                if (albumId !== -1) {
                  router.push(`/album/${albumId}`);
                }
              });
            }}
          >
            <Button
              data-testid="create-album-from-set-button"
              type="submit"
              disabled={selectedSetId === "" || isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Album
            </Button>
          </form>
        </div>
        {/* <div>Or</div>
        <CSVUploader
          onUploadSuccess={(albumId: number) => {
            setIsDialogOpen(false);
            if (albumId !== -1) {
              router.push(`/album/${albumId}`);
            }
          }}
        /> */}
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateNewAlbumDialog;
