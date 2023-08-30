"use client";

import { CardData } from "@/actions/mtgActions";
import CardGrid from "@/components/cardGrid";

function SearchResultsView({ results }: { results: Map<string, CardData[]> }) {
  return (
    <div>
      <CardGrid cards={results} cardsPerRow={5} />
    </div>
  );
}

export default SearchResultsView;
