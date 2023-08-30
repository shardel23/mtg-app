import { searchCardInCollection } from "@/actions/mtgActions";
import SearchResultsView from "./SearchResultsView";

export default async function SearchResultsPage({
  params,
}: {
  params: { q: string };
}) {
  const cards = await searchCardInCollection(params.q);
  console.log(cards);
  return <SearchResultsView results={cards} />;
}
