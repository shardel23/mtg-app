"use client";

import { Dispatch, SetStateAction } from "react";
import { Filter } from "../filters";
import { MultiSelect } from "./multiSelect";

const options = [
  {
    value: "common",
    label: "Common",
  },
  {
    value: "uncommon",
    label: "Uncommon",
  },
  {
    value: "rare",
    label: "Rare",
  },
  {
    value: "mythic",
    label: "Mythic",
  },
];

export default function RaritySelector({
  selected,
  setFilters,
}: {
  selected: string[];
  setFilters: Dispatch<SetStateAction<Map<string, Filter>>>;
}) {
  return (
    <MultiSelect
      label="Rarity"
      options={options}
      selected={selected}
      onChange={(newSelected) => {
        setFilters((curr) => {
          const newFilters = new Map(curr);
          if (newSelected.length === 0) {
            newFilters.delete("rarity");
            return newFilters;
          }
          newFilters.set("rarity", {
            inputValues: newSelected,
            filterLogic: (cardVersions) =>
              cardVersions.some((card) => newSelected.includes(card.rarity)),
          });
          return newFilters;
        });
      }}
    />
  );
}
