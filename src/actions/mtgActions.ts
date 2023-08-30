"use server";

import { prisma } from "@/lib/prisma";
import { cardsArrayToMap } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import * as Scry from "scryfall-sdk";

export type AlbumData = {
  id: number;
  name: string;
  setId: string;
  setName: string;
};

export type SetData = { name: string; id: string };

export type CardData = {
  id: string;
  name: string;
  image: string | undefined;
  isInCollection?: boolean;
  albumId?: number;
  collectorNumber: string;
};

function getImageUri(card: Scry.Card): string {
  return (
    (card.card_faces.length > 1
      ? card.card_faces[0].image_uris?.normal
      : card.image_uris?.normal) ?? ""
  );
}

export async function getAllSets(): Promise<SetData[]> {
  const sets = await Scry.Sets.all();
  return sets
    .filter((set) => ["core", "expansion", "masters"].includes(set.set_type))
    .filter((set) => set.digital === false)
    .map((set) => ({ name: set.name, id: set.id }));
}

export async function getAllCardsOfSet(setName: string): Promise<CardData[]> {
  const set = await Scry.Sets.byName(setName);
  const cards = await set.getCards();
  return cards
    .filter((card) => !card.digital)
    .map((card) => ({
      id: card.id,
      name: card.name,
      image: getImageUri(card),
      collectorNumber: card.collector_number,
    }));
}

export async function getAllAlbums(): Promise<AlbumData[]> {
  const albums = await prisma.album.findMany();
  return albums
    .filter((album) => album.setId != null && album.setName != null)
    .map((album) => ({
      id: album.id,
      name: album.name,
      setId: album.setId as string,
      setName: album.setName as string,
    }));
}

async function isSetExists(setName: string): Promise<boolean> {
  const album = await prisma.album.findFirst({
    where: {
      name: setName,
    },
  });
  return album != null;
}

function endsWithNumber(text: string) {
  return /\d$/.test(text);
}

export async function createAlbumFromSetId(setId: string): Promise<number> {
  const set = await Scry.Sets.byId(setId);
  const isSetInDB = await isSetExists(set.name);
  if (isSetInDB) {
    return -1;
  }
  const cards = (await set.getCards({ unique: "prints" }))
    .filter((card) => !card.digital)
    // .filter((card) => card.booster === true)
    .filter(
      (card) =>
        card.layout === "normal" ||
        card.collector_number.endsWith("a") ||
        endsWithNumber(card.collector_number)
    );
  const album = await prisma.album.create({
    data: {
      name: set.name,
      setId: set.id,
      setName: set.name,
      cards: {
        create: cards.map((card) => ({
          name: card.name,
          imageUri: getImageUri(card),
          id: card.id,
          collectorNumber: parseInt(
            endsWithNumber(card.collector_number)
              ? card.collector_number
              : card.collector_number.slice(0, -1)
          ),
          setName: set.name,
          setId: set.id,
        })),
      },
    },
  });
  revalidatePath("/");
  return album.id;
}

export type createAlbumFromCSVInput = {
  cardName: string;
  setCode: string;
  collectorNumber: string;
  cardId: string;
}[];

export async function createAlbumFromCSV(
  input: createAlbumFromCSVInput
): Promise<number> {
  const importedCards = new Map(input.map((row) => [row.cardId, row]));
  const set = await Scry.Sets.byCode(input[0].setCode);
  const isSetInDB = await isSetExists(set.name);
  if (isSetInDB) {
    return -1;
  }
  console.log("Getting cards... ", new Date().toLocaleTimeString());
  const cards = (await set.getCards({ unique: "prints" }))
    .filter((card) => !card.digital)
    .filter(
      (card) =>
        card.layout === "normal" ||
        card.collector_number.endsWith("a") ||
        endsWithNumber(card.collector_number)
    );
  console.log("Creating album... ", new Date().toLocaleTimeString());
  const album = await prisma.album.create({
    data: {
      name: set.name,
      setId: set.id,
      setName: set.name,
      cards: {
        create: cards.map((card) => ({
          name: card.name,
          imageUri: getImageUri(card),
          id: card.id,
          collectorNumber: parseInt(
            endsWithNumber(card.collector_number)
              ? card.collector_number
              : card.collector_number.slice(0, -1)
          ),
          setName: set.name,
          setId: set.id,
          isCollected: importedCards.has(card.id),
        })),
      },
    },
  });
  console.log("Done ", new Date().toLocaleTimeString());
  revalidatePath("/");
  return album.id;
}

export async function getAlbumCards(
  albumId: number
): Promise<Map<string, CardData[]>> {
  const album = await prisma.album.findUnique({
    where: {
      id: albumId,
    },
    include: {
      cards: {
        orderBy: {
          collectorNumber: "asc",
        },
      },
    },
  });
  const cardsData: CardData[] =
    album?.cards.map((card) => ({
      id: card.id,
      name: card.name,
      image: card.imageUri,
      isInCollection: card.isCollected,
      albumId: albumId,
      collectorNumber: card.collectorNumber.toString(),
    })) ?? [];
  return cardsArrayToMap(cardsData);
}

export async function markCardIsCollected(
  albumId: number,
  cardId: string,
  isCollected: boolean
): Promise<void> {
  await prisma.card.update({
    where: {
      id: cardId,
      albumId: albumId,
    },
    data: {
      isCollected: isCollected,
    },
  });
  revalidatePath(`/view/{albumId}`);
}

export async function deleteAlbum(albumId: number): Promise<void> {
  const deleteCards = prisma.card.deleteMany({
    where: {
      albumId: albumId,
    },
  });

  const deleteAlbum = prisma.album.delete({
    where: {
      id: albumId,
    },
  });

  await prisma.$transaction([deleteCards, deleteAlbum]);

  revalidatePath("/");
}

export async function deleteCardFromAlbum(
  albumId: number,
  cardName: string
): Promise<void> {
  await prisma.card.deleteMany({
    where: {
      albumId: albumId,
      name: cardName,
    },
  });
  revalidatePath(`/view/{albumId}`);
}

export async function searchCardInCollection(
  cardName: string
): Promise<Map<string, CardData[]>> {
  const cards = await prisma.card.findMany({
    where: {
      name: {
        contains: cardName,
        mode: "insensitive",
      },
    },
  });
  const results = cards.map((card) => ({
    id: card.id,
    name: card.name,
    image: card.imageUri,
    isInCollection: card.isCollected,
    albumId: card.albumId!,
    collectorNumber: card.collectorNumber.toString(),
  }));
  return cardsArrayToMap(results);
}
