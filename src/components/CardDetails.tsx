import { isCardMultiFace } from "@/actions/helpers";
import { updateAmountCollected } from "@/actions/update/updateAmountCollectedAction";
import { CardData, ViewMode } from "@/types/types";
import Image from "next/image";
import React, { useState, useTransition } from "react";
import DeleteCardDialog from "./DeleteCardDialog";
import IsFoilButton from "./cardDetails/IsFoilButton";
import ArrowUTurnRight from "./icons/ArrowUTurnRightIcon";
import Minus from "./icons/MinusIcon";
import Plus from "./icons/PlusIcon";
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
  cardVersions,
  amountCollected,
  setAmountCollected,
  onAmountCollectedChange,
  cardVersionIndex,
  viewMode,
  isCardDeleteable,
  isFoil,
  setIsFoil,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  card: CardData;
  cardVersions: CardData[];
  amountCollected: number;
  setAmountCollected: React.Dispatch<React.SetStateAction<number>>;
  onAmountCollectedChange: React.Dispatch<React.SetStateAction<boolean[]>>;
  cardVersionIndex: number;
  viewMode: ViewMode;
  isCardDeleteable?: boolean;
  isFoil: boolean;
  setIsFoil: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [cardFaceIndex, setCardFaceIndex] = useState<number>(0);
  const cardFaces = card.cardFaces || [];
  const isMultiFaced = isCardMultiFace(card);
  const isEditMode = viewMode === "edit";
  const cardPrice = isFoil ? card.priceUsdFoil : card.priceUsd;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-xs md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex justify-center">
            {isMultiFaced ? cardFaces[cardFaceIndex].name : card.name}
            {card.albumId && (
              <IsFoilButton
                cardId={card.id}
                albumId={card.albumId}
                isFoil={isFoil}
                setIsFoil={setIsFoil}
                isCollected={amountCollected > 0}
              />
            )}
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
              {isFoil && (
                <div className="absolute rounded-xl inset-0 bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 opacity-40 mix-blend-screen"></div>
              )}
              <div className="absolute bottom-0 right-0 rounded-full bg-black bg-opacity-50 px-1 py-0.5 text-xxs md:px-2 md:py-1 md:text-xs">
                {`$${cardPrice !== 0 ? cardPrice : "--"}`}
              </div>
            </div>
            <div className="flex justify-center gap-x-4">
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
              <CardAmountCollectedSection
                isEditMode={isEditMode}
                card={card}
                cardVersions={cardVersions}
                amountCollected={amountCollected}
                setAmountCollected={setAmountCollected}
                onAmountCollectedChange={onAmountCollectedChange}
                cardVersionIndex={cardVersionIndex}
                setIsFoil={setIsFoil}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          {isCardDeleteable && (
            <div className="flex justify-end">
              <DeleteCardDialog
                albumId={card.albumId as string}
                cardName={card.name}
                cardIds={cardVersions.map((card) => card.id)}
                isDisabled={!isEditMode}
              />
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const CardAmountCollectedSection = (props: {
  isEditMode: boolean;
  card: CardData;
  cardVersions: CardData[];
  amountCollected: number;
  setAmountCollected: React.Dispatch<React.SetStateAction<number>>;
  onAmountCollectedChange: React.Dispatch<React.SetStateAction<boolean[]>>;
  cardVersionIndex: number;
  setIsFoil: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [_, startTransition] = useTransition();

  if (!props.isEditMode) {
    return null;
  }

  return (
    <div className="flex items-center gap-x-2">
      <Button
        variant={"secondary"}
        className="w-12"
        disabled={props.amountCollected === 0}
        onClick={() => {
          startTransition(() => {
            updateAmountCollected(
              props.card.albumId!,
              props.card.id,
              Math.max(0, props.amountCollected - 1),
            );
          });
          props.onAmountCollectedChange((curr) => {
            const newIsVersionCollected = [...curr];
            newIsVersionCollected[props.cardVersionIndex] =
              props.amountCollected > 1;
            return newIsVersionCollected;
          });
          props.setAmountCollected((curr) => Math.max(0, curr - 1));
          if (props.amountCollected - 1 === 0) {
            props.setIsFoil(false);
          }
        }}
      >
        <Minus />
      </Button>
      <span className="px-2">{props.amountCollected}</span>
      <Button
        variant={"secondary"}
        className="w-12"
        onClick={() => {
          startTransition(() => {
            updateAmountCollected(
              props.card.albumId!,
              props.card.id,
              props.amountCollected + 1,
            );
          });
          props.onAmountCollectedChange((curr) => {
            const newIsVersionCollected = [...curr];
            newIsVersionCollected[props.cardVersionIndex] = true;
            return newIsVersionCollected;
          });
          props.setAmountCollected((curr) => curr + 1);
        }}
      >
        <Plus />
      </Button>
    </div>
  );
};
