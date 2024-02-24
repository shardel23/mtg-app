"use server";

import * as DB from "@/lib/db";
import { hashDecode } from "@/lib/utils";
import { LogLevel } from "next-axiom/dist/logger";
import { getUserAndCollection, log } from "../helpers";

export async function setCardFoil(
  cardId: string,
  albumId: string,
  newIsFoil: boolean,
) {
  const { userId, collection } = await getUserAndCollection();
  if (userId == null || collection == null) {
    log(LogLevel.warn, "User is not logged in");
    return false;
  }

  const albumIdDecoded = hashDecode(albumId);
  const album = await DB.getAlbumOfUser(collection.id, albumIdDecoded);
  if (album?.collectionId !== collection.id) {
    log(LogLevel.warn, "User is not the owner of the album");
    return false;
  }

  await DB.setCardFoil(cardId, albumIdDecoded, newIsFoil);
  return true;
}
