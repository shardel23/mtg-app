import { SORTINGS } from "@/components/hooks/useCardSorting";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dispatch, SetStateAction } from "react";

type SortingProps = {
  setSortingMethod: Dispatch<SetStateAction<keyof typeof SORTINGS>>;
};

const sortings = Array.from(Object.keys(SORTINGS)) as (keyof typeof SORTINGS)[];

export default function Sorting({ setSortingMethod }: SortingProps) {
  return (
    <div className="flex flex-col w-48 gap-y-1">
      <div className="text-sm">Sort by:</div>
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
