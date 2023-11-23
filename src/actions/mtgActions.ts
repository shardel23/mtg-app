"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as DB from "@/lib/db";
import { prisma } from "@/lib/prisma";
import * as API from "@/lib/scryfallApi";
import {
  cardsArrayToMap,
  hashDecode,
  hashEncode,
  isSetExists,
  logWithTimestamp,
} from "@/lib/utils";
import {
  AlbumData,
  AlbumStats,
  CardData,
  SetData,
  ViewMode,
  createAlbumFromCSVInput,
  createAlbumsFromCSVInput,
} from "@/types/types";
import { getServerSession } from "next-auth";
import { LogLevel } from "next-axiom/dist/logger";
import { revalidatePath } from "next/cache";
import { log, transformCardsFromDB } from "./helpers";

export async function getUserIdFromSession(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (user == null) {
    return null;
  }
  return user.id;
}

export async function getAllSets(): Promise<SetData[]> {
  const sets = await API.getAllSets();
  return sets.map((set) => ({ name: set.name, id: set.id }));
}

export async function getAllAlbums(): Promise<AlbumData[]> {
  const { userId, collection } = await getUserAndCollection();
  if (userId == null || collection == null) {
    log(LogLevel.warn, "User is not logged in");
    return [];
  }
  const albums = await DB.getAlbumsOfUser(userId, collection.name);
  return albums.map((album) => ({
    id: hashEncode(album.id),
    name: album.name,
    setId: album.setId,
    setName: album.setName,
    setReleaseDate: album.setReleaseDate,
  }));
}

export async function createEmptyAlbum(name: string): Promise<number> {
  const { userId, collection } = await getUserAndCollection();
  if (userId == null || collection == null) {
    return -1;
  }
  const newAlbum = await DB.createEmptyAlbum(collection, name);
  revalidatePath("/");
  return newAlbum.id;
}

export async function addCardToAlbum(cardId: string, albumId: string) {
  const { userId, collection } = await getUserAndCollection();
  if (userId == null || collection == null) {
    return false;
  }

  const albumIdDecoded = hashDecode(albumId);
  const album = await DB.getAlbumOfUser(collection.id, albumIdDecoded);
  if (album == null) {
    return false;
  }

  const card = await API.getCard(cardId);

  await DB.addCardToAlbum(card, albumIdDecoded);
  revalidatePath(`/album/${albumId}`);
  return true;
}

async function createAlbum(
  setIdentifier: { setId?: string; setCode?: string },
  collectedCards?: Map<string, number>,
): Promise<number> {
  const { userId, collection } = await getUserAndCollection();
  if (userId == null || collection == null) {
    log(LogLevel.warn, "User is not logged in");
    return -1;
  }

  const set = await API.getSet(setIdentifier);
  const isSetInDB = await isSetExists(set.id);
  if (isSetInDB) {
    logWithTimestamp("Set " + set.name + " already exists in DB");
    return -1;
  }

  const cards = await API.getCardsOfSet(setIdentifier);

  // Avoid adding cards which are not in boosters
  const cardsInBoosters = cards.filter((c) => c.booster);
  const cardNamesInBoosters = new Set<string>(
    cardsInBoosters.map((c) => c.name),
  );
  const cardsToAdd = cards.filter((c) => cardNamesInBoosters.has(c.name));

  const album = await prisma.album.create({
    data: {
      collectionId: collection.id,
      name: set.name,
      setId: set.id,
      setName: set.name,
      setReleaseDate: set.released_at,
    },
  });
  logWithTimestamp("Album " + album.name + " created");

  const isCardDetailsInDB = await prisma.cardDetails.findFirst({
    where: {
      id: cardsToAdd[0].id,
    },
    select: {
      id: true,
    },
  });

  if (!isCardDetailsInDB) {
    for (let i = 0; i < cardsToAdd.length; i++) {
      let card = cardsToAdd[i];
      await DB.upsertCardDetails(card, {
        setCode: set.code,
        setIconSvgUri: set.icon_svg_uri,
      });
      logWithTimestamp("Card " + card.name + " created");
    }
  }

  await prisma.card.createMany({
    data: cardsToAdd.map((card) => ({
      id: card.id,
      albumId: album.id,
      numCollected: collectedCards
        ? collectedCards.has(card.id)
          ? collectedCards.get(card.id)
          : 0
        : 0,
    })),
  });
  logWithTimestamp("Created cards for album " + album.name);

  revalidatePath("/");
  return album.id;
}

export async function createAlbumFromSetId(setId: string): Promise<number> {
  return await createAlbum({ setId });
}

export async function createAlbumsFromCSV(
  input: createAlbumsFromCSVInput,
): Promise<boolean> {
  const setIds = new Set<string>();
  const collectedCards = new Map<string, number>();
  input.forEach((row) => {
    if (row.numCollected > 0) {
      setIds.add(row.setId);
      if (collectedCards.has(row.cardId)) {
        collectedCards.set(row.cardId, collectedCards.get(row.cardId)! + 1);
      } else {
        collectedCards.set(row.cardId, 1);
      }
    }
  });

  for (const setId of setIds) {
    logWithTimestamp("Creating album for set " + setId);
    await createAlbum({ setId }, collectedCards);
    logWithTimestamp("Album created for set " + setId);
  }

  revalidatePath("/");
  return true;
}

export async function createAlbumFromCSV(
  input: createAlbumFromCSVInput,
): Promise<number> {
  const importedCards = new Map(input.map((row) => [row.cardId, 1]));
  const setCode = input[0].setCode;
  return await createAlbum({ setCode }, importedCards);
}

export async function getAlbumCards(albumId: string): Promise<{
  album?: {
    id: string;
    name: string;
    setId: string | null;
  };
  cards: Map<string, CardData[]>;
  viewMode: ViewMode;
}> {
  const { userId, collection } = await getUserAndCollection();
  if (userId == null || collection == null) {
    log(LogLevel.warn, "User is not logged in");
    return {
      cards: new Map(),
      viewMode: "view",
    };
  }

  const albumIdDecoded = hashDecode(albumId);
  const album = await DB.getCardsFromAlbum(
    userId,
    collection.name,
    albumIdDecoded,
  );
  if (album == null) {
    return {
      cards: new Map(),
      viewMode: "view",
    };
  }

  const cards = transformCardsFromDB(album.cards);

  return {
    album: {
      id: albumId,
      name: album.name,
      setId: album.setId,
    },
    cards: cardsArrayToMap(cards),
    viewMode: userId === album.collection?.userId ? "edit" : "view",
  };
}

export async function getCardPrice(cardId: string): Promise<string | null> {
  const card = await API.getCard(cardId);
  return card.prices?.usd ?? null;
}

export async function markCardIsCollected(
  albumId: string,
  cardId: string,
  isCollected: boolean,
): Promise<void> {
  const { userId, collection } = await getUserAndCollection();
  if (userId == null || collection == null) {
    log(LogLevel.warn, "User is not logged in");
    return;
  }

  const albumIdDecoded = hashDecode(albumId);
  const album = await DB.getAlbumOfUser(collection.id, albumIdDecoded);
  if (album?.collectionId !== collection.id) {
    log(LogLevel.warn, "User is not the owner of the album");
    return;
  }

  await prisma.card.update({
    where: {
      id_albumId: {
        id: cardId,
        albumId: albumIdDecoded,
      },
    },
    data: {
      numCollected: isCollected ? 1 : 0,
    },
  });
}

export async function updateAmountCollected(
  albumId: string,
  cardId: string,
  amount: number,
): Promise<void> {
  const { userId, collection } = await getUserAndCollection();
  if (userId == null || collection == null) {
    log(LogLevel.warn, "User is not logged in");
    return;
  }

  const albumIdDecoded = hashDecode(albumId);
  const album = await DB.getAlbumOfUser(collection.id, albumIdDecoded);
  if (album?.collectionId !== collection.id) {
    log(LogLevel.warn, "User is not the owner of the album");
    return;
  }

  await prisma.card.update({
    where: {
      id_albumId: {
        id: cardId,
        albumId: albumIdDecoded,
      },
    },
    data: {
      numCollected: amount,
    },
  });
}

export async function deleteAlbum(albumId: string): Promise<void> {
  const userId = await getUserIdFromSession();
  if (userId == null) {
    log(LogLevel.warn, "User is not logged in");
    return;
  }

  const albumIdDecoded = hashDecode(albumId);

  const album = await prisma.album.findUnique({
    where: {
      id: albumIdDecoded,
      collection: {
        userId: userId,
      },
    },
    select: {
      cards: {
        select: {
          id: true,
        },
      },
    },
  });

  if (album == null) {
    log(LogLevel.warn, "Attempt to delete album that does not exist");
    return;
  }

  const deleteCards = prisma.card.deleteMany({
    where: {
      id: {
        in: album.cards.map((c) => c.id),
      },
    },
  });

  const deleteAlbum = prisma.album.delete({
    where: {
      id: albumIdDecoded,
      collection: {
        userId: userId,
      },
    },
  });

  await prisma.$transaction([deleteCards, deleteAlbum]);

  revalidatePath("/");
}

export async function deleteCardFromAlbum(
  albumId: string,
  cardIds: string[],
): Promise<boolean> {
  const userId = await getUserIdFromSession();
  if (userId == null) {
    log(LogLevel.warn, "User is not logged in");
    return false;
  }

  const albumIdDecoded = hashDecode(albumId);
  const res = await prisma.album.findUnique({
    where: {
      id: albumIdDecoded,
    },
    select: {
      collection: {
        select: {
          userId: true,
        },
      },
    },
  });
  if (res?.collection?.userId !== userId) {
    log(LogLevel.warn, "User is not the owner of the album");
    return false;
  }

  await DB.deleteCardsFromAlbum(albumIdDecoded, cardIds);
  revalidatePath(`/album/{albumId}`);
  log(LogLevel.info, "Card deleted from album");
  return true;
}

export async function searchCardInCollection(
  cardName: string,
): Promise<Map<string, CardData[]>> {
  if (cardName.length < 2) {
    log(LogLevel.warn, "Card name searched is too short");
    return new Map();
  }

  const { userId, collection } = await getUserAndCollection();
  if (userId == null || collection == null) {
    log(LogLevel.warn, "User is not logged in");
    return new Map();
  }

  const cards = await DB.searchCardsInCollection(
    userId,
    collection.name,
    cardName,
  );
  return cardsArrayToMap(transformCardsFromDB(cards));
}

export async function getCardsAvailableForTrade(): Promise<
  Map<string, CardData[]>
> {
  const { userId, collection } = await getUserAndCollection();
  if (userId == null || collection == null) {
    log(LogLevel.warn, "User is not logged in");
    return new Map();
  }

  const cards = await DB.getCardsAvailableForTrade(userId, collection.name);
  return cardsArrayToMap(transformCardsFromDB(cards));
}

export async function getCollectionStats(): Promise<AlbumStats[]> {
  const { userId, collection } = await getUserAndCollection();
  if (userId == null || collection == null) {
    log(LogLevel.warn, "User is not logged in");
    return [];
  }

  const albums = await DB.getAlbumsOfUserWithCollectionStats(
    userId,
    collection.name,
  );
  const stats = albums.map((album) => {
    const cardsMap = cardsArrayToMap(
      album.cards.map((c) => ({
        name: c.CardDetails.name,
        isCollected: c.numCollected > 0,
        rarity: c.CardDetails.rarity,
      })),
    );
    const stats = {
      id: album.id,
      name: album.name,
      total: {
        collected: 0,
        missing: 0,
        total: cardsMap.size,
      },
      common: {
        collected: 0,
        missing: 0,
        total: 0,
      },
      uncommon: {
        collected: 0,
        missing: 0,
        total: 0,
      },
      rare: {
        collected: 0,
        missing: 0,
        total: 0,
      },
      mythic: {
        collected: 0,
        missing: 0,
        total: 0,
      },
    };
    cardsMap.forEach((card) => {
      const isCollected = card.some((ver) => ver.isCollected);
      stats.total.collected += isCollected ? 1 : 0;
      stats.total.missing += isCollected ? 0 : 1;
      switch (card[0].rarity) {
        case "common":
          stats.common.total += 1;
          stats.common.collected += isCollected ? 1 : 0;
          stats.common.missing += isCollected ? 0 : 1;
          break;
        case "uncommon":
          stats.uncommon.total += 1;
          stats.uncommon.collected += isCollected ? 1 : 0;
          stats.uncommon.missing += isCollected ? 0 : 1;
          break;
        case "rare":
          stats.rare.total += 1;
          stats.rare.collected += isCollected ? 1 : 0;
          stats.rare.missing += isCollected ? 0 : 1;
          break;
        case "mythic":
          stats.mythic.total += 1;
          stats.mythic.collected += isCollected ? 1 : 0;
          stats.mythic.missing += isCollected ? 0 : 1;
          break;
      }
    });
    return stats;
  });
  return stats;
}

export async function getCollection() {
  return "Default";
}

async function getUserAndCollection() {
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
