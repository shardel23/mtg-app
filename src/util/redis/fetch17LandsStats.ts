"use server";

import * as API from "@/lib/scryfallApi";
import { logWithTimestamp } from "@/lib/utils";
import { CardStats17Lands } from "@/types/types";
import { redis } from "@/util/redis/redis";

export async function fetch17LandsStats(
  setCode: string,
): Promise<CardStats17Lands[]> {
  const set = await API.getSet({ setCode });
  const cardSet = (set.parent_set_code || setCode).toUpperCase();
  const redisKey = `17LandsStats-${cardSet}`;
  const cardStats17LandsAsString = await redis.get(redisKey);
  let cardStats17Lands;
  if (cardStats17LandsAsString != null) {
    logWithTimestamp(`Found 17Lands stats in cache for set ${cardSet}`);
    cardStats17Lands = JSON.parse(
      cardStats17LandsAsString,
    ) as CardStats17Lands[];
  } else {
    logWithTimestamp(`Fetching 17Lands stats for set ${cardSet}`);
    const apiURL = `https://www.17lands.com/card_ratings/data?expansion=${cardSet}&format=PremierDraft&start_date=2000-01-01`;
    const response = await fetch(apiURL);
    cardStats17Lands = (await response.json()) as CardStats17Lands[];
    await redis.set(
      redisKey,
      JSON.stringify(cardStats17Lands),
      "EX",
      60 * 60 * 24,
    );
  }
  return cardStats17Lands;
}
