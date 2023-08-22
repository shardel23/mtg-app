"use client";

import { SetData } from "@/actions/mtgActions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

function SetSelector({
  sets,
  onSetChange,
}: {
  sets: Array<SetData>;
  onSetChange: (setId: string) => void;
}) {
  return (
    <Select onValueChange={(setId) => onSetChange(setId)}>
      <SelectTrigger id="set">
        <SelectValue placeholder="Choose a set..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup className="h-72 overflow-y-scroll">
          {sets.map((set, idx) => (
            <SelectItem key={idx} value={set.id}>
              {set.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SetSelector;
