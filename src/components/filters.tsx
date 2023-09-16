"use client";

import { CardData } from "@/types/types";
import { Dispatch, SetStateAction } from "react";
import FilterDialog from "./selectors/filterDialog";

export type Filter = (cardVersions: CardData[]) => boolean;

export default function Filters({
  setFilters,
}: {
  setFilters: Dispatch<SetStateAction<Map<string, Filter>>>;
}) {
  return (
    <div className="flex items-center gap-x-4 max-w-screen-sm">
      <FilterDialog setFilters={setFilters} />
    </div>
  );
}
