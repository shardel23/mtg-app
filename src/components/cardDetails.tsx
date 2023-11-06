import { isCardMultiFace } from "@/actions/helpers";
import { CardData } from "@/types/types";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import DeleteCardDialog from "./deleteCardDialog";
import ArrowUTurnRight from "./icons/arrow-uturn-right";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export default function CardDetails({
  isOpen,
  setIsOpen,
  card,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  card: CardData;
}) {
  const [cardFaceIndex, setCardFaceIndex] = useState<number>(0);
  const cardFaces = card.cardFaces || [];
  const isMultiFaced = isCardMultiFace(card);
  const [price, setPrice] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/card?cardId=${card.id}`)
      .then((res) => res.json())
      .then((data) => {
        setPrice(data.price);
      });
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-xs md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex justify-center">
            {isMultiFaced ? cardFaces[cardFaceIndex].name : card.name}
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-center">
          <div className="flex flex-col gap-y-4">
            <div className="relative">
              <Image
                unoptimized
                src={isMultiFaced ? cardFaces[cardFaceIndex].image : card.image}
                alt={isMultiFaced ? cardFaces[cardFaceIndex].name : card.name}
                height={400}
                width={300}
                placeholder="blur"
                blurDataURL="/assets/card-back.jpg"
              />
              <div className="absolute bottom-0 right-0 rounded-full bg-black bg-opacity-50 px-1 py-0.5 text-xxs md:px-2 md:py-1 md:text-xs">
                ${price ?? "--"}
              </div>
            </div>
            <div className="flex justify-center">
              {isMultiFaced && (
                <Button
                  variant={"secondary"}
                  className="w-12"
                  onClick={() => {
                    setCardFaceIndex((curr) => (curr + 1) % cardFaces.length);
                  }}
                >
                  <ArrowUTurnRight />
                </Button>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <div className="flex justify-end">
            <DeleteCardDialog
              albumId={card.albumId as number}
              cardName={card.name}
            />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
