import { NullishNumber } from "@/types/types";
import { clsx, type ClassValue } from "clsx";
import Hashids from "hashids";
import { twMerge } from "tailwind-merge";
import { prisma } from "./prisma";

const hashids = new Hashids();

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
      {},
    );
    return obj;
  });

  return array;
};

export const cardsArrayToMap = <
  T extends {
    name: string;
  },
>(
  cards: T[],
): Map<string, T[]> => {
  const cardNameToVersions = new Map<string, T[]>();
  cards.forEach((card) => {
    if (cardNameToVersions.has(card.name)) {
      cardNameToVersions.get(card.name)?.push(card);
      return;
    }
    cardNameToVersions.set(card.name, [card]);
  });
  return cardNameToVersions;
};

export function endsWithNumber(text: string) {
  return /\d$/.test(text);
}

export async function isSetExists(
  setId: string,
  collectionId: number,
): Promise<boolean> {
  const album = await prisma.album.findFirst({
    where: {
      setId: setId,
      collection: {
        id: collectionId,
      },
    },
  });
  return album != null;
}

export function hashEncode(value: number) {
  return hashids.encode(value);
}

export function hashDecode(encoded: string) {
  return hashids.decode(encoded)[0] as number;
}

export function logWithTimestamp(message: string) {
  if (process.env.NODE_ENV === "development") {
    console.log(new Date().toLocaleString(), "-", message);
  }
}

export function numberWithCommas(x: NullishNumber | undefined) {
  if (x == null) {
    return null;
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
