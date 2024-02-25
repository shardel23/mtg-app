"use client";

import { markCardAsCollected } from "@/actions/update/markCardAsCollectedAction";
import { CardData, ViewMode } from "@/types/types";
import Image from "next/image";
import { useCallback, useState, useTransition } from "react";
import CardDetails from "./CardDetails";
import ArrowRightLeft from "./icons/ArrowRightLeftIcon";
import CheckCircle from "./icons/CheckCircleIcon";

function Card({
  cardVersions,
  viewMode,
  isCardDeleteable,
}: {
  cardVersions: CardData[];
  viewMode: ViewMode;
  isCardDeleteable?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [cardVersionNumberToDisplay, setCardVersionNumberToDisplay] = useState(
    () => {
      const inCollectionIndex = cardVersions.findIndex(
        (card) => card.isCollected,
      );
      return inCollectionIndex === -1 ? 0 : inCollectionIndex;
    },
  );
  const [isVersionCollected, setIsVersionCollected] = useState<boolean[]>(
    () => {
      return cardVersions.map((card) => card.isCollected!);
    },
  );
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);

  const changeCardVersion = useCallback(() => {
    const newVersionNum =
      (cardVersionNumberToDisplay + 1) % cardVersions.length;
    setCardVersionNumberToDisplay(newVersionNum);
    setIsFoil(cardVersions[newVersionNum].isFoil);
    setNumCollected(cardVersions[newVersionNum].numCollected);
  }, [cardVersionNumberToDisplay, cardVersions]);

  const card = cardVersions[cardVersionNumberToDisplay];
  const isEditMode = viewMode === "edit";

  const [numCollected, setNumCollected] = useState<number>(card.numCollected);
  const [isFoil, setIsFoil] = useState<boolean>(card.isFoil);
  const price = isFoil ? card.priceUsdFoil : card.priceUsd;

  return (
    <div className="rounded p-1 shadow-md">
      {card.image && (
        <div>
          <div className="relative">
            <Image
              unoptimized
              className={`${
                !isVersionCollected[cardVersionNumberToDisplay]
                  ? "opacity-50"
                  : ""
              }`}
              src={card.image}
              alt={card.name}
              height={400}
              width={300}
              placeholder="blur"
              blurDataURL="/assets/card-back.jpg"
              onClick={() => setIsCardDialogOpen(true)}
            />
            {isFoil && (
              <div
                className="absolute rounded-xl inset-0 bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 opacity-40 mix-blend-screen"
                onClick={() => setIsCardDialogOpen(true)}
              ></div>
            )}
            {isEditMode && (
              <CheckCircle
                className={
                  "absolute left-1/10 top-1/10 cursor-pointer " +
                  (isVersionCollected[cardVersionNumberToDisplay]
                    ? "text-green-400 "
                    : "text-slate-400 ") +
                  (isVersionCollected[cardVersionNumberToDisplay]
                    ? "md:hover:text-white"
                    : "md:hover:text-green-500")
                }
                onClick={() => {
                  setIsVersionCollected((curr) => {
                    const newIsVersionCollected = [...curr];
                    newIsVersionCollected[cardVersionNumberToDisplay] =
                      !newIsVersionCollected[cardVersionNumberToDisplay];
                    return newIsVersionCollected;
                  });
                  startTransition(() => {
                    markCardAsCollected(
                      card.albumId!,
                      card.id,
                      !isVersionCollected[cardVersionNumberToDisplay],
                    );
                  });
                }}
              />
            )}
            {cardVersions.length > 1 && (
              <ArrowRightLeft
                className="absolute right-1/10 top-1/10 cursor-pointer text-slate-400 md:hover:text-red-500"
                onClick={() => {
                  changeCardVersion();
                }}
              />
            )}
            <div className="absolute bottom-0 left-0 rounded-full bg-black bg-opacity-50 px-1 py-0.5 text-xxs md:px-2 md:py-1 md:text-xs">
              {`$${price !== 0 ? price : "--"}`}
            </div>
          </div>
          <div className="flex items-center justify-center gap-x-1 pt-1 md:pt-2">
            <Image
              src={`/assets/${card.setCode}/${card.setCode}-${
                card.rarity !== "common" ? card.rarity : `${card.rarity}-dark`
              }.svg`}
              alt={card.setCode}
              className="h-2.5 w-2.5 md:h-4 md:w-4"
              width={16}
              height={16}
            />
            <div className="text-xxs md:text-xs">
              {card.setCode.toUpperCase()}
            </div>
            <div className="text-xxxs text-gray-400 md:text-xxs">
              #{card.collectorNumber}
            </div>
          </div>
        </div>
      )}
      {isCardDialogOpen && (
        <CardDetails
          isOpen={isCardDialogOpen}
          setIsOpen={setIsCardDialogOpen}
          card={card}
          cardVersions={cardVersions}
          amountCollected={numCollected}
          setAmountCollected={setNumCollected}
          onAmountCollectedChange={setIsVersionCollected}
          cardVersionIndex={cardVersionNumberToDisplay}
          viewMode={viewMode}
          isCardDeleteable={isCardDeleteable}
          isFoil={isFoil}
          setIsFoil={setIsFoil}
        />
      )}
    </div>
  );
}

export default Card;
