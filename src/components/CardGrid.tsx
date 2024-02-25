import { CardData, ViewMode } from "@/types/types";
import Card from "./Card";
import { CardProvider } from "./CardContext";

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
          <CardProvider
            key={cardName}
            cardVersions={cardVersions}
            viewMode={viewMode}
            isCardDeleteable={isCardDeleteable}
          >
            <Card />
          </CardProvider>
        );
      })}
    </div>
  );
}

export default CardGrid;
