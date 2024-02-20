import { Dispatch, SetStateAction } from "react";
import { Filter } from "../Filters";
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
  { value: "all", label: "All" },
  {
    value: "collected",
    label: "Collected",
  },
  {
    value: "missing",
    label: "Missing",
  },
];

export default function IsCollectedSelector({
  selected,
  setFilters,
}: {
  selected: string[];
  setFilters: Dispatch<SetStateAction<Map<string, Filter>>>;
}) {
  return (
    <div className="flex flex-col gap-y-2">
      <Label> Is Collected </Label>
      <Select
        value={selected[0] || "all"}
        onValueChange={(value) => {
          setFilters((curr) => {
            const newFilters = new Map(curr);
            if (value === "all") {
              newFilters.delete("isCollected");
              return newFilters;
            }
            if (value === "collected") {
              newFilters.set("isCollected", {
                inputValues: ["collected"],
                filterLogic: (cardVersions) =>
                  cardVersions.some((card) => card.isCollected),
              });
              return newFilters;
            }
            newFilters.set("isCollected", {
              inputValues: ["missing"],
              filterLogic: (cardVersions) =>
                cardVersions.every((card) => !card.isCollected),
            });
            return newFilters;
          });
        }}
      >
        <SelectTrigger id="color">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="max-h-48">
            {options.map((option, idx) => (
              <SelectItem key={idx} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
