"use client";

import { CardData } from "@/actions/mtgActions";
import CardGrid from "@/components/cardGrid";
import DeleteAlbumDialog from "@/components/deleteAlbumDialog";
import { Button } from "@/components/ui/button";
import { useCallback, useMemo, useState } from "react";

function AlbumView({
  albumId,
  cards,
}: {
  albumId: number;
  cards: Map<string, CardData[]>;
}) {
  const [cardToDisplay, setCardsToDisplay] =
    useState<Map<string, CardData[]>>(cards);
  const [cardsPerRow, setCardsPerRow] = useState<number>(5);

  const collectedCardsCount = useMemo(() => {
    return Array.from(cards.keys()).filter((cardName) => {
      const cardVersions = cards.get(cardName)!;
      return cardVersions.some((card) => card.isInCollection);
    }).length;
  }, [cards]);

  const showMissingCards = useCallback(() => {
    const missingCards = new Map<string, CardData[]>();
    Array.from(cards.keys())
      .filter((cardName) => {
        const cardVersions = cards.get(cardName)!;
        return cardVersions.every((card) => !card.isInCollection);
      })
      .forEach((cardName) => {
        missingCards.set(cardName, cards.get(cardName)!);
      });
    setCardsToDisplay(missingCards);
  }, [cards]);

  return (
    <div className="pt-2 md:pt-0 space-y-2">
      <div>{`Collected: ${collectedCardsCount}/${cards.size}`} </div>
      <div className="flex justify-between">
        <div className="flex gap-x-2 items-center">
          <Button
            variant="default"
            onClick={() => {
              setCardsToDisplay(cards);
            }}
            className="text-xs px-1 w-24 md:text-sm md:w-32"
          >
            Show all
          </Button>
          <Button
            variant="default"
            onClick={() => {
              showMissingCards();
            }}
            className="text-xs px-1 w-24 md:text-sm md:w-32"
          >
            Show missing
          </Button>
          <DeleteAlbumDialog albumId={albumId} />
        </div>
        <div className="gap-x-6 items-center hidden md:flex md:visible">
          <div>Cards per row:</div>
          <Button
            variant="ghost"
            onClick={() => setCardsPerRow((curr) => curr - 1)}
          >
            -
          </Button>
          <div>{cardsPerRow}</div>
          <Button
            variant="ghost"
            onClick={() => setCardsPerRow((curr) => curr + 1)}
          >
            +
          </Button>
        </div>
      </div>
      <CardGrid cards={cardToDisplay} cardsPerRow={cardsPerRow} />
    </div>
  );
}

export default AlbumView;
