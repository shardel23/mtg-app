import { CardData, ManaCost } from "@/types/types";
import * as Scry from "scryfall-sdk";

export const getImageUri = (card: Scry.Card): string => {
  return (
    (card.card_faces.length > 1
      ? card.card_faces[0].image_uris?.normal
      : card.image_uris?.normal) ?? ""
  );
};

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
    manaCost: card.mana_cost ,
    cmc: card.cmc,
    cardFaces: card.card_faces.map((face) => ({
      name: face.name,
      image: face.image_uris?.normal ?? "",
      manaCost: face.mana_cost,
      cmc: getCardCMC(face.mana_cost)
    })),
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

function getCardCMC(manaCost: ManaCost): number {
  if (manaCost == null) {
    return 0;
  }
  const matches = manaCost.match(/{\w+}/g);
  if (matches == null) {
    return 0;
  }
  return matches.reduce((sum, match) => {
    const manaSymbol = match.slice(1, -1);
    const manaSymbolNumber = parseInt(manaSymbol);
    return sum + (isNaN(manaSymbolNumber) ? 1 : manaSymbolNumber);
  }, 0);
}
