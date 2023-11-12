"use server";

import { exportDataToCSV } from "@/lib/csv";
import { prisma } from "@/lib/prisma";
import { CsvOutput } from "export-to-csv";
import { getCollection } from "./mtgActions";

export async function exportCollectionToCSV(): Promise<CsvOutput> {
  const cards = await prisma.card.findMany({
    where: {
      Album: {
        collection: {
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
        },
      },
    },
  });

  const dataToExport = cards.map((card) => ({
    cardScryfallId: card.id,
    numCollected: card.numCollected,
    albumId: card.Album.id,
    albumName: card.Album.name,
  }));

  return await exportDataToCSV(dataToExport);
}
