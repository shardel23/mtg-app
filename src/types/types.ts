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
  image: string | undefined;
  isCollected?: boolean;
  albumId?: number;
  collectorNumber: string;
  setCode: string;
  setIconUri: string;
  rarity: string;
};

export type createAlbumFromCSVInput = {
  cardName: string;
  setCode: string;
  collectorNumber: string;
  cardId: string;
}[];
