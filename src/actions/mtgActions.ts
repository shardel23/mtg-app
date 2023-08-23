"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import * as Scry from "scryfall-sdk";

export type SetData = { name: string; id: string };

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
    .map((set) => ({ name: set.name, id: set.id }));
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

export async function getAllAlbums(): Promise<
  { name: string; setId: string; setName: string }[]
> {
  const albums = await prisma.album.findMany();
  return albums
    .filter((album) => album.setId != null && album.setName != null)
    .map((album) => ({
      name: album.name,
      setId: album.setId as string,
      setName: album.setName as string,
    }));
}

async function isSetExists(setName: string): Promise<boolean> {
  const album = await prisma.album.findFirst({
    where: {
      name: setName,
    },
  });
  return album != null;
}

export async function createAlbumFromSetId(setId: string): Promise<void> {
  const set = await Scry.Sets.byId(setId);
  const isSetInDB = await isSetExists(set.name);
  if (isSetInDB) {
    return;
  }
  const cards = await set.getCards();
  await prisma.album.create({
    data: {
      name: set.name,
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
  revalidatePath("/");
}
