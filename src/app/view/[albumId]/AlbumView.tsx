"use client";

import { CardData } from "@/actions/mtgActions";
import CardGrid from "@/components/cardGrid";
import DeleteAlbumDialog from "@/components/deleteAlbumDialog";
import { Button } from "@/components/ui/button";
import { useCallback, useMemo, useState } from "react";

type Filter = (cardVersions: CardData[]) => boolean;

function AlbumView({
  albumId,
  albumName,
  cards,
}: {
  albumId: number;
  albumName: string;
  cards: Map<string, CardData[]>;
}) {
  const [cardsPerRow, setCardsPerRow] = useState<number>(5);
  const [filters, setFilters] = useState<Filter[]>([]);

  const applyFilters = useCallback(() => {
    if (filters.length === 0) {
      return cards;
    }
    const filteredCards = new Map<string, CardData[]>();
    Array.from(cards.keys())
      .filter((cardName) => {
        const cardVersions = cards.get(cardName)!;
        return filters.every((filter) => filter(cardVersions));
      })
      .forEach((cardName) => {
        filteredCards.set(cardName, cards.get(cardName)!);
      });
    return filteredCards;
  }, [cards, filters]);

  const filteredCards = applyFilters();

  const collectedCardsCount = useMemo(() => {
    return Array.from(cards.keys()).filter((cardName) => {
      const cardVersions = cards.get(cardName)!;
      return cardVersions.some((card) => card.isInCollection);
    }).length;
  }, [cards]);

  return (
    <div className="pt-2 md:pt-0 space-y-2">
      <div className="text-xl"> {albumName} </div>
      <div className="text-sm">
        {`Collected: ${collectedCardsCount}/${cards.size}`}{" "}
      </div>
      <div className="flex justify-between">
        <div className="flex gap-x-2 items-center">
          <Button
            variant="default"
            onClick={() => {
              setFilters([]);
            }}
            className="text-xs px-1 w-24 md:text-sm md:w-32"
          >
            Show all
          </Button>
          <Button
            variant="default"
            onClick={() => {
              setFilters((curr) => [
                ...curr,
                (cardVersions) =>
                  cardVersions.every((card) => !card.isInCollection),
              ]);
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
      <CardGrid cards={filteredCards} cardsPerRow={cardsPerRow} />
    </div>
  );
}

export default AlbumView;
