import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import * as DB from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { hashEncode } from "@/lib/utils";
import { CardData, ManaCost } from "@/types/types";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
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
    priceUsd: card.CardDetails.price_usd ?? 0,
    priceUsdFoil: card.CardDetails.price_usd_foil ?? 0,
    isFoil: card.isFoil,
  }));
};

export const transformCardsFromAPI = (cards: Scry.Card[]): CardData[] => {
  return cards.map((card) => ({
    id: card.id,
    numCollected: 1,
    isCollected: true,
    name: card.name,
    image:
      card.image_uris?.normal ?? card.card_faces[0].image_uris?.normal ?? "",
    collectorNumber: card.collector_number,
    setCode: card.set,
    rarity: card.rarity,
    colors: getAPICardColors(card),
    manaCost: card.mana_cost,
    cmc: card.cmc ?? 0,
    layout: card.layout ?? "",
    types: card.type_line?.split(" ").map((type) => type.toLowerCase()) ?? [],
    cardFaces: card.card_faces.map((face) => ({
      name: face.name,
      image: face.image_uris?.normal ?? "",
      manaCost: face.mana_cost,
      cmc: getCardCMC(face.mana_cost),
      types: face.type_line?.split(" ").map((type) => type.toLowerCase()) ?? [],
    })),
    priceUsd: Number(card.prices?.usd),
    priceUsdFoil: Number(card.prices?.usd_foil),
    isFoil: false,
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

export function getDBCardColors(card: CardWithCardDetails): string[] {
  return (
    (card.CardDetails.card_faces.length > 0
      ? card.CardDetails.card_faces
          .reduce(
            (colors, face) => [
              ...colors,
              ...(face.mana_cost?.match(/[A-Z]+/g) ?? []),
            ],
            [] as string[],
          )
          .filter((color, index, self) => self.indexOf(color) === index)
      : card.CardDetails.colors) ?? []
  );
}

export function getAPICardColors(card: Scry.Card): string[] {
  return (
    (card.card_faces.length > 0
      ? card.card_faces
          .reduce(
            (colors, face) => [
              ...colors,
              ...(face.mana_cost?.match(/[A-Z]+/g) ?? []),
            ],
            [] as string[],
          )
          .filter((color, index, self) => self.indexOf(color) === index)
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

export function compareCards(
  a: CardWithCardDetails,
  b: CardWithCardDetails,
): number {
  const colorsA = getDBCardColors(a);
  const colorsB = getDBCardColors(b);
  const isAMonoColor = colorsA.length === 1;
  const isBMonoColor = colorsB.length === 1;
  const isAMultiColor = colorsA.length > 1;
  const isBMultiColor = colorsB.length > 1;
  if (isAMonoColor) {
    if (isBMonoColor) {
      const colorOrders = ["W", "U", "B", "R", "G"];
      const colorA = colorsA[0];
      const colorB = colorsB[0];
      const colorAIndex = colorOrders.indexOf(colorA);
      const colorBIndex = colorOrders.indexOf(colorB);
      if (colorAIndex < colorBIndex) {
        return -1;
      }
      if (colorAIndex > colorBIndex) {
        return 1;
      }
      return 0;
    }
    return -1;
  }
  if (isAMultiColor) {
    if (isBMonoColor) {
      return 1;
    }
    if (isBMultiColor) {
      return 0;
    }
    return -1;
  }
  if (isBMultiColor || isBMonoColor) {
    return 1;
  }
  if (!isAMonoColor && !isAMultiColor && !isBMonoColor && !isBMultiColor) {
    const typeA =
      a.CardDetails.type_line ?? a.CardDetails.card_faces[0].type_line;
    const typeB =
      b.CardDetails.type_line ?? b.CardDetails.card_faces[0].type_line;
    const isALand = typeA.includes("Land");
    const isBLand = typeB.includes("Land");
    if (isALand && isBLand) {
      return 0;
    }
    if (isALand) {
      return 1;
    }
    if (isBLand) {
      return -1;
    }
  }
  return 0;
}

export async function getUserIdFromSession(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (user == null) {
    return null;
  }
  return user.id;
}

export async function getUserAndCollection() {
  const userId = await getUserIdFromSession();
  const collection = await prisma.collection.findFirst({
    where: {
      userId: userId,
      name: await getCollection(),
    },
    select: {
      id: true,
      name: true,
    },
  });
  return { userId, collection };
}

export async function getCollection() {
  return "Default";
}
