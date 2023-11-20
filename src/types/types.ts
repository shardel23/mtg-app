export type CollectionData = {
  name: string;
};

export type AlbumData = {
  id: number;
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
  albumId?: number;
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
  price: string | null | undefined;
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
  id: number;
  name: string;
  total: CollectedMissingStats;
  common: CollectedMissingStats;
  uncommon: CollectedMissingStats;
  rare: CollectedMissingStats;
  mythic: CollectedMissingStats;
};
