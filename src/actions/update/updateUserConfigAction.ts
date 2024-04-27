"use server";

import * as DB from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getUserAndCollection } from "../helpers";

export async function updateUserConfig({
  show17LandsSection,
}: {
  show17LandsSection: boolean;
}) {
  const { userId } = await getUserAndCollection();
  if (userId == null) {
    return false;
  }

  await DB.updateUserConfig(userId, { show17LandsSection });

  revalidatePath(`/album/*`);
  return true;
}
