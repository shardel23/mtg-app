import { getCardsAvailableForTrade } from "@/actions/get/getCardsAvailableForTradeAction";
import SearchResultsView from "../../temp/components/SearchResultsView";

export default async function TradesPage() {
  const cardsForTrade = await getCardsAvailableForTrade();
  return (
    <>
      <SearchResultsView results={cardsForTrade} />
    </>
  );
}
