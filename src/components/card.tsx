"use client";

import { CardData, markCardIsCollected } from "@/actions/mtgActions";
import Image from "next/image";
import { useTransition } from "react";

function Card({ card }: { card: CardData }) {
  const [isPending, startTransition] = useTransition();
  return (
    <div>
      <div className="truncate">{card.name}</div>
      {card.image && (
        <Image
          className={`${!card.isInCollection ? "opacity-50" : ""}`}
          src={card.image}
          alt={card.name}
          height={400}
          width={300}
          onClick={() => {
            startTransition(() => {
              markCardIsCollected(
                card.albumId as number,
                card.id,
                !card.isInCollection
              );
            });
          }}
        />
      )}
    </div>
  );
}

export default Card;
