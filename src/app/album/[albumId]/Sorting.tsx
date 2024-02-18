import { SORTINGS } from "@/components/hooks/useCardSorting";
import ArrowDown from "@/components/icons/arrow-down";
import ArrowUp from "@/components/icons/arrow-up";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dispatch, SetStateAction } from "react";

type SortingDirection = "asc" | "desc";

type SortingProps = {
  setSortingMethod: Dispatch<SetStateAction<keyof typeof SORTINGS>>;
  setSortingDirection: Dispatch<SetStateAction<SortingDirection>>;
  sortingDirection: SortingDirection;
};

const sortings = Array.from(Object.keys(SORTINGS)) as (keyof typeof SORTINGS)[];

export default function Sorting({
  setSortingMethod,
  setSortingDirection,
  sortingDirection,
}: SortingProps) {
  return (
    <div className="flex flex-col w-48 gap-y-1">
      <div className="flex justify-between">
        <div className="text-sm">Sort by:</div>
        <div className="flex gap-x-2">
          <ArrowUp
            className={
              "hover:cursor-pointer" +
              (sortingDirection === "asc" ? " text-blue-500" : "")
            }
            onClick={() => {
              setSortingDirection("asc");
            }}
          />
          /
          <ArrowDown
            className={
              "hover:cursor-pointer" +
              (sortingDirection === "desc" ? " text-blue-500" : "")
            }
            onClick={() => {
              setSortingDirection("desc");
            }}
          />
        </div>
      </div>
      <Select
        onValueChange={(sorting) =>
          setSortingMethod(sorting as keyof typeof SORTINGS)
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Collector Number" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {sortings.map((sorting) => (
              <SelectItem
                key={sorting}
                className="hover:cursor-pointer"
                value={sorting}
              >
                {sorting}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
