"use client";

import { markCardAsCollected } from "@/actions/update/markCardAsCollectedAction";
import Image from "next/image";
import { useTransition } from "react";
import { useCardContext } from "./CardContext";
import CardDetails from "./CardDetails";
import PriceTag from "./PriceTag";
import ArrowRightLeft from "./icons/ArrowRightLeftIcon";
import CheckCircle from "./icons/CheckCircleIcon";

function Card({}: {}) {
  const {
    isCardDialogOpen,
    currentCard: card,
    hasMoreVersions,
    viewMode,
    changeCardVersion,
    setNumCollected,
    setIsCardDialogOpen,
  } = useCardContext();

  const [_, startTransition] = useTransition();

  if (card == null) {
    return null;
  }

  const isCardCollected = card.numCollected > 0;
  const isEditMode = viewMode === "edit";
  const price = card.isFoil ? card.priceUsdFoil : card.priceUsd;

  return (
    <div className="rounded p-1 shadow-md">
      {card.image && (
        <div>
          <div className="relative">
            <Image
              unoptimized
              className={`${!isCardCollected ? "opacity-50" : ""}`}
              src={card.image}
              alt={card.name}
              height={400}
              width={300}
              placeholder="blur"
              blurDataURL="/assets/card-back.jpg"
              onClick={() => setIsCardDialogOpen(true)}
            />
            {card.isFoil && (
              <div
                className="absolute rounded-xl inset-0 bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 opacity-40 mix-blend-screen"
                onClick={() => setIsCardDialogOpen(true)}
              ></div>
            )}
            {isEditMode && (
              <CheckCircle
                className={
                  "absolute left-1/10 top-1/10 cursor-pointer " +
                  (isCardCollected ? "text-green-400 " : "text-slate-400 ") +
                  (isCardCollected
                    ? "md:hover:text-white"
                    : "md:hover:text-green-500")
                }
                onClick={() => {
                  setNumCollected(isCardCollected ? 0 : 1);
                  startTransition(() => {
                    markCardAsCollected(
                      card.albumId!,
                      card.id,
                      !isCardCollected,
                    );
                  });
                }}
              />
            )}
            {hasMoreVersions && (
              <ArrowRightLeft
                className="absolute right-1/10 top-1/10 cursor-pointer text-slate-400 md:hover:text-red-500"
                onClick={() => {
                  changeCardVersion();
                }}
              />
            )}
            <PriceTag price={price} />
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
      {isCardDialogOpen && <CardDetails />}
    </div>
  );
}

export default Card;
