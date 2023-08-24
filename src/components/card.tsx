"use client";

import { CardData, markCardIsCollected } from "@/actions/mtgActions";
import Image from "next/image";
import { useCallback, useState, useTransition } from "react";
import ArrowRightLeft from "./icons/arrow-right-left";

function Card({ cardVersions }: { cardVersions: CardData[] }) {
  const [isPending, startTransition] = useTransition();
  const [cardVersionNumber, setCardVersionNumber] = useState(() => {
    const inCollectionIndex = cardVersions.findIndex(
      (card) => card.isInCollection
    );
    return inCollectionIndex === -1 ? 0 : inCollectionIndex;
  });

  const changeCardVersion = useCallback(() => {
    setCardVersionNumber(
      (currVersionNum) => (currVersionNum + 1) % cardVersions.length
    );
  }, []);

  const card = cardVersions[cardVersionNumber];

  return (
    <div>
      <div className="flex justify-between">
        <div className="truncate">{card.name}</div>
        <div>#{card.collectorNumber}</div>
      </div>
      {card.image && (
        <div className="relative">
          <Image
            className={`${!card.isInCollection ? "opacity-50" : ""}`}
            src={card.image}
            alt={card.name}
            height={400}
            width={300}
            onClick={() => {
              startTransition(() => {
                markCardIsCollected(
                  card.albumId as number,
                  card.id,
                  !card.isInCollection
                );
              });
            }}
          />
          {cardVersions.length > 1 && (
            <ArrowRightLeft
              className="absolute top-6 right-6 hover:text-red-500 cursor-pointer"
              onClick={() => {
                changeCardVersion();
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Card;
