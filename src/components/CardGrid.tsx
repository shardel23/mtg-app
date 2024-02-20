import { CardData, ViewMode } from "@/types/types";
import Card from "./Card";

function CardGrid({
  cards,
  cardsPerRow,
  viewMode,
  isCardDeleteable,
}: {
  cards: Map<string, CardData[]>;
  cardsPerRow: number;
  viewMode: ViewMode;
  isCardDeleteable?: boolean;
}) {
  return (
    <div className={`grid grid-cols-3 md:grid-cols-${cardsPerRow} gap-1`}>
      {Array.from(cards.keys()).map((cardName) => {
        const cardVersions = cards.get(cardName)!;
        return (
          <Card
            key={cardName}
            cardVersions={cardVersions}
            viewMode={viewMode}
            isCardDeleteable={isCardDeleteable}
          />
        );
      })}
    </div>
  );
}

export default CardGrid;
