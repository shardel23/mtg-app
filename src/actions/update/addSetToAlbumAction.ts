"use server";

import * as DB from "@/lib/db";
import { prisma } from "@/lib/prisma";
import * as API from "@/lib/scryfallApi";
import { hashDecode, logWithTimestamp } from "@/lib/utils";
import { LogLevel } from "next-axiom/dist/logger";
import { revalidatePath } from "next/cache";
import { getUserAndCollection, log } from "../helpers";

export async function addSetToAlbum(setId: string, albumId: string) {
  log(
    LogLevel.info,
    `Starting to add cards from set ${setId} to album ${albumId}`,
  );
  const { userId, collection } = await getUserAndCollection();
  if (userId == null || collection == null) {
    log(LogLevel.warn, "User is not logged in");
    return false;
  }

  const albumIdDecoded = hashDecode(albumId);
  const album = await DB.getAlbumOfUser(collection.id, albumIdDecoded);
  if (album == null) {
    return false;
  }

  log(LogLevel.info, "Getting set info from API");
  const set = await API.getSet({ setId });
  const cardsToAdd = await API.getCardsOfSet({ setId });

  await DB.createCardsDetails(cardsToAdd, set);

  log(LogLevel.info, "Creating cards for album " + album.id);
  await prisma.card.createMany({
    data: cardsToAdd.map((card) => ({
      id: card.id,
      albumId: album.id,
      numCollected: 0,
    })),
  });
  logWithTimestamp("Added cards to album " + album.id);

  log(LogLevel.info, `${cardsToAdd.length} cards added to album ${album.id}`);

  revalidatePath(`/album/${albumId}`);
  return true;
}
