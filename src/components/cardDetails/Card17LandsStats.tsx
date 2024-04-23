"use client";

import { numberWithCommas } from "@/lib/utils";
import { CardStats17LandsResponse } from "@/types/types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useCardContext } from "../CardContext";

export default function Card17LandsStats() {
  const { currentCard: card } = useCardContext();
  const [cardStats, setCardStats] = useState<CardStats17LandsResponse | null>(
    null,
  );
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (card == null || cardStats != null) {
        return;
      }
      setIsFetching(true);
      const apiURL = `/api/stats/${card.id}`;
      const response = await fetch(apiURL);
      const data = await response.json();
      if (data && data.status === "ok") {
        setCardStats(data.stats);
      }
    };

    fetchStats()
      .catch(console.error)
      .finally(() => setIsFetching(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (card == null) {
    return null;
  }

  return (
    <div className="flex justify-center bg-slate-900 border-solid border-2 rounded-md p-1">
      <div className="flex flex-col gap-1 items-center">
        <div className="underline font-bold text-xs">17Lands Stats</div>
        {isFetching ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <div className="grid grid-cols-3 gap-2 text-xxs">
            <div>
              <span># Seen: </span>
              <span>{numberWithCommas(cardStats?.seen_count) ?? "--"}</span>
            </div>
            <div>
              <span>Avg Seen: </span>
              <span>{cardStats?.avg_seen?.toPrecision(3) ?? "--"}</span>
            </div>
            <div>
              <span>Avg Pick: </span>
              <span>{cardStats?.avg_pick?.toPrecision(3) ?? "--"}</span>
            </div>
            <div>
              <span># Game: </span>
              <span>{numberWithCommas(cardStats?.game_count) ?? "--"}</span>
            </div>
            <div>
              <span>Play Rate: </span>
              <span>
                {cardStats?.play_rate != null
                  ? `${(cardStats.play_rate * 100).toPrecision(3)}%`
                  : "--"}
              </span>
            </div>
            <div>
              <span>GIH WR: </span>
              <span>
                {cardStats?.ever_drawn_win_rate != null
                  ? `${(cardStats.ever_drawn_win_rate * 100).toPrecision(3)}%`
                  : "--"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
