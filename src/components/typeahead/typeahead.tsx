"use client";

import { useEffect, useState } from "react";
import InputComponent from "./inputComponent";
import SuggestionsComponent from "./suggestionsComponent";
import { useDebounce } from "./useDebounce";

export default function Typeahead() {
  const [inputValue, setInputValue] = useState<string>("");
  const debouncedInputValue = useDebounce(inputValue, 500);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (debouncedInputValue.length > 1) {
      //   fetch(`https://api.example.com/search?q=${inputValue}`)
      //     .then(response => response.json())
      //     .then(data => setSuggestions(data.items));
      setSuggestions([
        debouncedInputValue + (Math.random() * 10000).toPrecision(4).toString(),
        debouncedInputValue + (Math.random() * 10000).toPrecision(4).toString(),
        debouncedInputValue + (Math.random() * 10000).toPrecision(4).toString(),
      ]);
    } else {
      setSuggestions([]);
    }
  }, [debouncedInputValue]);

  return (
    <div>
      <InputComponent value={inputValue} onChange={setInputValue} />
      <SuggestionsComponent
        inputValue={debouncedInputValue}
        suggestions={suggestions}
        onSelect={(selection) => {
          setInputValue(selection);
        }}
      />
    </div>
  );
}
