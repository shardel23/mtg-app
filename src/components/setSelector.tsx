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
  onSetChange: (set: string) => void;
}) {
  return (
    <Select onValueChange={(set) => onSetChange(set)}>
      <SelectTrigger id="set">
        <SelectValue placeholder="Choose a set..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup className="h-72 overflow-y-scroll">
          {sets.map((set, idx) => (
            <SelectItem key={idx} value={set.name}>
              {set.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SetSelector;
