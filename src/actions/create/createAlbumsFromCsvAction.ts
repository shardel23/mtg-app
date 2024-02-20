"use server";

import { logWithTimestamp } from "@/lib/utils";
import { createAlbumsFromCSVInput } from "@/types/types";
import { revalidatePath } from "next/cache";
import { createAlbum } from "./helpers";

export async function createAlbumsFromCSV(
  input: createAlbumsFromCSVInput,
): Promise<boolean> {
  const setIds = new Set<string>();
  const collectedCards = new Map<string, number>();
  input.forEach((row) => {
    if (row.numCollected > 0) {
      setIds.add(row.setId);
      if (collectedCards.has(row.cardId)) {
        collectedCards.set(row.cardId, collectedCards.get(row.cardId)! + 1);
      } else {
        collectedCards.set(row.cardId, 1);
      }
    }
  });

  for (const setId of setIds) {
    logWithTimestamp("Creating album for set " + setId);
    await createAlbum({ setId }, collectedCards);
    logWithTimestamp("Album created for set " + setId);
  }

  revalidatePath("/");
  return true;
}
