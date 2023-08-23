"use client";

import { CardData, SetData, getAllCardsOfSet } from "@/actions/mtgActions";
import SetSelector from "@/components/setSelector";

import CardGrid from "@/components/cardGrid";
import { useState, useTransition } from "react";

function ViewPageContent({ sets }: { sets: Array<SetData> }) {
  const [chosenSet, setChosenSet] = useState<string | null>(null);
  const [cards, setCards] = useState<CardData[]>([]);
  const [isPending, startTransition] = useTransition();
  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex gap-x-6 items-center">
        <div className="w-48">Select set:</div>
        <SetSelector
          sets={sets}
          onSetChange={(set) => {
            setChosenSet(set);
            startTransition(async () => {
              const cards = await getAllCardsOfSet(set);
              setCards(cards);
            });
          }}
        />
      </div>
      {cards.length !== 0 && <CardGrid cards={cards} />}
    </div>
  );
}

export default ViewPageContent;
