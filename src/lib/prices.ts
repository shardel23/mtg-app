import * as DB from "@/lib/db";
import * as API from "@/lib/scryfallApi";

export default async function fetchPrices() {
  const cards = await DB.getAllCardDetails();
  const cardIds = cards.map((card) => card.id);
  const prices = await API.getCardsPrices(cardIds);
  await DB.setCardPrices(prices);
  return prices;
}
