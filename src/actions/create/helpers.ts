import * as DB from "@/lib/db";
import { prisma } from "@/lib/prisma";
import * as API from "@/lib/scryfallApi";
import { hashEncode, isSetExists, logWithTimestamp } from "@/lib/utils";
import { LogLevel } from "next-axiom/dist/logger";
import { revalidatePath } from "next/cache";
import { getUserAndCollection, log } from "../helpers";

export async function createAlbum(
  setIdentifier: { setId?: string; setCode?: string },
  collectedCards?: Map<string, number>,
) {
  log(LogLevel.info, "Starting to create album from set " + setIdentifier);
  const { userId, collection } = await getUserAndCollection();
  if (userId == null || collection == null) {
    log(LogLevel.warn, "User is not logged in");
    return "";
  }

  log(LogLevel.info, "Getting set info from API");
  const set = await API.getSet(setIdentifier);
  const isSetInDB = await isSetExists(set.id, collection.id);
  if (isSetInDB) {
    logWithTimestamp("Set " + set.name + " already exists in DB");
    return "";
  }
  const cards = await API.getCardsOfSet(setIdentifier);

  // Avoid adding cards which are not in boosters
  log(LogLevel.info, "Filtering cards");
  const cardsInBoosters = cards.filter((c) => c.booster);
  const cardNamesInBoosters = new Set<string>(
    cardsInBoosters.map((c) => c.name),
  );
  const cardsToAdd = cards.filter((c) => cardNamesInBoosters.has(c.name));

  log(LogLevel.info, "Creating album " + set.name);
  const album = await prisma.album.create({
    data: {
      collectionId: collection.id,
      name: set.name,
      setId: set.id,
      setName: set.name,
      setReleaseDate: set.released_at,
    },
  });
  logWithTimestamp("Album " + album.name + " created");

  await DB.createCardsDetails(cardsToAdd, set);

  log(LogLevel.info, "Creating cards for album " + album.name);
  await prisma.card.createMany({
    data: cardsToAdd.map((card) => ({
      id: card.id,
      albumId: album.id,
      numCollected: collectedCards
        ? collectedCards.has(card.id)
          ? collectedCards.get(card.id)
          : 0
        : 0,
    })),
  });
  logWithTimestamp("Created cards for album " + album.name);

  log(LogLevel.info, "Album " + album.name + " created successfully");
  revalidatePath("/");
  return hashEncode(album.id);
}
