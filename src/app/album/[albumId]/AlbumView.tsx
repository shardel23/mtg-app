"use client";

import AddCardDialog from "@/components/AddCardDialog";
import CardGrid from "@/components/CardGrid";
import Filters, { Filter } from "@/components/Filters";
import { useCardSorting } from "@/components/hooks/useCardSorting";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardData, SetData, ViewMode } from "@/types/types";
import { X } from "lucide-react";
import { useMemo, useState } from "react";
import Sorting from "./Sorting";
import Settings from "./_components/Settings";

function AlbumView({
  album,
  cards,
  viewMode,
  availableSets,
  userConfig,
}: {
  album: { id: string; name: string; setId: string | null | undefined };
  cards: Map<string, CardData[]>;
  viewMode: ViewMode;
  availableSets: Array<SetData>;
  userConfig?: { show17LandsSection: boolean } | null;
}) {
  const [cardsPerRow, setCardsPerRow] = useState<number>(5);
  const [filters, setFilters] = useState<Map<string, Filter>>(new Map());

  const isEditMode = viewMode === "edit";

  const filteredCards = useMemo(() => {
    if (filters.size === 0) {
      return cards;
    }
    const filteredCards = new Map<string, CardData[]>();
    Array.from(cards.keys())
      .filter((cardName) => {
        const cardVersions = cards.get(cardName)!;
        return Array.from(filters.values()).every((filter) =>
          filter.filterLogic(cardVersions),
        );
      })
      .forEach((cardName) => {
        filteredCards.set(cardName, cards.get(cardName)!);
      });
    return filteredCards;
  }, [cards, filters]);

  const [
    cardsToDisplay,
    setSortingMethod,
    setSortingDirection,
    sortingDirection,
  ] = useCardSorting(filteredCards);

  const collectedCardsCount = useMemo(() => {
    return Array.from(cards.keys()).filter((cardName) => {
      const cardVersions = cards.get(cardName)!;
      return cardVersions.some((card) => card.isCollected);
    }).length;
  }, [cards]);

  return (
    <div className="space-y-2 pt-2 md:pt-0">
      <div className="flex justify-between">
        <div className="flex items-center gap-x-4">
          <div data-testid="album-name-div" className="text-xl">
            {album.name}
          </div>
          <div data-testid="album-collection-status-div" className="text-sm">
            {album.setId != null &&
              `Collected: ${collectedCardsCount}/${cards.size}`}
          </div>
          {isEditMode && (
            <AddCardDialog albumId={album.id} sets={availableSets} />
          )}
        </div>
        <Settings
          isEditMode={isEditMode}
          album={album}
          userConfig={userConfig}
        />
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-y-4">
          <div className="flex gap-x-8 items-center">
            <div className="flex gap-x-2 items-center">
              <Filters filters={filters} setFilters={setFilters} />
              {filters.size !== 0 && (
                <Button onClick={() => setFilters(new Map())}>
                  Clear filters
                </Button>
              )}
            </div>
            <Sorting
              setSortingMethod={setSortingMethod}
              setSortingDirection={setSortingDirection}
              sortingDirection={sortingDirection}
            />
          </div>
          {Array.from(filters.keys()).length !== 0 && (
            <div className="flex items-center gap-x-2">
              <div>Active filters:</div>
              {Array.from(filters.keys()).map((filterName) => (
                <Badge
                  variant="secondary"
                  key={filterName}
                  className="mb-1 mr-1 gap-x-2"
                >
                  {`${filterName}: ${filters.get(filterName)?.inputValues}`}
                  <X
                    className="h-3 w-3 text-muted-foreground hover:cursor-pointer hover:text-foreground"
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
        <div className="hidden items-center gap-x-6 md:visible md:flex">
          <div>Cards per row:</div>
          <Button
            variant="ghost"
            disabled={cardsPerRow === 1}
            onClick={() =>
              setCardsPerRow((curr) => (curr === 1 ? curr : curr - 1))
            }
          >
            -
          </Button>
          <div>{cardsPerRow}</div>
          <Button
            variant="ghost"
            disabled={cardsPerRow === 12}
            onClick={() =>
              setCardsPerRow((curr) => (curr === 12 ? curr : curr + 1))
            }
          >
            +
          </Button>
        </div>
      </div>
      <CardGrid
        cards={cardsToDisplay}
        cardsPerRow={cardsPerRow}
        viewMode={viewMode}
        isCardDeleteable={true}
      />
    </div>
  );
}

export default AlbumView;
