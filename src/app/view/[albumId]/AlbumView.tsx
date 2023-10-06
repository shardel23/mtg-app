"use client";

import CardGrid from "@/components/cardGrid";
import DeleteAlbumDialog from "@/components/deleteAlbumDialog";
import Filters, { Filter } from "@/components/filters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardData } from "@/types/types";
import { X } from "lucide-react";
import { useMemo, useState } from "react";

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
  const [filters, setFilters] = useState<Map<string, Filter>>(new Map());

  const filteredCards = useMemo(() => {
    if (filters.size === 0) {
      return cards;
    }
    const filteredCards = new Map<string, CardData[]>();
    Array.from(cards.keys())
      .filter((cardName) => {
        const cardVersions = cards.get(cardName)!;
        return Array.from(filters.values()).every((filter) =>
          filter.filterLogic(cardVersions)
        );
      })
      .forEach((cardName) => {
        filteredCards.set(cardName, cards.get(cardName)!);
      });
    return filteredCards;
  }, [cards, filters]);

  const collectedCardsCount = useMemo(() => {
    return Array.from(cards.keys()).filter((cardName) => {
      const cardVersions = cards.get(cardName)!;
      return cardVersions.some((card) => card.isCollected);
    }).length;
  }, [cards]);

  return (
    <div className="pt-2 md:pt-0 space-y-2">
      <div className="flex justify-between">
        <div className="flex gap-x-4 items-center">
          <div className="text-xl"> {albumName} </div>
          <div className="text-sm">
            {`Collected: ${collectedCardsCount}/${cards.size}`}
          </div>
        </div>
        <DeleteAlbumDialog albumId={albumId} />
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-y-2">
          <div className="flex gap-x-2">
            <Filters filters={filters} setFilters={setFilters} />
            {filters.size !== 0 && (
              <Button onClick={() => setFilters(new Map())}>
                Clear filters
              </Button>
            )}
          </div>
          {Array.from(filters.keys()).length !== 0 && (
            <div className="flex gap-x-2 items-center">
              <div>Active filters:</div>
              {Array.from(filters.keys()).map((filterName) => (
                <Badge
                  variant="secondary"
                  key={filterName}
                  className="mr-1 mb-1 gap-x-2"
                >
                  {`${filterName}: ${filters.get(filterName)?.inputValues}`}
                  <X
                    className="h-3 w-3 text-muted-foreground hover:text-foreground hover:cursor-pointer"
                    onClick={() => {
                      setFilters((curr) => {
                        const newFilters = new Map(curr);
                        newFilters.delete(filterName);
                        return newFilters;
                      });
                    }}
                  />
                </Badge>
              ))}
            </div>
          )}
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
