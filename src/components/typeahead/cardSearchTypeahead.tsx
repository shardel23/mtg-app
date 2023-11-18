"use client";

import { useState } from "react";
import { AutoComplete, Option } from "./autocomplete";

export default function CardSearchTypeahead() {
  const [value, setValue] = useState<Option>();

  return (
    <AutoComplete
      emptyMessage="No results"
      placeholder="Search card name to add..."
      onValueChange={setValue}
      value={value}
    />
  );
}
