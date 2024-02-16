import fetchPrices from "@/lib/prices";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await fetchPrices();
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Failed to fetch prices",
      error: error,
    });
  }
  return NextResponse.json({ status: "ok" });
}
