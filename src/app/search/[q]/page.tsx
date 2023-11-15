import { searchCardInCollection } from "@/actions/mtgActions";
import RedirectIfNotLoggedIn from "@/components/redirect";
import SearchResultsView from "../../../components/SearchResultsView";

export default async function SearchResultsPage({
  params,
}: {
  params: { q: string };
}) {
  if (params.q.length < 2) {
    return (
      <>
        <RedirectIfNotLoggedIn />
        <div className="text-center">
          Search query must be at least 2 characters long
        </div>
      </>
    );
  }
  const searchQuery = params.q.replaceAll("%20", " ");
  const cards = await searchCardInCollection(searchQuery);
  return (
    <>
      <RedirectIfNotLoggedIn />
      <SearchResultsView results={cards} query={searchQuery} />
    </>
  );
}
