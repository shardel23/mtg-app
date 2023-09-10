"use client";

import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const options = [
  { value: "all", displayName: "All" },
  {
    value: "common",
    displayName: "Common",
  },
  {
    value: "uncommon",
    displayName: "Uncommon",
  },
  {
    value: "rare",
    displayName: "Rare",
  },
  {
    value: "mythic",
    displayName: "Mythic",
  },
];

export default function RaritySelector({
  onRaritySelect,
}: {
  onRaritySelect: (value: string) => void;
}) {
  return (
    <div className="flex flex-col w-32 gap-y-2">
      <Label> Rarity </Label>
      <Select
        defaultValue="all"
        onValueChange={(value) => {
          onRaritySelect(value);
        }}
      >
        <SelectTrigger id="rarity">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="max-h-48">
            {options.map((option, idx) => (
              <SelectItem key={idx} value={option.value}>
                {option.displayName}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
