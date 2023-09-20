import { CardData } from "@/types/types";
import * as Scry from "scryfall-sdk";

export const getImageUri = (card: Scry.Card): string => {
  return (
    (card.card_faces.length > 1
      ? card.card_faces[0].image_uris?.normal
      : card.image_uris?.normal) ?? ""
  );
};

export async function getCardFromAPI(cardId: string): Promise<CardData> {
  const card = await Scry.Cards.byId(cardId);
  return {
    id: card.id,
    name: card.name,
    image: getImageUri(card),
    collectorNumber: card.collector_number,
    setCode: card.set,
    setIconUri: card.set_uri,
    rarity: card.rarity,
    colors: getCardColors(card),
  };
}

export const transformCards = (
  cards: Scry.Card[],
  set?: Scry.Set
): CardData[] => {
  return cards.map((card) => ({
    id: card.id,
    name: card.name,
    image: getImageUri(card),
    collectorNumber: card.collector_number,
    setCode: card.set,
    setIconUri: set?.icon_svg_uri,
    rarity: card.rarity,
    colors: getCardColors(card),
    backFace:
      card.card_faces.length > 1
        ? {
            name: card.card_faces[1].name,
            image: card.card_faces[1].image_uris?.normal ?? "",
          }
        : undefined,
  }));
};

function getCardColors(card: Scry.Card): Scry.Color[] {
  return (
    (card.card_faces.length > 0
      ? card.card_faces.reduce(
          (colors, face) => [...colors, ...(face.colors ?? [])],
          [] as Scry.Color[]
        )
      : card.colors) ?? []
  );
}
