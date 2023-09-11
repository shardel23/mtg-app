"use client";

import { markCardIsCollected } from "@/actions/mtgActions";
import { CardData } from "@/types/types";
import Image from "next/image";
import { useCallback, useState, useTransition } from "react";
import DeleteCardDialog from "./deleteCardDialog";
import ArrowRightLeft from "./icons/arrow-right-left";
import CheckCircle from "./icons/check-circle";

function Card({ cardVersions }: { cardVersions: CardData[] }) {
  const [isPending, startTransition] = useTransition();
  const [cardVersionNumberToDisplay, setCardVersionNumberToDisplay] = useState(
    () => {
      const inCollectionIndex = cardVersions.findIndex(
        (card) => card.isCollected
      );
      return inCollectionIndex === -1 ? 0 : inCollectionIndex;
    }
  );
  const [isVersionCollected, setIsVersionCollected] = useState<boolean[]>(
    () => {
      return cardVersions.map((card) => card.isCollected!);
    }
  );

  const changeCardVersion = useCallback(() => {
    setCardVersionNumberToDisplay(
      (currVersionNum) => (currVersionNum + 1) % cardVersions.length
    );
  }, []);

  const card = cardVersions[cardVersionNumberToDisplay];

  return (
    <div className="shadow-md rounded p-1">
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
            />
            <CheckCircle
              className={
                "absolute top-1/10 left-1/10 cursor-pointer " +
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
                  markCardIsCollected(
                    card.albumId as number,
                    card.id,
                    !isVersionCollected[cardVersionNumberToDisplay]
                  );
                });
              }}
            />
            {cardVersions.length > 1 && (
              <ArrowRightLeft
                className="absolute top-1/10 right-1/10 text-slate-400 md:hover:text-red-500 cursor-pointer"
                onClick={() => {
                  changeCardVersion();
                }}
              />
            )}
            <DeleteCardDialog
              albumId={card.albumId as number}
              cardName={card.name}
            />
          </div>
          <div className="flex justify-center items-center gap-x-1 pt-1 md:pt-2">
            <img
              src={`/assets/${card.setCode}/${card.setCode}-${
                card.rarity !== "common" ? card.rarity : `${card.rarity}-dark`
              }.svg`}
              alt={card.setCode}
              className="h-2.5 w-2.5 md:h-4 md:w-4"
            />
            <div className="text-xxs md:text-xs">
              {card.setCode.toUpperCase()}
            </div>
            <div className="text-gray-400 text-xxxs md:text-xxs">
              #{card.collectorNumber}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;
