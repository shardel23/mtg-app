"use server";

import * as DB from "@/lib/db";
import { getUserAndCollection } from "../helpers";

export async function getUserConfig() {
  const { userId } = await getUserAndCollection();
  if (userId == null) {
    return null;
  }
  return await DB.getUserConfig(userId);
}
