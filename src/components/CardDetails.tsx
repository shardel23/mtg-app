import { isCardMultiFace } from "@/actions/helpers";
import { updateAmountCollected } from "@/actions/update/updateAmountCollectedAction";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useCardContext } from "./CardContext";
import DeleteCardDialog from "./DeleteCardDialog";
import PriceTag from "./PriceTag";
import Card17LandsStats from "./cardDetails/Card17LandsStats";
import IsFoilButton from "./cardDetails/IsFoilButton";
import { useUserConfigContext } from "./context/UserConfigContext";
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

export default function CardDetails({}: {}) {
  const {
    isCardDialogOpen,
    viewMode,
    isCardDeleteable,
    currentCard: card,
    cardVersions,
    setIsCardDialogOpen,
  } = useCardContext();
  const userConfig = useUserConfigContext();

  const [cardFaceIndex, setCardFaceIndex] = useState<number>(0);

  if (card == null) {
    return null;
  }

  const cardFaces = card.cardFaces || [];
  const isMultiFaced = isCardMultiFace(card);
  const isEditMode = viewMode === "edit";
  const price = card.isFoil ? card.priceUsdFoil : card.priceUsd;

  return (
    <Dialog open={isCardDialogOpen} onOpenChange={setIsCardDialogOpen}>
      <DialogContent className="max-w-xs md:max-w-lg p-4 md:p-6">
        <DialogHeader>
          <DialogTitle className="flex justify-center">
            {isMultiFaced ? cardFaces[cardFaceIndex].name : card.name}
            <IsFoilButton />
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
              {card.isFoil && (
                <div className="absolute rounded-xl inset-0 bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 opacity-40 mix-blend-screen"></div>
              )}
              <PriceTag price={price} />
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
              <CardAmountCollectedSection isEditMode={isEditMode} />
            </div>
          </div>
        </div>
        {userConfig.show17LandsSection && <Card17LandsStats />}
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

const CardAmountCollectedSection = (props: { isEditMode: boolean }) => {
  const { currentCard: card, setNumCollected, setIsFoil } = useCardContext();
  const [_, startTransition] = useTransition();

  if (card == null || !props.isEditMode) {
    return null;
  }

  return (
    <div className="flex items-center gap-x-2">
      <Button
        variant={"secondary"}
        className="w-12"
        disabled={card.numCollected === 0}
        onClick={() => {
          startTransition(() => {
            updateAmountCollected(
              card.albumId!,
              card.id,
              Math.max(0, card.numCollected - 1),
            );
          });
          setNumCollected(Math.max(0, card.numCollected - 1));
        }}
      >
        <Minus />
      </Button>
      <span className="px-2">{card.numCollected}</span>
      <Button
        variant={"secondary"}
        className="w-12"
        onClick={() => {
          startTransition(() => {
            updateAmountCollected(
              card.albumId!,
              card.id,
              card.numCollected + 1,
            );
          });
          setNumCollected(card.numCollected + 1);
        }}
      >
        <Plus />
      </Button>
    </div>
  );
};
