"use server";

import { createAlbum } from "./helpers";

export async function createAlbumFromSetId(setId: string) {
  return await createAlbum({ setId });
}
