import { CardData } from "@/actions/mtgActions";
import Card from "./card";

function CardGrid({
  cards,
  cardsPerRow,
}: {
  cards: Map<string, CardData[]>;
  cardsPerRow: number;
}) {
  return (
    <div className={`grid grid-cols-3 md:grid-cols-${cardsPerRow} gap-1`}>
      {Array.from(cards.keys()).map((cardName) => {
        const cardVersions = cards.get(cardName)!;
        return <Card key={cardName} cardVersions={cardVersions} />;
      })}
    </div>
  );
}

export default CardGrid;
