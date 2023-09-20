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
  const [cardFace, setCardFace] = useState<"front" | "back">("front");
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-xs md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex justify-center">{card.name}</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center">
          <div className="flex flex-col gap-y-4">
            <Image
              unoptimized
              src={cardFace === "front" ? card.image : card.backFace?.image!}
              alt={cardFace === "front" ? card.name : card.backFace?.name!}
              height={400}
              width={300}
              placeholder="blur"
              blurDataURL="/assets/card-back.jpg"
            />
            <div className="flex justify-center">
              {card.backFace && (
                <Button
                  variant={"secondary"}
                  className="w-12"
                  onClick={() => {
                    setCardFace((curr) =>
                      curr === "front" ? "back" : "front"
                    );
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
