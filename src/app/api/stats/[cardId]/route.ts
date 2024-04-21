import { getCardDetails } from "@/lib/db";
import { logWithTimestamp } from "@/lib/utils";
import { CardStats17Lands, CardStats17LandsResponse } from "@/types/types";
import { Redis } from "ioredis";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, context: any) {
  const { params } = context;
  const { cardId } = params;

  try {
    const cardDetails = await getCardDetails(cardId);
    if (cardDetails == null) {
      return NextResponse.json({
        status: "error",
        message: "Failed to find card details",
      });
    }
    const cardSet = cardDetails.setCode.toUpperCase();
    const redis =
      process.env.NODE_ENV === "development"
        ? new Redis(process.env.REDIS_URL || "", {
            password: process.env.REDIS_PASSWORD || "",
          })
        : new Redis(
            `rediss://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_URL}`,
          );
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

    const cardStats = cardStats17Lands.find(
      (card) =>
        card.mtga_id === cardDetails.arena_id || card.name === cardDetails.name,
    );
    if (cardStats == null) {
      return NextResponse.json({
        status: "error",
        message: "Failed to find 17Lands stats for card",
      });
    }
    const cardStatsResponse: CardStats17LandsResponse = (({
      seen_count,
      avg_seen,
      avg_pick,
      game_count,
      play_rate,
      ever_drawn_win_rate,
    }) => ({
      seen_count,
      avg_seen,
      avg_pick,
      game_count,
      play_rate,
      ever_drawn_win_rate,
    }))(cardStats);
    return NextResponse.json({ status: "ok", stats: cardStatsResponse });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Failed to find 17Lands stats",
      error: error,
    });
  }
}
