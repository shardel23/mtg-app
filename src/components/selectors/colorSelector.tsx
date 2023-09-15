"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Color } from "scryfall-sdk";
import { Filter } from "../filters";
import { MultiSelect } from "./multiSelect";

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
  setFilters,
}: {
  setFilters: Dispatch<SetStateAction<Map<string, Filter>>>;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setFilters((curr) => {
      const newFilters = new Map(curr);
      if (selected.length === 0) {
        newFilters.delete("color");
        return newFilters;
      }
      newFilters.set("color", (cardVersions) =>
        cardVersions.some((card) =>
          selected.some((color) => card.colors.includes(color as Color))
        )
      );
      return newFilters;
    });
  }, [selected]);

  return (
    <MultiSelect
      label="Colors"
      options={options}
      selected={selected}
      onChange={(newSelected) => {
        setSelected(newSelected);
      }}
      className="w-32"
    />
  );
}
