"use server";

import { prisma } from "@/lib/prisma";
import { hashDecode } from "@/lib/utils";
import { LogLevel } from "next-axiom/dist/logger";
import { revalidatePath } from "next/cache";
import { getUserIdFromSession, log } from "../helpers";

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
