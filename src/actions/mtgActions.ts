"use server";

import { prisma } from "@/lib/prisma";
import * as Scry from "scryfall-sdk";

export type SetData = { name: string; releasedAt: string | null | undefined };

export type CardData = { name: string; image: string | undefined };

function getImageUri(card: Scry.Card): string {
  return (
    (card.card_faces.length > 1
      ? card.card_faces[0].image_uris?.normal
      : card.image_uris?.normal) ?? ""
  );
}

export async function getAllSets(): Promise<SetData[]> {
  const sets = await Scry.Sets.all();
  return sets
    .filter((set) => ["core", "expansion", "masters"].includes(set.set_type))
    .filter((set) => set.digital === false)
    .map((set) => ({ name: set.name, releasedAt: set.released_at }));
}

export async function getAllCardsOfSet(setName: string): Promise<CardData[]> {
  const set = await Scry.Sets.byName(setName);
  const cards = await set.getCards();
  return cards
    .filter((card) => !card.digital)
    .map((card) => ({
      name: card.name,
      image: getImageUri(card),
    }));
}

export async function createAlbum(
  albumName: string,
  setId?: string
): Promise<void> {
  if (!setId) {
    return;
  }
  const set = await Scry.Sets.byId(setId);
  const cards = await set.getCards();
  await prisma.album.create({
    data: {
      name: albumName,
      setId: set.id,
      setName: set.name,
      cards: {
        create: cards.map((card) => ({
          name: card.name,
          imageUri: getImageUri(card),
          id: card.id,
          collectorNumber: parseInt(card.collector_number),
          setName: set.name,
          setId: set.id,
        })),
      },
    },
  });
}
