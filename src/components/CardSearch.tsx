"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEventHandler, KeyboardEventHandler, useState } from "react";
import { Input } from "./ui/input";

function CardSearch() {
  const [searchString, setSearchString] = useState("");
  const router = useRouter();

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter" && searchString.length > 0) {
      router.push(`/search/${searchString}`);
    }
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearchString(event.target.value);
  };

  return (
    <div className="relative md:w-72">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        data-testid="card-search-input"
        value={searchString}
        className="pl-9 md:w-72"
        placeholder="Search..."
        autoFocus
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

export default CardSearch;
