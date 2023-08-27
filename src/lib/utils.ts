import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const parseCSVRow = (str: string, delimiter = ",") => {
  const regex = /(\s*"[^"]+"\s*|\s*[^,]+|,)(?=,|$)/g;
  const matches = str.match(regex) || [];
  for (var n = 0; n < matches.length; ++n) {
    matches[n] = matches[n].trim();
    if (matches[n] == ",") matches[n] = "";
  }
  return matches.map((m) => m.replace(/^"(.*)"$/, "$1"));
};

export const csvFileToArray = (string: string) => {
  const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
  const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

  const array = csvRows.map((row) => {
    const values = parseCSVRow(row);
    const obj = csvHeader.reduce(
      (object: { [key: string]: string }, header, index) => {
        object[header] = values[index];
        return object;
      },
      {}
    );
    return obj;
  });

  return array;
};
