"use client";

import {
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/temp/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import { Skeleton } from "../ui/skeleton";

export type Option = Record<"value" | "label", string> & Record<string, string>;

type AutoCompleteProps = {
  emptyMessage: string;
  value?: Option;
  onValueChange?: (value: Option) => void;
  disabled?: boolean;
  placeholder?: string;
};

export const AutoComplete = ({
  placeholder,
  emptyMessage,
  value,
  onValueChange,
  disabled,
}: AutoCompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Option>(value as Option);
  const [inputValue, setInputValue] = useState<string>(value?.label || "");
  const [suggestions, setSuggestions] = useState<Option[]>([]);
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
              .map((card: any) => ({ value: card.id, label: card.name })),
          );
        });
      setLoading(false);
    } else {
      setSuggestions([]);
      setLoading(false);
    }
  }, [debouncedInputValue]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      if (input.value.length < 1) {
        setOpen(false);
      }
      // Keep the options displayed when the user is typing
      else if (!isOpen) {
        setOpen(true);
      }

      // This is not a default behaviour of the <input /> field
      if (event.key === "Enter" && input.value !== "") {
        const optionToSelect = suggestions.find(
          (suggestion) => suggestion.label === input.value,
        );
        if (optionToSelect) {
          setSelected(optionToSelect);
          onValueChange?.(optionToSelect);
        }
      }

      if (event.key === "Escape") {
        input.blur();
      }
    },
    [isOpen, suggestions, onValueChange],
  );

  const handleBlur = useCallback(() => {
    setOpen(false);
  }, []);

  const handleSelectOption = useCallback(
    (selectedOption: Option) => {
      setInputValue(selectedOption.label);

      setSelected(selectedOption);
      onValueChange?.(selectedOption);

      // This is a hack to prevent the input from being focused after the user selects an option
      // We can call this hack: "The next tick"
      setTimeout(() => {
        inputRef?.current?.blur();
      }, 0);
    },
    [onValueChange],
  );

  return (
    <CommandPrimitive onKeyDown={handleKeyDown}>
      <div>
        <CommandInput
          ref={inputRef}
          value={inputValue}
          onValueChange={(value) => {
            if (value.length > 1) {
              setLoading(true);
            }
            setInputValue(value);
          }}
          onBlur={handleBlur}
          onFocus={() => {}}
          placeholder={placeholder}
          disabled={disabled}
          className="text-base w-72"
        />
      </div>
      <div className="mt-1 relative">
        {isOpen ? (
          <div className="absolute top-0 z-10 w-full rounded-xl outline-none animate-in fade-in-0 zoom-in-95">
            <CommandList className="ring-1 ring-slate-200 rounded-lg">
              {isLoading ? (
                <CommandPrimitive.Loading>
                  <div className="p-1">
                    <Skeleton className="h-8 w-full" />
                  </div>
                </CommandPrimitive.Loading>
              ) : null}
              {suggestions.length > 0 && !isLoading ? (
                <CommandGroup>
                  {suggestions.map((suggestion) => {
                    const isSelected = selected?.value === suggestion.value;
                    return (
                      <CommandItem
                        key={suggestion.value}
                        value={suggestion.label}
                        onMouseDown={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                        onSelect={() => handleSelectOption(suggestion)}
                        className={cn(
                          "flex items-center gap-2 w-full",
                          !isSelected ? "pl-8" : null,
                        )}
                      >
                        {isSelected ? <Check className="w-4" /> : null}
                        {suggestion.label}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ) : null}
              {!isLoading && inputValue && inputValue.length > 1 ? (
                <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-sm text-center">
                  {emptyMessage}
                </CommandPrimitive.Empty>
              ) : null}
            </CommandList>
          </div>
        ) : null}
      </div>
    </CommandPrimitive>
  );
};
