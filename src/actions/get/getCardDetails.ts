"use server";

import * as DB from "@/lib/db";

export async function getCardDetails(cardId: string) {
  const cardDetails = DB.getCardDetails(cardId);
  return cardDetails;
}
