"use client";

import CardGrid from "@/components/cardGrid";
import { CardData } from "@/types/types";

function SearchResultsView({
  results,
  query,
}: {
  results: Map<string, CardData[]>;
  query: string;
}) {
  return (
    <div className="flex flex-col">
      <div className="border-b border-t pb-2 pt-2 text-center text-xxs md:pl-4 md:text-left">{`Displaying ${results.size} cards where the name includes "${query}"`}</div>
      <CardGrid cards={results} cardsPerRow={5} />
    </div>
  );
}

export default SearchResultsView;
