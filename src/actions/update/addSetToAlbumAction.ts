"use server";

import * as DB from "@/lib/db";
import { prisma } from "@/lib/prisma";
import * as API from "@/lib/scryfallApi";
import { hashDecode, logWithTimestamp } from "@/lib/utils";
import { fetch17LandsStats } from "@/util/redis/fetch17LandsStats";
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
  let cardsToAdd = await API.getCardsOfSet({ setId });

  if (set.code === "spg" && album.setId != null) {
    const albumSet = await API.getSet({ setId: album.setId });
    const cardStats17Lands = await fetch17LandsStats(albumSet.code);
    cardsToAdd = cardsToAdd.filter((card) =>
      cardStats17Lands.some((c) => card.name.includes(c.name)),
    );
  }

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
