"use server";

import * as DB from "@/lib/db";
import { hashEncode } from "@/lib/utils";
import { AlbumData } from "@/types/types";
import { LogLevel } from "next-axiom/dist/logger";
import { getUserAndCollection, log } from "../helpers";

export async function getAllAlbums(): Promise<AlbumData[]> {
  const { userId, collection } = await getUserAndCollection();
  if (userId == null || collection == null) {
    log(LogLevel.warn, "User is not logged in");
    return [];
  }
  const albums = await DB.getAlbumsOfUser(userId, collection.name);
  return albums.map((album) => ({
    id: hashEncode(album.id),
    name: album.name,
    setId: album.setId,
    setName: album.setName,
    setReleaseDate: album.setReleaseDate,
  }));
}
