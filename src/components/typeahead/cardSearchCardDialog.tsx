"use client";

import { addCardToAlbum } from "@/actions/mtgActions";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import * as Scry from "scryfall-sdk";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

function CardSearchCardDialog({
  isOpen,
  setIsOpen,
  card,
  albumId,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  card: Scry.Card | null;
  albumId: number;
}) {
  const [renderedCard, setRenderedCard] = useState<Scry.Card | null>(card);
  const [cardVersions, setCardVersions] = useState<Scry.Card[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<
    string | null | undefined
  >(card?.id);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setRenderedCard(card);
  }, [card]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setSelectedVersion(card?.id);
    fetch(
      `https://api.scryfall.com/cards/search?order=released&unique=prints&q=name:/${
        card?.name ?? ""
      }/`,
    )
      .then((response) => response.json())
      .then((res) => {
        if (!res.data) {
          setCardVersions([]);
          return;
        }
        setCardVersions(res.data);
      });
  }, [isOpen]);

  useEffect(() => {
    if (selectedVersion == null) {
      return;
    }
    fetch(`https://api.scryfall.com/cards/${selectedVersion}`)
      .then((response) => response.json())
      .then((res) => {
        if (!res) {
          return;
        }
        setRenderedCard(res);
      });
  }, [selectedVersion]);

  if (renderedCard == null) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(false);
      }}
    >
      <DialogContent>
        <div className="flex flex-col items-center justify-center">
          <Image
            unoptimized
            src={
              renderedCard.image_uris?.normal ??
              renderedCard.card_faces[0]?.image_uris?.normal ??
              ""
            }
            alt={renderedCard.name}
            height={400}
            width={300}
            placeholder="blur"
            blurDataURL="/assets/card-back.jpg"
          />
          <div className="flex flex-col items-center justify-center p-4">
            <div className="flex gap-x-4 items-center w-72">
              <Label> Version </Label>
              <Select
                value={selectedVersion ?? ""}
                onValueChange={setSelectedVersion}
              >
                <SelectTrigger id="color">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="max-h-48">
                    {cardVersions.map((option, idx) => (
                      <SelectItem key={idx} value={option.id}>
                        {option.set_name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <form
            action={async () => {
              startTransition(async () => {
                const res = await addCardToAlbum(renderedCard.id, albumId);
                if (res) {
                  setIsOpen(false);
                }
              });
            }}
          >
            <Button disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CardSearchCardDialog;
