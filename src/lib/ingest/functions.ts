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
    const prices = await step.run("Get Cards Prices", async () => {
      return await API.getCardsPrices(cardIds);
    });
    await step.run("Set Card Prices", async () => {
      return await DB.setCardPrices(prices);
    });
    return { event, body: prices };
  },
);
