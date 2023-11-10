import { CardData, ManaCost } from "@/types/types";
import { Prisma } from "@prisma/client";
import { Logger } from "next-axiom";
import { LogLevel } from "next-axiom/dist/logger";
import * as Scry from "scryfall-sdk";
type CardWithCardFaces = Prisma.CardDetailsGetPayload<{
  include: { card_faces: true };
}>;

export const getImageUri = (card: Scry.Card): string => {
  return (
    (card.card_faces.length > 1
      ? card.card_faces[0].image_uris?.normal
      : card.image_uris?.normal) ?? ""
  );
};

export const transformCards = (
  cards: Scry.Card[],
  set?: Scry.Set,
): CardData[] => {
  return cards.map((card) => ({
    id: card.id,
    name: card.name,
    image: getImageUri(card),
    collectorNumber: card.collector_number,
    setCode: card.set,
    setIconUri: set?.icon_svg_uri,
    rarity: card.rarity,
    colors: getAPICardColors(card),
    manaCost: card.mana_cost,
    cmc: card.cmc,
    layout: card.layout,
    types: card.type_line.split(" ").map((type) => type.toLowerCase()),
    cardFaces: card.card_faces.map((face) => ({
      name: face.name,
      image: face.image_uris?.normal ?? "",
      manaCost: face.mana_cost,
      cmc: getCardCMC(face.mana_cost),
      types: face.type_line.split(" ").map((type) => type.toLowerCase()),
    })),
    price: card.prices?.usd,
  }));
};

export const transformCardsFromDB = (
  cards: CardWithCardFaces[],
): CardData[] => {
  return cards.map((card) => ({
    id: card.id,
    name: card.name,
    isCollected: card.isCollected,
    image: card.normalImageURI ?? card.card_faces[0].normalImageURI ?? "",
    collectorNumber: card.collectorNumber.toString(),
    setCode: card.set ?? "",
    setIconUri: card.setIconSvgUri,
    rarity: card.rarity,
    colors: getDBCardColors(card),
    manaCost: card.mana_cost,
    cmc: card.cmc ?? 0,
    layout: card.layout ?? "",
    types: card.type_line?.split(" ").map((type) => type.toLowerCase()) ?? [],
    cardFaces: card.card_faces.map((face) => ({
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

function getAPICardColors(card: Scry.Card): Scry.Color[] {
  return (
    (card.card_faces.length > 0
      ? card.card_faces.reduce(
          (colors, face) => [...colors, ...(face.colors ?? [])],
          [] as Scry.Color[],
        )
      : card.colors) ?? []
  );
}

function getDBCardColors(card: CardWithCardFaces): string[] {
  return (
    (card.card_faces.length > 0
      ? card.card_faces.reduce(
          (colors, face) => [...colors, ...(face.colors ?? [])],
          [] as string[],
        )
      : card.colors) ?? []
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
