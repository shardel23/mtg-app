import { inngest } from "@/lib/ingest/client";
import { fetchPrices, helloWorld } from "@/lib/ingest/functions";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorld, fetchPrices],
});
