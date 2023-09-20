import { CardData } from "@/types/types";
import Image from "next/image";
import React, { useState } from "react";
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
  const isMultiFaced = cardFaces.length > 1;
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
            <Image
              unoptimized
              src={isMultiFaced ? cardFaces[cardFaceIndex].image : card.image}
              alt={isMultiFaced ? cardFaces[cardFaceIndex].name : card.name}
              height={400}
              width={300}
              placeholder="blur"
              blurDataURL="/assets/card-back.jpg"
            />
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
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
