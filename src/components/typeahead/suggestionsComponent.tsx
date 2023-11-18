"use client";

export default function SuggestionsComponent({
  inputValue,
  suggestions,
  onSelect,
}: {
  inputValue: string;
  suggestions: Array<string>;
  onSelect: (suggestion: string) => void;
}) {
  return (
    <ul className="relative">
      {suggestions.map((suggestion, index) => (
        <li key={index} onClick={() => onSelect(suggestion)}>
          <HighlightMatch suggestion={suggestion} inputValue={inputValue} />
        </li>
      ))}
    </ul>
  );
}

function HighlightMatch({
  suggestion,
  inputValue,
}: {
  suggestion: string;
  inputValue: string;
}) {
  const index = suggestion.indexOf(inputValue);
  if (index === -1) return <>{suggestion}</>;

  const beforeMatch = suggestion.slice(0, index);
  const match = suggestion.slice(index, index + inputValue.length);
  const afterMatch = suggestion.slice(index + inputValue.length);

  return (
    <>
      {beforeMatch}
      <strong>{match}</strong>
      {afterMatch}
    </>
  );
}
