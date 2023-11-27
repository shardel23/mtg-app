"use client";

import CardGrid from "@/components/cardGrid";
import { CardData } from "@/types/types";

function SearchResultsView({
  results,
  query,
}: {
  results: Map<string, CardData[]>;
  query?: string;
}) {
  const isSearch = query != null;
  const displayMessage = isSearch
    ? `Displaying ${results.size} cards where the name includes "${query}"`
    : `Displaying ${results.size} cards available for trade`;
  return (
    <div className="flex flex-col gap-y-8">
      {!isSearch && (
        <div className="flex flex-col gap-y-4">
          <h1 className="text-2xl">Tradeable cards</h1>
          <div>
            Tradeable cards are cards in your collection with more than 1 copy
          </div>
        </div>
      )}
      <div>
        <div
          data-testid="search-page-display-message-div"
          className="border-b border-t pb-2 pt-2 text-center text-xxs md:pl-4 md:text-left"
        >
          {displayMessage}
        </div>
        <CardGrid
          cards={results}
          cardsPerRow={5}
          viewMode="edit"
          isCardDeleteable={false}
        />
      </div>
    </div>
  );
}

export default SearchResultsView;
