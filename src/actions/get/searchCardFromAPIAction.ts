"use server";

import * as DB from "@/lib/db";
import * as API from "@/lib/scryfallApi";
import { cardsArrayToMap } from "@/lib/utils";
import { CardData } from "@/types/types";
import { LogLevel } from "next-axiom/dist/logger";
import { getUserAndCollection, log, transformCardsFromAPI } from "../helpers";

export async function searchCardFromAPI(
  cardName: string,
): Promise<Map<string, CardData[]>> {
  if (cardName.length < 3) {
    log(LogLevel.warn, "Card name searched is too short");
    return new Map();
  }
  const { userId, collection } = await getUserAndCollection();
  let apiCards = await API.searchCards(cardName);
  let transformedCards = transformCardsFromAPI(apiCards);
  if (userId != null && collection != null) {
    const ownedCards = new Set(
      (await DB.getOwnedCards(userId, collection.name)).map((card) => card.id),
    );
    transformedCards = transformedCards.map((card) => ({
      ...card,
      isCollected: ownedCards.has(card.id),
    }));
  }
  return cardsArrayToMap(transformedCards);
}
