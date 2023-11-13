"use server";

import { exportDataToCSV } from "@/lib/csv";
import { prisma } from "@/lib/prisma";
import { CsvOutput } from "export-to-csv";
import { LogLevel } from "next-axiom/dist/logger";
import { log } from "./helpers";
import { getCollection, getUserIdFromSession } from "./mtgActions";

export async function exportCollectionToCSV(): Promise<CsvOutput> {
  const userId = await getUserIdFromSession();

  if (userId === null) {
    log(LogLevel.error, "Attempt to export when user not logged in");
    throw new Error("User not logged in");
  }

  const cards = await prisma.card.findMany({
    where: {
      Album: {
        collection: {
          userId: userId,
          name: {
            equals: await getCollection(),
          },
        },
      },
    },
    select: {
      id: true,
      numCollected: true,
      Album: {
        select: {
          id: true,
          name: true,
          setId: true,
        },
      },
    },
  });

  const dataToExport = cards.map((card) => ({
    cardScryfallId: card.id,
    numCollected: card.numCollected,
    setScryfallId: card.Album.setId,
    albumId: card.Album.id,
    albumName: card.Album.name,
  }));

  return await exportDataToCSV(dataToExport);
}
