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
  const displayMessage = query
    ? `Displaying ${results.size} cards where the name includes "${query}"`
    : `Displaying ${results.size} cards available for trade`;
  return (
    <div className="flex flex-col">
      <div
        data-testid="search-page-display-message-div"
        className="border-b border-t pb-2 pt-2 text-center text-xxs md:pl-4 md:text-left"
      >
        {displayMessage}
      </div>
      <CardGrid cards={results} cardsPerRow={5} viewMode="edit" />
    </div>
  );
}

export default SearchResultsView;
