"use server";

import * as DB from "@/lib/db";
import { getAlbumsOfUserWithCollectionStats } from "@/lib/db";
import { cardsArrayToMap, hashEncode } from "@/lib/utils";
import { CollectionStats } from "@/types/types";
import { partition } from "lodash";
import { LogLevel } from "next-axiom/dist/logger";
import { getUserAndCollection, log } from "../helpers";

export async function getCollectionStats(): Promise<CollectionStats> {
  const { userId, collection } = await getUserAndCollection();
  if (userId == null || collection == null) {
    log(LogLevel.warn, "User is not logged in");
    return {
      setAlbumsStats: [],
      nonSetAlbumsStats: [],
    };
  }

  const albums = await DB.getAlbumsOfUserWithCollectionStats(
    userId,
    collection.name,
  );
  const [setAlbums, nonSetAlbums] = partition(
    albums,
    (album) => album.setId != null,
  );
  const setAlbumsStats = setAlbums.map(albumToStats);
  const nonSetAlbumsStats = nonSetAlbums.map(albumToStats);
  return {
    setAlbumsStats,
    nonSetAlbumsStats,
  };
}

const albumToStats = (
  album: Awaited<ReturnType<typeof getAlbumsOfUserWithCollectionStats>>[0],
) => {
  const emptyStats = {
    collected: 0,
    missing: 0,
    total: 0,
  };
  const cardsMap = cardsArrayToMap(
    album.cards.map((c) => ({
      name: c.CardDetails.name,
      isCollected: c.numCollected > 0,
      rarity: c.CardDetails.rarity,
      colors:
        c.CardDetails.card_faces.length > 0
          ? c.CardDetails.card_faces[0].colors
              .concat(c.CardDetails.card_faces[1].colors)
              .filter((color, index, array) => array.indexOf(color) === index)
          : c.CardDetails.colors,
      price: c.CardDetails.price_usd ?? 0,
    })),
  );
  const stats = {
    id: hashEncode(album.id),
    name: album.name,
    total: {
      collected: 0,
      missing: 0,
      total: cardsMap.size,
    },
    rarity: {
      common: { ...emptyStats },
      uncommon: {
        ...emptyStats,
      },
      rare: {
        ...emptyStats,
      },
      mythic: {
        ...emptyStats,
      },
    },
    colors: {
      white: {
        ...emptyStats,
      },
      blue: {
        ...emptyStats,
      },
      black: {
        ...emptyStats,
      },
      red: {
        ...emptyStats,
      },
      green: {
        ...emptyStats,
      },
      multicolor: {
        ...emptyStats,
      },
      colorless: {
        ...emptyStats,
      },
    },
    value: 0,
  };
  cardsMap.forEach((card) => {
    const isCollected = card.some((ver) => ver.isCollected);
    stats.total.collected += isCollected ? 1 : 0;
    stats.total.missing += isCollected ? 0 : 1;
    card.forEach((ver) => {
      stats.value += ver.isCollected ? ver.price : 0;
    });
    switch (card[0].rarity) {
      case "common":
        stats.rarity.common.total += 1;
        stats.rarity.common.collected += isCollected ? 1 : 0;
        stats.rarity.common.missing += isCollected ? 0 : 1;
        break;
      case "uncommon":
        stats.rarity.uncommon.total += 1;
        stats.rarity.uncommon.collected += isCollected ? 1 : 0;
        stats.rarity.uncommon.missing += isCollected ? 0 : 1;
        break;
      case "rare":
        stats.rarity.rare.total += 1;
        stats.rarity.rare.collected += isCollected ? 1 : 0;
        stats.rarity.rare.missing += isCollected ? 0 : 1;
        break;
      case "mythic":
        stats.rarity.mythic.total += 1;
        stats.rarity.mythic.collected += isCollected ? 1 : 0;
        stats.rarity.mythic.missing += isCollected ? 0 : 1;
        break;
    }
    const colors = card[0].colors;
    if (colors.length > 1) {
      stats.colors.multicolor.total += 1;
      stats.colors.multicolor.collected += isCollected ? 1 : 0;
      stats.colors.multicolor.missing += isCollected ? 0 : 1;
    } else if (colors.length === 0) {
      stats.colors.colorless.total += 1;
      stats.colors.colorless.collected += isCollected ? 1 : 0;
      stats.colors.colorless.missing += isCollected ? 0 : 1;
    } else {
      switch (colors[0]) {
        case "W":
          stats.colors.white.total += 1;
          stats.colors.white.collected += isCollected ? 1 : 0;
          stats.colors.white.missing += isCollected ? 0 : 1;
          break;
        case "U":
          stats.colors.blue.total += 1;
          stats.colors.blue.collected += isCollected ? 1 : 0;
          stats.colors.blue.missing += isCollected ? 0 : 1;
          break;
        case "B":
          stats.colors.black.total += 1;
          stats.colors.black.collected += isCollected ? 1 : 0;
          stats.colors.black.missing += isCollected ? 0 : 1;
          break;
        case "R":
          stats.colors.red.total += 1;
          stats.colors.red.collected += isCollected ? 1 : 0;
          stats.colors.red.missing += isCollected ? 0 : 1;
          break;
        case "G":
          stats.colors.green.total += 1;
          stats.colors.green.collected += isCollected ? 1 : 0;
          stats.colors.green.missing += isCollected ? 0 : 1;
          break;
      }
    }
  });
  stats.value = Math.round(stats.value * 100) / 100;
  return stats;
};
