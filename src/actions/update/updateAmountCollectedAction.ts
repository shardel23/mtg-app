"use server";

import * as DB from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { hashDecode } from "@/lib/utils";
import { LogLevel } from "next-axiom/dist/logger";
import { getUserAndCollection, log } from "../helpers";

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
      isFoil: amount === 0 ? false : undefined,
    },
  });
}
