import { inngest } from "@/lib/ingest/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await inngest.send({
      name: "fetch.prices",
    });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Failed to fetch prices",
      error: error,
    });
  }
  return NextResponse.json({ status: "ok" });
}
