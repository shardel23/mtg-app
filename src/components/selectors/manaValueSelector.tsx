"use client";

import { Dispatch, SetStateAction } from "react";
import { Filter } from "../filters";
import { MultiSelect } from "./multiSelect";

const options = [0, 1, 2, 3, 4, 5, 6]
  .map((value) => ({
    value: value.toString(),
    label: value.toString(),
  }))
  .concat({
    value: "7+",
    label: "7+",
  });

function ManaValueSelector({
  selected,
  setFilters,
}: {
  selected: string[];
  setFilters: Dispatch<SetStateAction<Map<string, Filter>>>;
}) {
  return (
    <MultiSelect
      label="Mana Value"
      options={options}
      selected={selected}
      onChange={(newSelected) => {
        setFilters((curr) => {
          const newFilters = new Map(curr);
          if (newSelected.length === 0) {
            newFilters.delete("manaValue");
            return newFilters;
          }
          newFilters.set("manaValue", {
            inputValues: newSelected,
            filterLogic: (cardVersions) => {
              const res1 = newSelected.includes("7+")
                ? cardVersions.some((card) => card.cmc >= 7)
                : false;
              const res2 = cardVersions.some((card) =>
                newSelected.includes(card.cmc.toString())
              );
              return res1 || res2;
            },
          });
          return newFilters;
        });
      }}
    />
  );
}

export default ManaValueSelector;
