import { getCardsAvailableForTrade } from "@/actions/mtgActions";
import RedirectIfNotLoggedIn from "@/components/redirect";
import SearchResultsView from "../../components/SearchResultsView";

export default async function TradesPage() {
  const cards = await getCardsAvailableForTrade();
  return (
    <>
      <RedirectIfNotLoggedIn />
      <SearchResultsView results={cards} />
    </>
  );
}
