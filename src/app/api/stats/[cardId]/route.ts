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

    cardStats17Lands.sort(
      (a, b) => (b.ever_drawn_win_rate ?? 0) - (a.ever_drawn_win_rate ?? 0),
    );
    const winRates = cardStats17Lands
      .map((card) => card.ever_drawn_win_rate)
      .filter((rate) => rate != null) as number[];
    winRates.sort((a, b) => a - b);
    console.log(winRates);
    const medianWinRate = winRates[Math.floor(winRates.length / 2)];
    console.log(medianWinRate);

    // const avgWinRate = cardStats17Lands.reduce(
    //   (acc, card) => acc + (card.ever_drawn_win_rate ?? 0),
    //   0,
    // )/cardStats17Lands.length;
    // const medianWinRate = cardStats17Lands[Math.floor(cardStats17Lands.length / 2)].ever_drawn_win_rate;
    // console.log(medianWinRate);

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
      median_win_rate: medianWinRate,
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
