import { getCardsAvailableForTrade } from "@/actions/mtgActions";
import SearchResultsView from "../../components/SearchResultsView";

export default async function TradesPage() {
  const cards = await getCardsAvailableForTrade();
  return (
    <>
      <SearchResultsView results={cards} />
    </>
  );
}
