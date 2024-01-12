import { searchCardFromAPI } from "@/actions/mtgActions";
import SearchResultsView from "../../../components/SearchResultsView";

export default async function SearchResultsPage({
  params,
}: {
  params: { q: string };
}) {
  if (params.q.length < 3) {
    return (
      <>
        <div className="text-center">
          Search query must be at least 3 characters long
        </div>
      </>
    );
  }
  const searchQuery = params.q.replaceAll("%20", " ").replaceAll("%2C", ",");
  const cards = await searchCardFromAPI(searchQuery);
  return (
    <>
      <SearchResultsView results={cards} query={searchQuery} />
    </>
  );
}
