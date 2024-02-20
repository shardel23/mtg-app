import { getCardsAvailableForTrade } from "@/actions/get/getCardsAvailableForTradeAction";
import SearchResultsView from "../../components/SearchResultsView";

export default async function TradesPage() {
  const cardsForTrade = await getCardsAvailableForTrade();
  return (
    <>
      <SearchResultsView results={cardsForTrade} />
    </>
  );
}
