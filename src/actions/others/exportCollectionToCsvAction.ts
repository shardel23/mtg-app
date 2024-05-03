"use server";

import { exportDataToCSV } from "@/lib/csv";
import { prisma } from "@/lib/prisma";
import { hashEncode } from "@/lib/utils";
import { CsvOutput } from "export-to-csv";
import { LogLevel } from "next-axiom/dist/logger";
import { getCollection, getUserIdFromSession, log } from "../helpers";

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
      CardDetails: {
        select: {
          name: true,
          collectorNumber: true,
          rarity: true,
          price_usd: true,
          set_id: true,
        },
      },
    },
  });

  const dataToExport = cards.map((card) => ({
    cardScryfallId: card.id,
    cardName: card.CardDetails.name,
    cardCollectorNumber: card.CardDetails.collectorNumber,
    cardRarity: card.CardDetails.rarity,
    cardPrice: card.CardDetails.price_usd,
    numCollected: card.numCollected,
    setScryfallId: card.CardDetails.set_id,
    albumId: hashEncode(card.Album.id),
    albumName: card.Album.name,
  }));

  return await exportDataToCSV(dataToExport);
}
