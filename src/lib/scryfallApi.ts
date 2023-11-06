import * as Scry from "scryfall-sdk";
import { endsWithNumber } from "./utils";

export async function getAllSets(): Promise<Scry.Set[]> {
  const sets = await Scry.Sets.all();
  return sets
    .filter((set) =>
      ["core", "expansion", "masters", "draft_innovation"].includes(
        set.set_type,
      ),
    )
    .filter((set) => set.digital === false);
}

export async function getSet(setIdentifier: {
  setId?: string;
  setCode?: string;
}): Promise<Scry.Set> {
  return setIdentifier.setId != null
    ? await Scry.Sets.byId(setIdentifier.setId)
    : await Scry.Sets.byCode(setIdentifier.setCode!);
}

export async function searchCards(searchString: string): Promise<Scry.Card[]> {
  return await Scry.Cards.search(`name:/${searchString}/`, {
    unique: "prints",
  }).waitForAll();
}

export async function getCardsOfSet(setIdentifier: {
  setId?: string;
  setCode?: string;
}): Promise<Scry.Card[]> {
  const set = await getSet(setIdentifier);
  const cards = (await set.getCards({ unique: "prints" }))
    .filter((card) => !card.digital)
    .filter(
      (card) =>
        card.layout === "normal" ||
        card.collector_number.endsWith("a") ||
        endsWithNumber(card.collector_number),
    );
  return cards;
}

export async function getCard(cardId: string): Promise<Scry.Card> {
  return await Scry.Cards.byId(cardId);
}
