"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
  setFilters,
}: {
  setFilters: Dispatch<SetStateAction<Map<string, Filter>>>;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setFilters((curr) => {
      const newFilters = new Map(curr);
      if (selected.length === 0) {
        newFilters.delete("rarity");
        return newFilters;
      }
      newFilters.set("rarity", (cardVersions) =>
        cardVersions.some((card) => selected.includes(card.rarity))
      );
      return newFilters;
    });
  }, [selected]);

  return (
    <MultiSelect
      label="Rarity"
      options={options}
      selected={selected}
      onChange={(newSelected) => {
        setSelected(newSelected);
      }}
    />
  );
}
