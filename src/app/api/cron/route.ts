import { inngest } from "@/lib/ingest/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  }

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
