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
  setReleaseDate: string;
};

export type SetData = { name: string; id: string };

export type CardData = {
  id: string;
  name: string;
  image: string | undefined;
  isInCollection?: boolean;
  albumId?: number;
  collectorNumber: string;
  setCode: string;
  setIconUri: string;
  rarity: string;
};

export type createAlbumFromCSVInput = {
  cardName: string;
  setCode: string;
  collectorNumber: string;
  cardId: string;
}[];

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
    .filter((set) =>
      ["core", "expansion", "masters", "draft_innovation"].includes(
        set.set_type
      )
    )
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
      setCode: set.code,
      setIconUri: set.icon_svg_uri,
      rarity: card.rarity,
    }));
}

export async function getAllAlbums(): Promise<AlbumData[]> {
  const albums = await prisma.album.findMany({
    orderBy: {
      setReleaseDate: "desc",
    },
  });
  return albums
    .filter((album) => album.setId != null && album.setName != null)
    .map((album) => ({
      id: album.id,
      name: album.name,
      setId: album.setId as string,
      setName: album.setName as string,
      setReleaseDate: album.setReleaseDate as string,
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

async function createAlbum(
  setIdentifier: { setId?: string; setCode?: string },
  collectedCards?: Map<string, boolean>
): Promise<number> {
  const set =
    setIdentifier.setId != null
      ? await Scry.Sets.byId(setIdentifier.setId)
      : await Scry.Sets.byCode(setIdentifier.setCode!);
  const isSetInDB = await isSetExists(set.name);
  if (isSetInDB) {
    return -1;
  }
  const cards = (await set.getCards({ unique: "prints" }))
    .filter((card) => !card.digital)
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
      setReleaseDate: set.released_at,
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
          isCollected: collectedCards ? collectedCards.has(card.id) : false,
          setCode: set.code,
          setIconSvgUri: set.icon_svg_uri,
          rarity: card.rarity,
        })),
      },
    },
  });
  revalidatePath("/");
  return album.id;
}

export async function createAlbumFromSetId(setId: string): Promise<number> {
  return await createAlbum({ setId });
}

export async function createAlbumFromCSV(
  input: createAlbumFromCSVInput
): Promise<number> {
  const importedCards = new Map(input.map((row) => [row.cardId, true]));
  const setCode = input[0].setCode;
  return await createAlbum({ setCode }, importedCards);
}

export async function getAlbumCards(
  albumId: number
): Promise<{ albumName: string; cards: Map<string, CardData[]> }> {
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
  if (album == null) {
    return {
      albumName: "",
      cards: new Map(),
    };
  }
  const cardsData: CardData[] =
    album?.cards.map((card) => ({
      id: card.id,
      name: card.name,
      image: card.imageUri,
      isInCollection: card.isCollected,
      albumId: albumId,
      collectorNumber: card.collectorNumber.toString(),
      setCode: card.setCode,
      setIconUri: card.setIconSvgUri,
      rarity: card.rarity,
    })) ?? [];
  return {
    albumName: album.name,
    cards: cardsArrayToMap(cardsData),
  };
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
    setCode: card.setCode,
    setIconUri: card.setIconSvgUri,
    rarity: card.rarity,
  }));
  return cardsArrayToMap(results);
}
