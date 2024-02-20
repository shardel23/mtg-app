"use server";

import { prisma } from "@/lib/prisma";
import { LogLevel } from "next-axiom/dist/logger";
import { revalidatePath } from "next/cache";
import { getUserIdFromSession, log } from "../helpers";

export async function changeUsername(username: string) {
  const userId = await getUserIdFromSession();
  if (userId == null) {
    log(LogLevel.warn, "User is not logged in");
    return {
      result: false,
      error: "User is not logged in",
    };
  }

  const isUsernameTaken = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (isUsernameTaken != null) {
    log(LogLevel.info, "Username is already taken");
    return {
      result: false,
      error: "Username is already taken",
    };
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      username: username,
    },
  });

  revalidatePath("/");
  return {
    result: true,
  };
}
