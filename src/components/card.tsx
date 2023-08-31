"use client";

import { CardData, markCardIsCollected } from "@/actions/mtgActions";
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
        (card) => card.isInCollection
      );
      return inCollectionIndex === -1 ? 0 : inCollectionIndex;
    }
  );
  const [isVersionCollected, setIsVersionCollected] = useState<boolean[]>(
    () => {
      return cardVersions.map((card) => card.isInCollection!);
    }
  );

  const changeCardVersion = useCallback(() => {
    setCardVersionNumberToDisplay(
      (currVersionNum) => (currVersionNum + 1) % cardVersions.length
    );
  }, []);

  const card = cardVersions[cardVersionNumberToDisplay];

  return (
    <div>
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
          <div className="flex justify-center gap-x-2">
            <Image
              unoptimized
              src={`/assets/${card.setCode}/${card.setCode}-${
                card.rarity !== "common" ? card.rarity : `${card.rarity}-dark`
              }.svg`}
              height="15"
              width="15"
              alt={card.setCode}
            />
            <div> {card.setCode.toUpperCase()} </div>
            <div>#{card.collectorNumber}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;
