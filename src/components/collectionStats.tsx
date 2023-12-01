"use client";

import {
  AlbumStats,
  CollectedMissingStats,
  CollectionStats,
} from "@/types/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { isMobile } from "react-device-detect";

interface CollectionStatsProps {
  collectionData: CollectionStats;
}

interface CollectionGridProps {
  collectionData: CollectionStats;
  chosenAlbum: AlbumStats;
  setChosenAlbum: React.Dispatch<React.SetStateAction<AlbumStats>>;
}

interface CollectionDetailsProps {
  stats: AlbumStats;
}

const CollectionStats: React.FC<CollectionStatsProps> = ({
  collectionData,
}) => {
  const [chosenAlbum, setChosenAlbum] = useState<AlbumStats>(
    collectionData.setAlbumsStats[0],
  );
  return (
    <div className="flex w-full justify-center gap-x-8">
      <CollectionGrid
        collectionData={collectionData}
        chosenAlbum={chosenAlbum}
        setChosenAlbum={setChosenAlbum}
      />
      {chosenAlbum != null && <CollectionDetails stats={chosenAlbum} />}
    </div>
  );
};

const CollectionDetails: React.FC<CollectionDetailsProps> = ({ stats }) => {
  return (
    <div className="hidden w-96 flex-col gap-8 md:flex">
      <div className="text-center text-2xl">{stats.name}</div>
      <div className="flex flex-col">
        {Object.entries(stats).map(([key, value]) => {
          if (["common", "uncommon", "rare", "mythic"].indexOf(key) === -1) {
            return;
          }
          const rarityStats = value as CollectedMissingStats;
          return (
            <div
              key={stats.name + "-" + key}
              className="flex items-center justify-center gap-x-4"
            >
              <div className="text-sm">{key.charAt(0).toUpperCase()}</div>
              <div className="flex w-full flex-col justify-between">
                <div className="text-sm">
                  {rarityStats.collected}/{rarityStats.total}
                </div>
                <div className="relative pt-1">
                  <div className="mb-4 flex h-2 overflow-hidden rounded bg-gray-200 text-xs">
                    <div
                      style={{
                        width: `${
                          (rarityStats.collected / rarityStats.total) * 100
                        }%`,
                      }}
                      className="flex flex-col justify-center whitespace-nowrap bg-green-500 text-center text-white shadow-none"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CollectionGrid: React.FC<CollectionGridProps> = ({
  collectionData,
  chosenAlbum,
  setChosenAlbum,
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-y-8 w-full justify-center items-center">
      <div className="flex flex-col w-full items-center gap-y-4">
        <div className="text-xl font-bold underline">Set Albums</div>
        <div className="grid px-2 grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-full">
          {collectionData.setAlbumsStats.map((album) => {
            const percentage =
              (album.total.collected / album.total.total) * 100;
            const isChosenAlbum = album.name === chosenAlbum?.name;
            return (
              <div
                key={album.name}
                className={
                  "flex flex-col gap-y-2 rounded-lg border-2 bg-slate-500 p-4 shadow-md hover:cursor-pointer hover:bg-slate-600 " +
                  (isChosenAlbum ? "border-slate-200" : "")
                }
                onClick={() => {
                  if (isMobile) {
                    router.push(`/album/${album.id}`);
                  } else {
                    setChosenAlbum(album);
                  }
                }}
              >
                <h2 className="mb-2 truncate text-lg font-bold">
                  {album.name}
                </h2>
                <p className="mb-2">
                  Collected: {album.total.collected} / {album.total.total}
                </p>
                <div className="relative pt-1">
                  <div className="mb-4 flex h-2 overflow-hidden rounded bg-gray-200 text-xs">
                    <div
                      style={{
                        width: `${percentage}%`,
                      }}
                      className="flex flex-col justify-center whitespace-nowrap bg-green-500 text-center text-white shadow-none"
                    ></div>
                  </div>
                </div>
                <p className="text-sm">{percentage.toPrecision(3)}% Complete</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col w-full items-center gap-y-4">
        <div className="text-center text-xl font-bold underline">
          Custom Albums
        </div>
        <div className="grid w-full px-2 grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {collectionData.nonSetAlbumsStats.map((album) => {
            return (
              <div
                key={album.name}
                className={
                  "flex flex-col gap-y-2 rounded-lg border-2 bg-slate-500 p-4 shadow-md hover:cursor-pointer hover:bg-slate-600"
                }
                onClick={() => {
                  if (isMobile) {
                    router.push(`/album/${album.id}`);
                  }
                }}
              >
                <h2 className="mb-2 truncate text-lg font-bold">
                  {album.name}
                </h2>
                <p className="mb-2">Card Count: {album.total.collected}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CollectionStats;
