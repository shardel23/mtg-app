"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { AutoComplete, Option } from "./autocomplete";

export default function CardSearchTypeahead() {
  const [value, setValue] = useState<Option>();

  return (
    <div className="flex items-center gap-x-4">
      <AutoComplete
        emptyMessage="No results"
        placeholder="Search card name to add..."
        onValueChange={setValue}
        value={value}
      />
      <Button
        disabled={value == null}
        onClick={() => {
          console.log("Add", value?.value);
        }}
      >
        Add
      </Button>
    </div>
  );
}
