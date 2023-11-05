"use client";

import { AlbumStats, CollectedMissingStats } from "@/types/types";
import { useState } from "react";

interface CollectionStatsProps {
  collectionData: AlbumStats[];
}

interface CollectionGridProps {
  collectionData: AlbumStats[];
  chosenAlbum: AlbumStats;
  setChosenAlbum: React.Dispatch<React.SetStateAction<AlbumStats>>;
}

interface CollectionDetailsProps {
  stats: AlbumStats;
}

const CollectionStats: React.FC<CollectionStatsProps> = ({
  collectionData,
}) => {
  const [chosenAlbum, setChosenAlbum] = useState<AlbumStats>(collectionData[0]);
  return (
    <div className="flex gap-x-12">
      <CollectionGrid
        collectionData={collectionData}
        chosenAlbum={chosenAlbum}
        setChosenAlbum={setChosenAlbum}
      />
      <CollectionDetails stats={chosenAlbum} />
    </div>
  );
};

const CollectionDetails: React.FC<CollectionDetailsProps> = ({ stats }) => {
  return (
    <div className="hidden md:flex flex-col gap-8 w-96">
      <div className="text-2xl text-center">{stats.name}</div>
      <div className="flex flex-col">
        {Object.entries(stats).map(([key, value]) => {
          if (key === "name" || key === "total") {
            return;
          }
          const rarityStats = value as CollectedMissingStats;
          return (
            <div
              key={stats.name + "-" + key}
              className="flex justify-center items-center gap-x-4"
            >
              <div className="text-sm">{key.charAt(0).toUpperCase()}</div>
              <div className="flex flex-col w-full justify-between">
                <div className="text-sm">
                  {rarityStats.collected}/{rarityStats.total}
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div
                      style={{
                        width: `${
                          (rarityStats.collected / rarityStats.total) * 100
                        }%`,
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {collectionData.map((album) => {
        const percentage = (album.total.collected / album.total.total) * 100;
        const isChosenAlbum = album.name === chosenAlbum.name;
        return (
          <div
            key={album.name}
            className={
              "bg-slate-500 rounded-lg shadow-md p-4 flex flex-col gap-y-2 hover:bg-slate-600 hover:cursor-pointer border-2 " +
              (isChosenAlbum ? "border-slate-200" : "")
            }
            onClick={() => {
              setChosenAlbum(album);
            }}
          >
            <h2 className="text-lg font-medium mb-2 truncate">{album.name}</h2>
            <p className="mb-2">
              Collected: {album.total.collected} / {album.total.total}
            </p>
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div
                  style={{
                    width: `${percentage}%`,
                  }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                ></div>
              </div>
            </div>
            <p className="text-sm">{percentage.toPrecision(3)}% Complete</p>
          </div>
        );
      })}
    </div>
  );
};

export default CollectionStats;
