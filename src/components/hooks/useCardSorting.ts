import { CardData } from "@/types/types";
import { useMemo, useState } from "react";

const rarityPriority = {
  mythic: 3,
  rare: 2,
  uncommon: 1,
  common: 0,
} as const;

export const SORTINGS = {
  "Collector Number": (a: CardData, b: CardData) =>
    Number(a.collectorNumber) - Number(b.collectorNumber),
  Price: (a: CardData, b: CardData) =>
    (a.isFoil ? a.priceUsdFoil : a.priceUsd) -
    (b.isFoil ? b.priceUsdFoil : b.priceUsd),
  Name: (a: CardData, b: CardData) => a.name.localeCompare(b.name),
  Rarity: (a: CardData, b: CardData) =>
    rarityPriority[a.rarity as keyof typeof rarityPriority] -
    rarityPriority[b.rarity as keyof typeof rarityPriority],
} as const;

export const useCardSorting = (cards: Map<string, CardData[]>) => {
  const [sortingMethod, setSortingMethod] =
    useState<keyof typeof SORTINGS>("Collector Number");
  const [sortingDirection, setSortingDirection] = useState<"asc" | "desc">(
    "asc",
  );

  const sortedCards = useMemo(() => {
    const sortedCards = new Map<string, CardData[]>();
    const cardNames = Array.from(cards.keys());
    cardNames.sort((a, b) => {
      const cardA = cards.get(a)![0];
      const cardB = cards.get(b)![0];
      return SORTINGS[sortingMethod](cardA, cardB);
    });
    if (sortingDirection === "desc") {
      cardNames.reverse();
    }
    cardNames.forEach((cardName) => {
      sortedCards.set(cardName, cards.get(cardName)!);
    });
    return sortedCards;
  }, [cards, sortingMethod, sortingDirection]);

  return [
    sortedCards,
    setSortingMethod,
    setSortingDirection,
    sortingDirection,
  ] as const;
};
