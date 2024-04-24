import { getCardDetails } from "@/lib/db";
import { CardStats17LandsResponse } from "@/types/types";
import { fetch17LandsStats } from "@/util/redis/fetch17LandsStats";
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
    const setCode = cardDetails.setCode;
    const cardStats17Lands = await fetch17LandsStats(setCode);
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
