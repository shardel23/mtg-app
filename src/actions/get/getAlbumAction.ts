"use server";

import * as DB from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { cardsArrayToMap, hashDecode } from "@/lib/utils";
import { CardData, ViewMode } from "@/types/types";
import { LogLevel } from "next-axiom/dist/logger";
import {
  compareCards,
  getUserAndCollection,
  log,
  transformCardsFromDB,
} from "../helpers";

export async function getAlbum(
  username: string,
  albumId: string,
): Promise<{
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
  if (albumIdDecoded == null) {
    log(LogLevel.warn, "Album id is not valid");
    return {
      cards: new Map(),
      viewMode: "view",
    };
  }

  const ownerId =
    username !== ""
      ? (
          await prisma.user.findUnique({
            where: {
              username: username,
            },
            select: {
              id: true,
            },
          })
        )?.id
      : userId;
  if (ownerId == null) {
    log(LogLevel.warn, "User does not exist");
    return {
      cards: new Map(),
      viewMode: "view",
    };
  }

  const albumWithCards = await DB.getAlbumOfUserWithCards(
    ownerId,
    albumIdDecoded,
  );

  if (albumWithCards == null) {
    return {
      cards: new Map(),
      viewMode: "view",
    };
  }

  const albumCards = [...albumWithCards.cards];
  if (albumWithCards.setId == null) {
    albumCards.sort(compareCards);
  }
  const cards = transformCardsFromDB(albumCards);

  return {
    album: {
      id: albumId,
      name: albumWithCards.name,
      setId: albumWithCards.setId,
    },
    cards: cardsArrayToMap(cards),
    viewMode: userId === ownerId ? "edit" : "view",
  };
}
