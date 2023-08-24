"use client";

import {
  CardData,
  deleteCardFromAlbum,
  markCardIsCollected,
} from "@/actions/mtgActions";
import Image from "next/image";
import { useCallback, useState, useTransition } from "react";
import ArrowRightLeft from "./icons/arrow-right-left";
import CheckCircle from "./icons/check-circle";
import Trash from "./icons/trash";

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
      <div className="flex justify-between">
        <div className="truncate">{card.name}</div>
        <div>#{card.collectorNumber}</div>
      </div>
      {card.image && (
        <div className="relative">
          <Image
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
              "absolute top-6 left-6  cursor-pointer " +
              (isVersionCollected[cardVersionNumberToDisplay]
                ? "text-green-500 "
                : "text-white ") +
              (isVersionCollected[cardVersionNumberToDisplay]
                ? "hover:text-white"
                : "hover:text-green-500")
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
          <Trash
            className="absolute bottom-6 right-6 hover:text-red-500 cursor-pointer"
            onClick={() => {
              startTransition(() => {
                // TODO: Add optimistic update
                deleteCardFromAlbum(card.albumId as number, card.name);
              });
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Card;
