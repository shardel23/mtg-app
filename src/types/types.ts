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

export type NullishNumber = number | null;

export type CardStats17Lands = {
  seen_count: NullishNumber;
  avg_seen: NullishNumber;
  pick_count: NullishNumber;
  avg_pick: NullishNumber;
  game_count: NullishNumber;
  pool_count: NullishNumber;
  play_rate: NullishNumber;
  win_rate: NullishNumber;
  opening_hand_game_count: NullishNumber;
  opening_hand_win_rate: NullishNumber;
  drawn_game_count: NullishNumber;
  drawn_win_rate: NullishNumber;
  ever_drawn_game_count: NullishNumber;
  ever_drawn_win_rate: NullishNumber;
  never_drawn_game_count: NullishNumber;
  never_drawn_win_rate: NullishNumber;
  drawn_improvement_win_rate: NullishNumber;
  name: string;
  mtga_id: NullishNumber;
  color: string;
  rarity: string;
  url: string;
  url_back: string;
  types: string[];
};

export type CardStats17LandsResponse = {
  seen_count: NullishNumber;
  avg_seen: NullishNumber;
  avg_pick: NullishNumber;
  game_count: NullishNumber;
  play_rate: NullishNumber;
  ever_drawn_win_rate: NullishNumber;
};
