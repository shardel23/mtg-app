import { getCard } from "@/lib/scryfallApi";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cardId = searchParams.get("cardId");
  const price = (await getCard(cardId!)).prices.usd;
  return Response.json({ price });
}
