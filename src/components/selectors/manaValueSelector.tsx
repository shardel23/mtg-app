"use client";

import { Dispatch, SetStateAction } from "react";
import { Filter } from "../filters";
import { MultiSelect } from "./multiSelect";

const options = [0, 1, 2, 3, 4, 5, 6, 7].map((value) => ({
  value: value.toString(),
  label: value.toString(),
}));

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
            filterLogic: (cardVersions) =>
              cardVersions.some((card) =>
                newSelected.includes(card.cmc.toString())
              ),
          });
          return newFilters;
        });
      }}
    />
  );
}

export default ManaValueSelector;
