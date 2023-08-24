"use client";

import { CardData } from "@/actions/mtgActions";
import Card from "@/components/card";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";

function AlbumView({ cards }: { cards: Map<string, CardData[]> }) {
  const [cardToDisplay, setCardsToDisplay] =
    useState<Map<string, CardData[]>>(cards);
  const [cardsPerRow, setCardsPerRow] = useState<number>(5);

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
      <div className="flex justify-between">
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
        <div className="flex gap-x-6 items-center">
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
      <div className={`grid grid-cols-${cardsPerRow} gap-1`}>
        {Array.from(cardToDisplay.keys()).map((cardName) => {
          const cardVersions = cardToDisplay.get(cardName)!;
          return <Card key={cardName} cardVersions={cardVersions} />;
        })}
      </div>
    </div>
  );
}

export default AlbumView;
