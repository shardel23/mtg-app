export type CollectionData = {
  name: string;
};

export type AlbumData = {
  id: string;
  name: string;
  setId?: string | null;
  setName?: string | null;
  setReleaseDate?: string | null;
};

export type SetData = { name: string; id: string };

export type CardData = {
  id: string;
  name: string;
  image: string;
  isCollected?: boolean;
  numCollected: number;
  albumId?: string;
  collectorNumber: string;
  setCode: string;
  setIconUri?: string;
  rarity: string;
  colors: string[];
  manaCost: ManaCost;
  cmc: number;
  layout: string;
  types: string[];
  cardFaces?: {
    name: string;
    image: string;
    manaCost: ManaCost;
    cmc: number;
    types: string[];
  }[];
  priceUsd: number;
  priceUsdFoil: number;
  isFoil: boolean;
};

export type ManaCost = string | null | undefined;

export type createAlbumsFromCSVInput = {
  cardId: string;
  setId: string;
  numCollected: number;
}[];

export type createAlbumFromCSVInput = {
  cardName: string;
  setCode: string;
  collectorNumber: string;
  cardId: string;
}[];

export type CollectedMissingStats = {
  collected: number;
  missing: number;
  total: number;
};

export type AlbumStats = {
  id: string;
  name: string;
  total: CollectedMissingStats;
  rarity: {
    common: CollectedMissingStats;
    uncommon: CollectedMissingStats;
    rare: CollectedMissingStats;
    mythic: CollectedMissingStats;
  };
  colors: {
    white: CollectedMissingStats;
    blue: CollectedMissingStats;
    black: CollectedMissingStats;
    red: CollectedMissingStats;
    green: CollectedMissingStats;
    multicolor: CollectedMissingStats;
    colorless: CollectedMissingStats;
  };
  value: number;
};

export type CollectionStats = {
  setAlbumsStats: AlbumStats[];
  nonSetAlbumsStats: AlbumStats[];
};

export type ViewMode = "view" | "edit";
