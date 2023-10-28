"use client";

import { Dispatch, SetStateAction } from "react";
import { Filter } from "../filters";
import { MultiSelect } from "./multiSelect";

const options = [
  {
    value: "creature",
    label: "Creature",
  },
  {
    value: "land",
    label: "Land",
  },
  {
    value: "planeswalker",
    label: "Planeswalker",
  },
  {
    value: "sorcery",
    label: "Sorcery",
  },
  {
    value: "instant",
    label: "Instant",
  },
  {
    value: "artifact",
    label: "Artifact",
  },
  {
    value: "enchantment",
    label: "Enchantment",
  },
  { value: "battle", label: "Battle" },
];

export default function TypeSelector({
  selected,
  setFilters,
}: {
  selected: string[];
  setFilters: Dispatch<SetStateAction<Map<string, Filter>>>;
}) {
  return (
    <MultiSelect
      label="Type"
      options={options}
      selected={selected}
      onChange={(newSelected) => {
        setFilters((curr) => {
          const newFilters = new Map(curr);
          if (newSelected.length === 0) {
            newFilters.delete("type");
            return newFilters;
          }
          newFilters.set("type", {
            inputValues: newSelected,
            filterLogic: (cardVersions) =>
              cardVersions.some(
                (card) =>
                  newSelected.filter((type) => card.types.includes(type))
                    .length !== 0
              ),
          });
          return newFilters;
        });
      }}
    />
  );
}
