"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { cardsArrayToMap, endsWithNumber, isSetExists } from "@/lib/utils";
import {
  AlbumData,
  CardData,
  CollectionData,
  SetData,
  createAlbumFromCSVInput,
} from "@/types/types";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import * as Scry from "scryfall-sdk";
import { getImageUri, transformCards } from "./helpers";

export async function getAllSets(): Promise<SetData[]> {
  const sets = await Scry.Sets.all();
  return sets
    .filter((set) =>
      ["core", "expansion", "masters", "draft_innovation"].includes(
        set.set_type,
      ),
    )
    .filter((set) => set.digital === false)
    .map((set) => ({ name: set.name, id: set.id }));
}

export async function getAllCardsOfSet(set: Scry.Set): Promise<Scry.Card[]> {
  return (await set.getCards({ unique: "prints" }))
    .filter((card) => !card.digital)
    .filter(
      (card) =>
        card.layout === "normal" ||
        card.collector_number.endsWith("a") ||
        endsWithNumber(card.collector_number),
    );
}

async function getUserIdFromSession(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (user == null) {
    return null;
  }
  return user.id;
}

export async function getAllAlbums(): Promise<AlbumData[]> {
  const userId = await getUserIdFromSession();
  if (userId == null) {
    return [];
  }
  const albums = await prisma.album.findMany({
    where: {
      collection: {
        name: {
          equals: await getCollection(),
        },
        userId: userId,
      },
    },
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

async function createAlbum(
  setIdentifier: { setId?: string; setCode?: string },
  collectedCards?: Map<string, boolean>,
): Promise<number> {
  const set =
    setIdentifier.setId != null
      ? await Scry.Sets.byId(setIdentifier.setId)
      : await Scry.Sets.byCode(setIdentifier.setCode!);
  const isSetInDB = await isSetExists(set.name);
  if (isSetInDB) {
    return -1;
  }
  const collection = await prisma.collection.findFirst({
    where: {
      name: await getCollection(),
    },
  });
  if (collection == null) {
    return -1;
  }
  const cards = await getAllCardsOfSet(set);
  const album = await prisma.album.create({
    data: {
      collectionId: collection.id,
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
              : card.collector_number.slice(0, -1),
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
  input: createAlbumFromCSVInput,
): Promise<number> {
  const importedCards = new Map(input.map((row) => [row.cardId, true]));
  const setCode = input[0].setCode;
  return await createAlbum({ setCode }, importedCards);
}

export async function getAlbumCards(
  albumId: number,
): Promise<{ albumName: string; cards: Map<string, CardData[]> }> {
  const userId = await getUserIdFromSession();
  if (userId == null) {
    return {
      albumName: "",
      cards: new Map(),
    };
  }
  const album = await prisma.album.findUnique({
    where: {
      id: albumId,
      collection: {
        name: {
          equals: await getCollection(),
        },
        userId: userId,
      },
    },
    include: {
      cards: {
        select: {
          id: true,
          isCollected: true,
          albumId: true,
        },
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
  const set = await Scry.Sets.byId(album.setId!);
  const cardsDataFromAPI = transformCards(await getAllCardsOfSet(set), set);
  const cardsDataFromDB = album.cards;

  const mergedCardsData = cardsDataFromDB.map((card) => ({
    ...card,
    ...cardsDataFromAPI.find((apiCard) => apiCard.id === card.id)!,
  }));

  return {
    albumName: album.name,
    cards: cardsArrayToMap(mergedCardsData),
  };
}

export async function markCardIsCollected(
  albumId: number,
  cardId: string,
  isCollected: boolean,
): Promise<void> {
  await prisma.card.update({
    where: {
      id_albumId: {
        id: cardId,
        albumId: albumId,
      },
    },
    data: {
      isCollected: isCollected,
    },
  });
  revalidatePath(`/album/{albumId}`);
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
  cardName: string,
): Promise<void> {
  await prisma.card.deleteMany({
    where: {
      albumId: albumId,
      name: cardName,
    },
  });
  revalidatePath(`/album/{albumId}`);
}

export async function searchCardInCollection(
  cardName: string,
): Promise<Map<string, CardData[]>> {
  if (cardName.length < 2) {
    return new Map();
  }
  const cards = await prisma.card.findMany({
    where: {
      name: {
        contains: cardName,
        mode: "insensitive",
      },
      Album: {
        collection: {
          name: {
            equals: await getCollection(),
          },
        },
      },
    },
    select: {
      id: true,
      isCollected: true,
      albumId: true,
    },
  });

  const cardsDataFromAPI = transformCards(
    await Scry.Cards.search(`name:/${cardName}/`, {
      unique: "prints",
    }).waitForAll(),
  ).filter((card) => cards.find((c) => c.id === card.id));
  const mergedCardsData = cardsDataFromAPI.map((apiCard) => ({
    ...apiCard,
    ...cards.find((card) => apiCard.id === card.id)!,
  }));

  return cardsArrayToMap(mergedCardsData);
}

export async function getCollection() {
  const cookieStore = cookies();
  const collectionCookie = cookieStore.get("collection");
  if (collectionCookie != null) {
    return collectionCookie.value;
  }
  return "Default";
}

export async function getAllCollections(): Promise<CollectionData[]> {
  const collections = await prisma.collection.findMany();
  return collections.map((collection) => ({ name: collection.name }));
}
