"use server";

import * as Scry from "scryfall-sdk";

export type SetData = { name: string; releasedAt: string | null | undefined };

export type CardData = { name: string; image: string | undefined };

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
      image: (card.card_faces.length > 1 ? card.card_faces[0] : card).image_uris
        ?.normal,
    }));
}
