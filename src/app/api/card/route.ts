import { getCard } from "@/lib/scryfallApi";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cardId = searchParams.get("cardId");
  const price = (await getCard(cardId!)).prices.usd;
  return NextResponse.json({ price });
}
