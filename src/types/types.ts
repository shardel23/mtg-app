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
  types: string[];
  cardFaces?: {
    name: string;
    image: string;
    manaCost: ManaCost;
    cmc: number;
    types: string[];
  }[];
  price: string | null | undefined;
};

export type ManaCost = string | null | undefined;

export type createAlbumFromCSVInput = {
  cardName: string;
  setCode: string;
  collectorNumber: string;
  cardId: string;
}[];

type CollectedMissingStats = {
  collected: number;
  missing: number;
  total: number;
};

export type AlbumStats = {
  name: string;
  total: CollectedMissingStats;
  common: CollectedMissingStats;
  uncommon: CollectedMissingStats;
  rare: CollectedMissingStats;
  mythic: CollectedMissingStats;
};
