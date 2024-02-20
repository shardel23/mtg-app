"use server";

import * as DB from "@/lib/db";
import { hashEncode } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getUserAndCollection } from "../helpers";

export async function createEmptyAlbum(name: string): Promise<string> {
  const { userId, collection } = await getUserAndCollection();
  if (userId == null || collection == null) {
    return "";
  }
  const newAlbum = await DB.createEmptyAlbum(collection, name);
  revalidatePath("/");
  return hashEncode(newAlbum.id);
}
