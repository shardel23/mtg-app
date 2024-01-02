import { isCardMultiFace } from "@/actions/helpers";
import { updateAmountCollected } from "@/actions/mtgActions";
import { CardData, ViewMode } from "@/types/types";
import Image from "next/image";
import React, { useState, useTransition } from "react";
import useFetch from "react-fetch-hook";
import DeleteCardDialog from "./deleteCardDialog";
import ArrowUTurnRight from "./icons/arrow-uturn-right";
import Minus from "./icons/minus";
import Plus from "./icons/plus";
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
}) {
  const [isPending, startTransition] = useTransition();
  const [cardFaceIndex, setCardFaceIndex] = useState<number>(0);
  const cardFaces = card.cardFaces || [];
  const isMultiFaced = isCardMultiFace(card);
  const { isLoading, data } = useFetch<{ price: string | null }>(
    `/api/card?cardId=${card.id}`,
  );

  const isEditMode = viewMode === "edit";

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
                {isLoading ? <CardPriceLoading /> : `$${data?.price ?? "--"}`}
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
              {isEditMode && (
                <div className="flex items-center gap-x-2">
                  <Button
                    variant={"secondary"}
                    className="w-12"
                    disabled={!isEditMode || amountCollected === 0}
                    onClick={() => {
                      startTransition(() => {
                        updateAmountCollected(
                          card.albumId!,
                          card.id,
                          Math.max(0, amountCollected - 1),
                        );
                      });
                      onAmountCollectedChange((curr) => {
                        const newIsVersionCollected = [...curr];
                        newIsVersionCollected[cardVersionIndex] =
                          amountCollected > 1;
                        return newIsVersionCollected;
                      });
                      setAmountCollected((curr) => Math.max(0, curr - 1));
                    }}
                  >
                    <Minus />
                  </Button>
                  <span className="px-2">{amountCollected}</span>
                  <Button
                    variant={"secondary"}
                    className="w-12"
                    disabled={!isEditMode}
                    onClick={() => {
                      startTransition(() => {
                        updateAmountCollected(
                          card.albumId!,
                          card.id,
                          amountCollected + 1,
                        );
                      });
                      onAmountCollectedChange((curr) => {
                        const newIsVersionCollected = [...curr];
                        newIsVersionCollected[cardVersionIndex] = true;
                        return newIsVersionCollected;
                      });
                      setAmountCollected((curr) => curr + 1);
                    }}
                  >
                    <Plus />
                  </Button>
                </div>
              )}
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

const CardPriceLoading = () => {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
