"use client";

import { CardData, deleteAlbum } from "@/actions/mtgActions";
import Card from "@/components/card";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

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
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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
          <Button
            variant="destructive"
            size={"icon"}
            onClick={() => {
              startTransition(() => {
                deleteAlbum(albumId);
                router.push("/");
              });
            }}
          >
            <Trash />
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
