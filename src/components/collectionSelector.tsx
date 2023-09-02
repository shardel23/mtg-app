import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function CollectionSelector() {
  return (
    <Select value="Default">
      <SelectTrigger id="collection">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup className="max-h-48 overflow-y-scroll">
          {["Default", "Test"].map((value, idx) => (
            <SelectItem key={idx} value={value}>
              {value}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
