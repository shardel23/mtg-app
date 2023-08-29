"use client";

import { ChangeEventHandler, KeyboardEventHandler, useState } from "react";
import { Input } from "./ui/input";

function CardSearch() {
  const [searchString, setSearchString] = useState("");
  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") {
      console.log(searchString);
    }
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearchString(event.target.value);
  };

  return (
    <Input
      className="w-72 foc"
      placeholder="Search..."
      autoFocus
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
}

export default CardSearch;
