"use server";

import { cookies } from "next/headers";

export async function setCollectionCookie(collection: string) {
  cookies().set({
    name: "collection",
    value: collection,
    httpOnly: true,
  });

  return Promise.resolve({
    actionNow: Date.now(),
  });
}
