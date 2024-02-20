"use server";

import * as DB from "@/lib/db";
import * as API from "@/lib/scryfallApi";
import { hashDecode } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getUserAndCollection } from "../helpers";

export async function addCardToAlbum(cardId: string, albumId: string) {
  const { userId, collection } = await getUserAndCollection();
  if (userId == null || collection == null) {
    return false;
  }

  const albumIdDecoded = hashDecode(albumId);
  const album = await DB.getAlbumOfUser(collection.id, albumIdDecoded);
  if (album == null) {
    return false;
  }

  const card = await API.getCard(cardId);

  await DB.addCardToAlbum(card, albumIdDecoded);
  revalidatePath(`/album/${albumId}`);
  return true;
}
