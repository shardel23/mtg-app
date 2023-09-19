"use client";

import { CardData } from "@/types/types";
import { Dispatch, SetStateAction } from "react";
import FilterDialog from "./selectors/filterDialog";

export type Filter = {
  inputValues: string[];
  filterLogic: (cardVersions: CardData[]) => boolean;
};

export default function Filters({
  filters,
  setFilters,
}: {
  filters: Map<string, Filter>;
  setFilters: Dispatch<SetStateAction<Map<string, Filter>>>;
}) {
  return (
    <div className="flex items-center gap-x-4 max-w-screen-sm">
      <FilterDialog filters={filters} setFilters={setFilters} />
    </div>
  );
}
