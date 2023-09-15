"use client";

import { CardData } from "@/types/types";
import { Dispatch, SetStateAction } from "react";
import ColorSelector from "./selectors/colorSelector";
import RaritySelector from "./selectors/raritySelector";

export type Filter = (cardVersions: CardData[]) => boolean;

export default function Filters({
  setFilters,
}: {
  setFilters: Dispatch<SetStateAction<Map<string, Filter>>>;
}) {
  return (
    <div className="flex items-center gap-x-4">
      <span>Filters: </span>
      <RaritySelector setFilters={setFilters} />
      <ColorSelector setFilters={setFilters} />
    </div>
  );
}
