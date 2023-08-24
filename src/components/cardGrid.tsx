import { CardData } from "@/actions/mtgActions";
import Card from "./card";

function CardGrid({ cards }: { cards: CardData[] }) {
  return (
    <div className="grid grid-cols-5 gap-1">
      {cards.map((card) => (
        <Card key={card.name} cardVersions={[card]} />
      ))}
    </div>
  );
}

export default CardGrid;
