import { searchCardInCollection } from "@/actions/mtgActions";
import RedirectIfNotLoggedIn from "@/components/redirect";
import SearchResultsView from "./SearchResultsView";

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
  const cards = await searchCardInCollection(params.q);
  return (
    <>
      <RedirectIfNotLoggedIn />
      <SearchResultsView results={cards} query={params.q} />
    </>
  );
}
