import { getImageUri } from "@/actions/helpers";
import * as API from "@/lib/scryfallApi";
import { Card } from "scryfall-sdk";
import { prisma } from "./prisma";
import { endsWithNumber } from "./utils";

export const getAlbumOfUserWithCards = async (
  userId: string,
  albumId: number,
) => {
  const album = await prisma.album.findUnique({
    where: {
      id: albumId,
      collection: {
        name: {
          equals: "Default",
        },
        userId: userId,
      },
    },
    select: {
      setId: true,
    },
  });

  if (album == null) {
    return null;
  }

  const orderBy =
    album.setId != null
      ? ({
          CardDetails: {
            collectorNumber: "asc",
          },
        } as const)
      : [
          { CardDetails: { colors: "desc" } } as const,
          { CardDetails: { cmc: "asc" } } as const,
          { CardDetails: { set_name: "asc" } } as const,
          {
            CardDetails: {
              collectorNumber: "asc",
            },
          } as const,
        ];

  return await prisma.album.findUnique({
    where: {
      id: albumId,
      collection: {
        name: {
          equals: "Default",
        },
        userId: userId,
      },
    },
    select: {
      name: true,
      setId: true,
      cards: {
        select: {
          id: true,
          numCollected: true,
          albumId: true,
          CardDetails: {
            select: {
              name: true,
              collectorNumber: true,
              normalImageURI: true,
              set: true,
              setIconSvgUri: true,
              rarity: true,
              colors: true,
              mana_cost: true,
              cmc: true,
              layout: true,
              type_line: true,
              card_faces: {
                select: {
                  name: true,
                  faceNumber: true,
                  normalImageURI: true,
                  colors: true,
                  mana_cost: true,
                  type_line: true,
                },
                orderBy: {
                  faceNumber: "asc",
                },
              },
            },
          },
        },
        orderBy,
      },
    },
  });
};

export const searchCardsInCollection = async (
  userId: string,
  collection: string,
  cardName: string,
) => {
  return await prisma.card.findMany({
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
            equals: collection,
          },
          userId: userId,
        },
      },
    },
    select: {
      id: true,
      numCollected: true,
      albumId: true,
      CardDetails: {
        select: {
          name: true,
          collectorNumber: true,
          normalImageURI: true,
          set: true,
          setIconSvgUri: true,
          rarity: true,
          colors: true,
          mana_cost: true,
          cmc: true,
          layout: true,
          type_line: true,
          card_faces: {
            select: {
              name: true,
              faceNumber: true,
              normalImageURI: true,
              colors: true,
              mana_cost: true,
              type_line: true,
            },
            orderBy: {
              faceNumber: "asc",
            },
          },
        },
      },
    },
  });
};

export const getCardsAvailableForTrade = async (
  userId: string,
  collection: string,
) => {
  return await prisma.card.findMany({
    where: {
      numCollected: {
        gt: 1,
      },
      Album: {
        collection: {
          name: {
            equals: collection,
          },
          userId: userId,
        },
      },
    },
    select: {
      id: true,
      numCollected: true,
      albumId: true,
      CardDetails: {
        select: {
          name: true,
          collectorNumber: true,
          normalImageURI: true,
          set: true,
          setIconSvgUri: true,
          rarity: true,
          colors: true,
          mana_cost: true,
          cmc: true,
          layout: true,
          type_line: true,
          card_faces: {
            select: {
              name: true,
              faceNumber: true,
              normalImageURI: true,
              colors: true,
              mana_cost: true,
              type_line: true,
            },
            orderBy: {
              faceNumber: "asc",
            },
          },
        },
      },
    },
    orderBy: [
      { CardDetails: { colors: "desc" } },
      { CardDetails: { cmc: "asc" } },
      { CardDetails: { set_name: "asc" } },
      {
        CardDetails: {
          collectorNumber: "asc",
        },
      },
    ],
  });
};

export const createEmptyAlbum = async (
  collection: { id: number },
  albumName: string,
) => {
  return await prisma.album.create({
    data: {
      collectionId: collection.id,
      name: albumName,
    },
  });
};

export const upsertCardDetails = async (
  card: Card,
  setDetails: { setCode: string; setIconSvgUri: string },
) => {
  await prisma.cardDetails.upsert({
    where: {
      id: card.id,
    },
    update: {},
    create: {
      id: card.id,
      name: card.name,
      imageUri: getImageUri(card),
      collectorNumber: parseInt(
        endsWithNumber(card.collector_number)
          ? card.collector_number
          : card.collector_number.slice(0, -1),
      ),
      setName: card.set_name,
      setId: card.set_id,
      setCode: setDetails.setCode,
      setIconSvgUri: setDetails.setIconSvgUri,
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
};

export const addCardToAlbum = async (card: Card, albumId: number) => {
  let set = await API.getSet({ setId: card.set_id });

  await upsertCardDetails(card, {
    setCode: set.code,
    setIconSvgUri: set.icon_svg_uri,
  });

  await prisma.card.upsert({
    where: {
      id_albumId: {
        id: card.id,
        albumId: albumId,
      },
    },
    create: {
      id: card.id,
      albumId: albumId,
      numCollected: 1,
    },
    update: {
      numCollected: {
        increment: 1,
      },
    },
  });
};

export const getAlbumsOfUser = async (userId: string, collection: string) => {
  return await prisma.album.findMany({
    where: {
      collection: {
        name: {
          equals: collection,
        },
        userId: userId,
      },
    },
    orderBy: {
      setReleaseDate: "desc",
    },
  });
};

export const getAlbumOfUsername = async (username: string, albumId: number) => {
  return await prisma.album.findUnique({
    where: {
      id: albumId,
      collection: {
        User: {
          username: username,
        },
      },
    },
    select: {
      id: true,
      name: true,
      cards: {
        select: {
          id: true,
          numCollected: true,
          CardDetails: {
            select: {
              name: true,
              collectorNumber: true,
              normalImageURI: true,
              set: true,
              setIconSvgUri: true,
              rarity: true,
              colors: true,
              mana_cost: true,
              cmc: true,
              layout: true,
              type_line: true,
              card_faces: {
                select: {
                  name: true,
                  faceNumber: true,
                  normalImageURI: true,
                  colors: true,
                  mana_cost: true,
                  type_line: true,
                },
                orderBy: {
                  faceNumber: "asc",
                },
              },
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
};

export const getAlbumsOfUserWithCollectionStats = async (
  userId: string,
  collection: string,
) => {
  return await prisma.album.findMany({
    where: {
      collection: {
        name: {
          equals: collection,
        },
        userId: userId,
      },
    },
    select: {
      id: true,
      name: true,
      setId: true,
      cards: {
        select: {
          numCollected: true,
          CardDetails: {
            select: {
              name: true,
              rarity: true,
              colors: true,
              card_faces: {
                select: {
                  colors: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      setReleaseDate: "desc",
    },
  });
};

export const getAlbumOfUser = async (collectionId: number, albumId: number) => {
  return await prisma.album.findUnique({
    where: {
      id: albumId,
      collectionId: collectionId,
    },
    select: {
      id: true,
      collectionId: true,
    },
  });
};

export const deleteCardsFromAlbum = async (
  albumId: number,
  cardIds: string[],
) => {
  await prisma.card.deleteMany({
    where: {
      albumId: albumId,
      id: {
        in: cardIds,
      },
    },
  });
};

export async function getOwnedCards(userId: string, collection: string) {
  return await prisma.card.findMany({
    where: {
      numCollected: {
        gt: 0,
      },
      Album: {
        collection: {
          name: {
            equals: collection,
          },
          userId: userId,
        },
      },
    },
    select: {
      id: true,
    },
  });
}
