import { getAlbum } from "@/actions/get/getAlbumAction";
import { getCardDetails } from "@/lib/db";
import * as API from "@/lib/scryfallApi";
import { CardStats17LandsResponse } from "@/types/types";
import { fetch17LandsStats } from "@/util/redis/fetch17LandsStats";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, context: any) {
  const { params } = context;
  const { cardId } = params;
  const albumId = request.nextUrl.searchParams.get("albumId");

  try {
    const cardDetails = await getCardDetails(cardId);
    if (cardDetails == null) {
      return NextResponse.json({
        status: "error",
        message: "Failed to find card details",
      });
    }
    let setCode = cardDetails.setCode;
    if (setCode === "spg") {
      if (albumId == null) {
        return NextResponse.json({
          status: "error",
          message: "Album ID is required for SPG set",
        });
      }
      const album = await getAlbum("", albumId);
      const setId = album.album?.setId;
      if (setId == null) {
        return NextResponse.json({
          status: "error",
          message: "Failed to find album set",
        });
      }
      const albumSet = await API.getSet({ setId });
      setCode = albumSet.code;
    }
    const cardStats17Lands = await fetch17LandsStats(setCode);

    const winRates = cardStats17Lands
      .map((card) => card.ever_drawn_win_rate)
      .filter((rate) => rate != null) as number[];
    winRates.sort((a, b) => a - b);
    const medianWinRate = winRates[Math.floor(winRates.length / 2)];

    const cardStats = cardStats17Lands.find(
      (card) =>
        card.mtga_id === cardDetails.arena_id ||
        cardDetails.name.includes(card.name),
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
