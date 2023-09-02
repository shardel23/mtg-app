import { searchCardInCollection } from "@/actions/mtgActions";
import SearchResultsView from "./SearchResultsView";

export default async function SearchResultsPage({
  params,
}: {
  params: { q: string };
}) {
  if (params.q.length < 2) {
    return (
      <div className="text-center">
        Search query must be at least 2 characters long
      </div>
    );
  }
  const cards = await searchCardInCollection(params.q);
  return <SearchResultsView results={cards} query={params.q} />;
}
