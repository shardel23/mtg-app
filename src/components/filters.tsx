import { CardData } from "@/types/types";
import { Dispatch, SetStateAction } from "react";
import { Color } from "scryfall-sdk";
import ColorSelector from "./selectors/colorSelector";
import RaritySelector from "./selectors/raritySelector";

export type Filter = (cardVersions: CardData[]) => boolean;

export default function Filters({
  setFilters,
}: {
  setFilters: Dispatch<SetStateAction<Map<string, Filter>>>;
}) {
  return (
    <div className="flex items-center gap-x-4">
      <span>Filters: </span>
      <RaritySelector
        onRaritySelect={(newRarity: string) => {
          setFilters((curr) => {
            const newFilters = new Map(curr);
            if (newRarity === "all") {
              newFilters.delete("rarity");
              return newFilters;
            }
            newFilters.set("rarity", (cardVersions) =>
              cardVersions.some((card) => card.rarity === newRarity)
            );
            return newFilters;
          });
        }}
      />
      <ColorSelector
        onColorSelect={(newColor: string) => {
          setFilters((curr) => {
            const newFilters = new Map(curr);
            if (newColor === "all") {
              newFilters.delete("color");
              return newFilters;
            }
            newFilters.set("color", (cardVersions) =>
              cardVersions.some((card) =>
                card.colors.includes(newColor as Color)
              )
            );
            return newFilters;
          });
        }}
      />
    </div>
  );
}
