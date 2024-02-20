"use client";

import { Dispatch, SetStateAction } from "react";
import { Color } from "scryfall-sdk";
import { Filter } from "../Filters";
import { MultiSelect } from "./MultiSelect";

const options = [
  {
    value: "W",
    label: "White",
  },
  {
    value: "U",
    label: "Blue",
  },
  {
    value: "B",
    label: "Black",
  },
  {
    value: "R",
    label: "Red",
  },
  {
    value: "G",
    label: "Green",
  },
];

export default function ColorSelector({
  selected,
  setFilters,
}: {
  selected: string[];
  setFilters: Dispatch<SetStateAction<Map<string, Filter>>>;
}) {
  return (
    <MultiSelect
      label="Colors"
      options={options}
      selected={selected}
      onChange={(newSelected) => {
        setFilters((curr) => {
          const newFilters = new Map(curr);
          if (newSelected.length === 0) {
            newFilters.delete("color");
            return newFilters;
          }
          newFilters.set("color", {
            inputValues: newSelected,
            filterLogic: (cardVersions) =>
              cardVersions.some((card) =>
                newSelected.some((color) =>
                  card.colors.includes(color as Color),
                ),
              ),
          });
          return newFilters;
        });
      }}
      className="w-32"
    />
  );
}
