"use client";

import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const options = [
  { value: "all", displayName: "All" },
  {
    value: "W",
    displayName: "White",
  },
  {
    value: "U",
    displayName: "Blue",
  },
  {
    value: "B",
    displayName: "Black",
  },
  {
    value: "R",
    displayName: "Red",
  },
  {
    value: "G",
    displayName: "Green",
  },
];

export default function ColorSelector({
  onColorSelect,
}: {
  onColorSelect: (value: string) => void;
}) {
  return (
    <div className="flex flex-col w-32 gap-y-2">
      <Label> Color </Label>
      <Select
        defaultValue="all"
        onValueChange={(value) => {
          onColorSelect(value);
        }}
      >
        <SelectTrigger id="color">
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
