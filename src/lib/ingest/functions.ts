import * as DB from "@/lib/db";
import * as API from "@/lib/scryfallApi";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { event, body: "Hello, World!" };
  },
);

export const fetchPrices = inngest.createFunction(
  { id: "fetch-prices" },
  { event: "fetch.prices" },
  async ({ event, step }) => {
    const cardIds = await step.run("Get All Card Details", async () => {
      const cardDetails = await DB.getAllCardDetails();
      return cardDetails.map((card) => card.id);
    });

    const CHUNK_SIZE = 25;
    const totalChunks = Math.ceil(cardIds.length / CHUNK_SIZE);

    for (let i = 0; i < cardIds.length; i += CHUNK_SIZE) {
      const chunk = cardIds.slice(i, i + CHUNK_SIZE);
      const chunkIndex = Math.floor(i / CHUNK_SIZE) + 1;

      await step.run(
        `Fetch & Store Prices ${chunkIndex}/${totalChunks}`,
        async () => {
          const prices = await API.getCardsPrices(chunk);
          await DB.setCardPrices(prices);

          return {
            chunk: chunkIndex,
            processed: chunk.length,
          };
        },
      );
    }

    return { event, body: { status: "success" } };
  },
);
