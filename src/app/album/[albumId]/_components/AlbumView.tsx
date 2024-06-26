"use client";

import CardGrid from "@/components/CardGrid";
import Filters, { Filter } from "@/components/Filters";
import { UserConfigProvider } from "@/components/context/UserConfigContext";
import { useCardSorting } from "@/components/hooks/useCardSorting";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardData, SetData, ViewMode } from "@/types/types";
import { X } from "lucide-react";
import { useMemo, useState } from "react";
import Sorting from "./Sorting";
import Settings from "./settings/Settings";

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
  userConfig: { show17LandsSection: boolean } | null;
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
    <UserConfigProvider userConfig={userConfig}>
      <div className="flex flex-col space-y-2 pt-2 md:pt-0 gap-2">
        <div className="flex justify-between items-center gap-2">
          <div className="flex flex-col">
            <div
              data-testid="album-name-div"
              className="text-lg md:text-xl truncate"
            >
              {album.name}
            </div>
            <div data-testid="album-collection-status-div" className="text-sm">
              {album.setId != null && `(${collectedCardsCount}/${cards.size})`}
            </div>
          </div>
          <Settings
            isEditMode={isEditMode}
            albumId={album.id}
            availableSets={availableSets}
          />
        </div>
        <div className="flex justify-between w-full items-center gap-4">
          <div className="flex gap-x-2 items-center">
            <Filters filters={filters} setFilters={setFilters} />
          </div>
          <Sorting
            setSortingMethod={setSortingMethod}
            setSortingDirection={setSortingDirection}
            sortingDirection={sortingDirection}
          />
        </div>
        {filters.size !== 0 && (
          <div className="flex justify-between items-center">
            {Array.from(filters.keys()).length !== 0 && (
              <div className="flex flex-col items-center gap-2">
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
            <Button onClick={() => setFilters(new Map())}>Clear filters</Button>
          </div>
        )}
        <div className="hidden items-center gap-x-6 md:visible md:flex md:justify-end">
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
        <CardGrid
          cards={cardsToDisplay}
          cardsPerRow={cardsPerRow}
          viewMode={viewMode}
          isCardDeleteable={true}
        />
      </div>
    </UserConfigProvider>
  );
}

export default AlbumView;
