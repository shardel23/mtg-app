"use client";

import { CardData } from "@/actions/mtgActions";
import Card from "@/components/card";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";

function AlbumView({ cards }: { cards: Map<string, CardData[]> }) {
  const [cardToDisplay, setCardsToDisplay] =
    useState<Map<string, CardData[]>>(cards);

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
    <div>
      <div>Cards count: {cardToDisplay.size}</div>
      <div className="flex gap-x-6 items-center">
        <Button
          variant="default"
          onClick={() => {
            setCardsToDisplay(cards);
          }}
        >
          Show all
        </Button>
        <Button
          variant="default"
          onClick={() => {
            showMissingCards();
          }}
        >
          Show missing cards
        </Button>
      </div>
      <div className="grid grid-cols-5 gap-1">
        {Array.from(cardToDisplay.keys()).map((cardName) => {
          const cardVersions = cardToDisplay.get(cardName)!;
          return <Card key={cardName} cardVersions={cardVersions} />;
        })}
      </div>
    </div>
  );
}

export default AlbumView;
