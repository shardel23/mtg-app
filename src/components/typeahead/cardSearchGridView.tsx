"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import * as Scry from "scryfall-sdk";
import { Command, CommandInput } from "../ui/command";
import { useDebounce } from "./useDebounce";

type Option = Record<"value" | "label", Scry.Card> & Record<string, string>;

function CardSearchGridView() {
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Option[]>([]);
  const [isLoading, setLoading] = useState(false);
  const debouncedInputValue = useDebounce(inputValue, 500);

  useEffect(() => {
    if (debouncedInputValue && debouncedInputValue.length > 1) {
      fetch(
        `https://api.scryfall.com/cards/search?order=name&q=name:/${debouncedInputValue}/`,
      )
        .then((response) => response.json())
        .then((res) => {
          if (!res.data) {
            setSuggestions([]);
            return;
          }
          setSuggestions(
            res.data
              .slice(0, 50)
              .map((card: any) => ({ value: card, label: card.name })),
          );
        });
      setLoading(false);
    } else {
      setSuggestions([]);
      setLoading(false);
    }
  }, [debouncedInputValue]);

  return (
    <Command>
      <CommandInput
        value={inputValue}
        onValueChange={(value) => {
          if (value.length > 1) {
            setLoading(true);
          }
          setInputValue(value);
        }}
        onBlur={() => {}}
        onFocus={() => {}}
        placeholder={"Search"}
        className="text-base w-72"
      />
      <div
        className={`grid grid-cols-3 md:grid-cols-3 gap-1 overflow-y-scroll no-scrollbar`}
      >
        {suggestions.map((suggestion) => {
          const apiCard = suggestion.value;
          const card = {
            id: apiCard.id,
            name: apiCard.name,
            image:
              apiCard.image_uris?.normal ??
              apiCard.card_faces[0]?.image_uris?.normal ??
              "",
          };
          return (
            <Image
              key={card.id}
              unoptimized
              src={card.image}
              alt={card.name}
              height={400}
              width={300}
              placeholder="blur"
              blurDataURL="/assets/card-back.jpg"
              onClick={() => {}}
            />
          );
        })}
      </div>
    </Command>
  );
}

export default CardSearchGridView;
