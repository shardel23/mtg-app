"use server";

import * as DB from "@/lib/db";
import { cardsArrayToMap } from "@/lib/utils";
import { CardData } from "@/types/types";
import { LogLevel } from "next-axiom/dist/logger";
import {
  compareCards,
  getUserAndCollection,
  log,
  transformCardsFromDB,
} from "../helpers";

export async function getCardsAvailableForTrade(): Promise<
  Map<string, CardData[]>
> {
  const { userId, collection } = await getUserAndCollection();
  if (userId == null || collection == null) {
    log(LogLevel.warn, "User is not logged in");
    return new Map();
  }

  const cards = await DB.getCardsAvailableForTrade(userId, collection.name);
  cards.sort(compareCards);
  return cardsArrayToMap(transformCardsFromDB(cards));
}
