"use client";

import { CardData } from "@/types/types";
import { Dispatch, SetStateAction } from "react";
import ColorSelector from "./selectors/colorSelector";
import IsCollectedSelector from "./selectors/isCollectedSelector";
import RaritySelector from "./selectors/raritySelector";

export type Filter = (cardVersions: CardData[]) => boolean;

export default function Filters({
  setFilters,
}: {
  setFilters: Dispatch<SetStateAction<Map<string, Filter>>>;
}) {
  return (
    <div className="flex items-center gap-x-4 max-w-screen-sm">
      <IsCollectedSelector setFilters={setFilters} />
      <RaritySelector setFilters={setFilters} />
      <ColorSelector setFilters={setFilters} />
    </div>
  );
}
