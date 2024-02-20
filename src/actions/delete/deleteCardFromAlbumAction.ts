"use server";

import * as DB from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { hashDecode } from "@/lib/utils";
import { LogLevel } from "next-axiom/dist/logger";
import { revalidatePath } from "next/cache";
import { getUserIdFromSession, log } from "../helpers";

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
