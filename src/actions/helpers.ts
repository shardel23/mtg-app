import * as DB from "@/lib/db";
import { hashEncode } from "@/lib/utils";
import { CardData, ManaCost } from "@/types/types";
import { Prisma } from "@prisma/client";
import { Logger } from "next-axiom";
import { LogLevel } from "next-axiom/dist/logger";
import * as Scry from "scryfall-sdk";

type CardWithCardDetails = NonNullable<
  Prisma.PromiseReturnType<typeof DB.getAlbumOfUserWithCards>
>["cards"][number];

export const getImageUri = (card: Scry.Card): string => {
  return (
    (card.card_faces.length > 1
      ? card.card_faces[0].image_uris?.normal
      : card.image_uris?.normal) ?? ""
  );
};

export const transformCardsFromDB = (
  cards: CardWithCardDetails[],
): CardData[] => {
  return cards.map((card) => ({
    id: card.id,
    isCollected: card.numCollected > 0,
    numCollected: card.numCollected,
    name: card.CardDetails.name,
    albumId: hashEncode(card.albumId),
    image:
      card.CardDetails.normalImageURI ??
      card.CardDetails.card_faces[0].normalImageURI ??
      "",
    collectorNumber: card.CardDetails.collectorNumber.toString(),
    setCode: card.CardDetails.set ?? "",
    setIconUri: card.CardDetails.setIconSvgUri,
    rarity: card.CardDetails.rarity,
    colors: getDBCardColors(card),
    manaCost: card.CardDetails.mana_cost,
    cmc: card.CardDetails.cmc ?? 0,
    layout: card.CardDetails.layout ?? "",
    types:
      card.CardDetails.type_line
        ?.split(" ")
        .map((type) => type.toLowerCase()) ?? [],
    cardFaces: card.CardDetails.card_faces.map((face) => ({
      name: face.name,
      image: face.normalImageURI ?? "",
      manaCost: face.mana_cost,
      cmc: getCardCMC(face.mana_cost),
      types: face.type_line.split(" ").map((type) => type.toLowerCase()),
    })),
    price: null,
  }));
};

export function isCardMultiFace(card: CardData): boolean {
  return (
    (card.cardFaces ?? []).length > 1 &&
    [
      "transform",
      "modal_dfc",
      "flip",
      "modal_dfc",
      "saga",
      "double_sided",
    ].includes(card.layout)
  );
}

function getDBCardColors(card: CardWithCardDetails): string[] {
  return (
    (card.CardDetails.card_faces.length > 0
      ? card.CardDetails.card_faces.reduce(
          (colors, face) => [...colors, ...(face.colors ?? [])],
          [] as string[],
        )
      : card.CardDetails.colors) ?? []
  );
}

function getCardCMC(manaCost: ManaCost): number {
  if (manaCost == null) {
    return 0;
  }
  const matches = manaCost.match(/{\w+}/g);
  if (matches == null) {
    return 0;
  }
  return matches.reduce((sum, match) => {
    const manaSymbol = match.slice(1, -1);
    const manaSymbolNumber = parseInt(manaSymbol);
    return sum + (isNaN(manaSymbolNumber) ? 1 : manaSymbolNumber);
  }, 0);
}

export async function log(logLevel: LogLevel, message: string) {
  const log = new Logger();
  log._log(logLevel, message);
  await log.flush();
}
