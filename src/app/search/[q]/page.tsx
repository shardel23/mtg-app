import { searchCardInCollection } from "@/actions/mtgActions";
import SearchResultsView from "./SearchResultsView";

export default async function SearchResultsPage({
  params,
}: {
  params: { q: string };
}) {
  const cards = await searchCardInCollection(params.q);
  return <SearchResultsView results={cards} query={params.q} />;
}
