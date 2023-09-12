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
      <div className="pt-2 pb-2 border-t border-b text-xxs text-center md:text-left md:pl-4">{`Displaying ${results.size} cards where the name includes "${query}"`}</div>
      <CardGrid cards={results} cardsPerRow={5} />
    </div>
  );
}

export default SearchResultsView;
