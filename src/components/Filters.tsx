"use client";

import { CardData } from "@/types/types";
import { Dispatch, SetStateAction } from "react";
import FilterDialog from "./selectors/FilterDialog";

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
    <div className="flex max-w-screen-sm items-center gap-x-4">
      <FilterDialog filters={filters} setFilters={setFilters} />
    </div>
  );
}
