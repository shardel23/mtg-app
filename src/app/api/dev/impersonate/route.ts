import { prisma } from "@/lib/prisma";
import { devSessionCookieName, isDevelopmentRuntime } from "@/lib/devAuth";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 30;

export async function POST(request: Request) {
  if (!isDevelopmentRuntime()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const username =
    typeof body === "object" &&
    body !== null &&
    "username" in body &&
    typeof (body as { username: unknown }).username === "string"
      ? (body as { username: string }).username.trim()
      : "";

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return NextResponse.json({ error: "No user with that username" }, { status: 404 });
  }

  const sessionToken = randomUUID();
  const expires = new Date(Date.now() + SESSION_MAX_AGE_SEC * 1000);

  await prisma.session.create({
    data: {
      sessionToken,
      userId: user.id,
      expires,
    },
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: devSessionCookieName,
    value: sessionToken,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: false,
    maxAge: SESSION_MAX_AGE_SEC,
  });

  return res;
}
