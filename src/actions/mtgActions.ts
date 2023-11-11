"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import * as API from "@/lib/scryfallApi";
import { cardsArrayToMap, endsWithNumber, isSetExists } from "@/lib/utils";
import {
  AlbumData,
  AlbumStats,
  CardData,
  CollectionData,
  SetData,
  createAlbumFromCSVInput,
} from "@/types/types";
import { getServerSession } from "next-auth";
import { LogLevel } from "next-axiom/dist/logger";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getImageUri, log, transformCardsFromDB } from "./helpers";

async function getUserIdFromSession(): Promise<string | null> {
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
  const set = await API.getSet(setIdentifier);
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
  const cards = await API.getCardsOfSet(setIdentifier);

  const album = await prisma.album.create({
    data: {
      collectionId: collection.id,
      name: set.name,
      setId: set.id,
      setName: set.name,
      setReleaseDate: set.released_at,
    },
  });

  const isCardDetailsInDB = await prisma.cardDetails.findFirst({
    where: {
      id: cards[0].id,
    },
    select: {
      id: true,
    },
  });

  if (!isCardDetailsInDB) {
    for (let i = 0; i < cards.length; i++) {
      let card = cards[i];
      await prisma.cardDetails.create({
        data: {
          id: card.id,
          albumId: album.id,
          name: card.name,
          imageUri: getImageUri(card),
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
          arena_id: card.arena_id,
          lang: card.lang,
          mtgo_id: card.mtgo_id,
          mtgo_foil_id: card.mtgo_foil_id,
          multiverse_ids: card.multiverse_ids ?? [],
          tcgplayer_id: card.tcgplayer_id,
          tcgplayer_etched_id: card.tcgplayer_etched_id,
          cardmarket_id: card.cardmarket_id,
          oracle_id: card.oracle_id,
          prints_search_uri: card.prints_search_uri,
          rulings_uri: card.rulings_uri,
          scryfall_uri: card.scryfall_uri,
          uri: card.uri,
          card_faces: {
            create:
              card.card_faces.length > 1
                ? card.card_faces.map((face, idx) => ({
                    faceNumber: idx,
                    artist: face.artist,
                    color_indicator: face.color_indicator ?? [],
                    colors: face.colors ?? [],
                    flavor_text: face.flavor_text,
                    illustration_id: face.illustration_id,
                    smallImageURI: face.image_uris?.small,
                    normalImageURI: face.image_uris?.normal,
                    largeImageURI: face.image_uris?.large,
                    pngImageURI: face.image_uris?.png,
                    art_cropImageURI: face.image_uris?.art_crop,
                    border_cropImageURI: face.image_uris?.border_crop,
                    loyalty: face.loyalty,
                    mana_cost: face.mana_cost,
                    name: face.name,
                    oracle_text: face.oracle_text,
                    power: face.power,
                    printed_name: face.printed_name,
                    printed_text: face.printed_text,
                    printed_type_line: face.printed_type_line,
                    toughness: face.toughness,
                    type_line: face.type_line,
                  }))
                : undefined,
          },
          cmc: card.cmc,
          color_identity: card.color_identity,
          color_indicator: card.color_indicator ?? [],
          colors: card.colors ?? [],
          edhrec_rank: card.edhrec_rank,
          hand_modifier: card.hand_modifier,
          keywords: card.keywords,
          layout: card.layout,
          life_modifier: card.life_modifier,
          loyalty: card.loyalty,
          mana_cost: card.mana_cost,
          oracle_text: card.oracle_text,
          oversized: card.oversized,
          power: card.power,
          produced_mana: card.produced_mana ?? [],
          reserved: card.reserved,
          toughness: card.toughness,
          type_line: card.type_line,
          artist: card.artist,
          booster: card.booster,
          border_color: card.border_color,
          card_back_id: card.card_back_id,
          content_warning: card.content_warning,
          digital: card.digital,
          finishes: card.finishes,
          flavor_name: card.flavor_name,
          flavor_text: card.flavor_text,
          frame_effects: card.frame_effects ?? [],
          frame: card.frame,
          full_art: card.full_art,
          games: card.games,
          highres_image: card.highres_image,
          illustration_id: card.illustration_id,
          image_status: card.image_status,
          smallImageURI: card.image_uris?.small,
          normalImageURI: card.image_uris?.normal,
          largeImageURI: card.image_uris?.large,
          pngImageURI: card.image_uris?.png,
          art_cropImageURI: card.image_uris?.art_crop,
          border_cropImageURI: card.image_uris?.border_crop,
          printed_name: card.printed_name,
          printed_text: card.printed_text,
          printed_type_line: card.printed_type_line,
          promo: card.promo,
          promo_types: card.promo_types ?? [],
          released_at: card.released_at,
          reprint: card.reprint,
          scryfall_set_uri: card.scryfall_set_uri,
          set_name: card.set_name,
          set_search_uri: card.set_search_uri,
          set_type: card.set_type,
          set_uri: card.set_uri,
          set: card.set,
          set_id: card.set_id,
          story_spotlight: card.story_spotlight,
          textless: card.textless,
          variation: card.variation,
          variation_of: card.variation_of,
          security_stamp: card.security_stamp as unknown as string | null,
          watermark: card.watermark,
        },
      });
    }
  }

  await prisma.card.createMany({
    data: cards.map((card) => ({
      id: card.id,
      albumId: album.id,
      isCollected: collectedCards ? collectedCards.has(card.id) : false,
    })),
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

  const albumCards = await prisma.cardDetails.findMany({
    where: {
      albumId: albumId,
    },
    select: {
      id: true,
      isCollected: true,
    },
  });

  const cardFaces = await prisma.cardFace.findMany({
    where: {
      cardId: {
        in: albumCards.map((card) => card.id),
      },
    },
    select: {
      id: true,
      faceNumber: true,
    },
  });
  for (let i = 0; i < cardFaces.length; i++) {
    let cardFace = cardFaces[i];
    if (cardFace.faceNumber != null) {
      await prisma.cardFace.update({
        where: {
          id: cardFace.id,
        },
        data: {
          faceNumber: cardFace.id,
        },
      });
    }
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
        include: {
          CardDetails: {
            include: {
              card_faces: true,
            },
          },
        },
        orderBy: {
          CardDetails: {
            collectorNumber: "asc",
          },
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
  const cards = transformCardsFromDB(album.cards);

  return {
    albumName: album.name,
    cards: cardsArrayToMap(cards),
  };
}

export async function getCardPrice(cardId: string): Promise<string | null> {
  const card = await API.getCard(cardId);
  return card.prices?.usd ?? null;
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
  const deleteCards = prisma.cardDetails.deleteMany({
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
): Promise<boolean> {
  const userId = await getUserIdFromSession();
  if (userId == null) {
    log(LogLevel.warn, "User is not logged in");
    return false;
  }
  const res = await prisma.album.findUnique({
    where: {
      id: albumId,
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
  await prisma.cardDetails.deleteMany({
    where: {
      albumId: albumId,
      name: cardName,
    },
  });
  revalidatePath(`/album/{albumId}`);
  log(LogLevel.info, "Card deleted from album");
  return true;
}

export async function searchCardInCollection(
  cardName: string,
): Promise<Map<string, CardData[]>> {
  if (cardName.length < 2) {
    return new Map();
  }
  const userId = await getUserIdFromSession();
  if (userId == null) {
    return new Map();
  }
  const cards = await prisma.card.findMany({
    where: {
      CardDetails: {
        name: {
          contains: cardName,
          mode: "insensitive",
        },
      },
      Album: {
        collection: {
          name: {
            equals: await getCollection(),
          },
          userId: userId,
        },
      },
    },
    include: {
      CardDetails: {
        include: {
          card_faces: true,
        },
      },
    },
  });

  return cardsArrayToMap(transformCardsFromDB(cards));
}

export async function getCollectionStats(): Promise<AlbumStats[]> {
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
    select: {
      id: true,
      name: true,
      cards: {
        select: {
          isCollected: true,
          CardDetails: {
            select: {
              name: true,
              rarity: true,
            },
          },
        },
      },
    },
    orderBy: {
      setReleaseDate: "desc",
    },
  });

  const stats = albums.map((album) => {
    const cardsMap = cardsArrayToMap(
      album.cards.map((c) => ({
        name: c.CardDetails.name,
        isCollected: c.isCollected,
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
