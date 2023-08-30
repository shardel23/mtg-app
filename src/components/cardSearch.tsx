"use client";

import { useRouter } from "next/navigation";
import { ChangeEventHandler, KeyboardEventHandler, useState } from "react";
import { Input } from "./ui/input";

function CardSearch() {
  const [searchString, setSearchString] = useState("");
  const router = useRouter();

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") {
      router.push(`/search/${searchString}`);
    }
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearchString(event.target.value);
  };

  return (
    <Input
      value={searchString}
      className="w-72 foc"
      placeholder="Search..."
      autoFocus
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
}

export default CardSearch;
