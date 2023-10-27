import { Color, Layout } from "scryfall-sdk";

export type CollectionData = {
  name: string;
};

export type AlbumData = {
  id: number;
  name: string;
  setId: string;
  setName: string;
  setReleaseDate: string;
};

export type SetData = { name: string; id: string };

export type CardData = {
  id: string;
  name: string;
  image: string;
  isCollected?: boolean;
  albumId?: number;
  collectorNumber: string;
  setCode: string;
  setIconUri?: string;
  rarity: string;
  colors: Color[];
  manaCost: ManaCost;
  cmc: number;
  layout: keyof typeof Layout;
  cardFaces?: {
    name: string;
    image: string;
    manaCost: ManaCost;
    cmc: number;
  }[];
};

export type ManaCost = string | null | undefined;

export type createAlbumFromCSVInput = {
  cardName: string;
  setCode: string;
  collectorNumber: string;
  cardId: string;
}[];
