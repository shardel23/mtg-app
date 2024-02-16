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

interface CollectionStatsSectionProps {
  title: string;
  isSetAlbum: boolean;
  stats: AlbumStats[];
  chosenAlbum?: AlbumStats;
  setChosenAlbum?: React.Dispatch<React.SetStateAction<AlbumStats>>;
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
      <DetailedStatsSection title="Rarities" stats={stats.rarity} />
      <DetailedStatsSection title="Colors" stats={stats.colors} />
    </div>
  );
};

const DetailedStatsSection = ({
  title,
  stats,
}: {
  title: string;
  stats: any;
}) => {
  return (
    <div className="flex flex-col">
      <div className="text-center text-xl">{title}</div>
      {Object.entries(stats).map(([key, value]) => {
        const rarityStats = value as CollectedMissingStats;
        return (
          <div
            key={stats.name + "-" + key}
            className="flex items-center justify-center gap-x-4"
          >
            <div className="text-sm">
              {key === "blue" ? "U" : key.charAt(0).toUpperCase()}
            </div>
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
  );
};

const CollectionGrid: React.FC<CollectionGridProps> = ({
  collectionData,
  chosenAlbum,
  setChosenAlbum,
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-y-8 w-full items-center">
      {collectionData.setAlbumsStats.length > 0 && (
        <CollectionStatsSection
          title="Set Albums"
          isSetAlbum={true}
          stats={collectionData.setAlbumsStats}
          chosenAlbum={chosenAlbum}
          setChosenAlbum={setChosenAlbum}
        />
      )}
      {collectionData.nonSetAlbumsStats.length > 0 && (
        <CollectionStatsSection
          title="Custom Albums"
          isSetAlbum={false}
          stats={collectionData.nonSetAlbumsStats}
        />
      )}
    </div>
  );
};

const CollectionStatsSection: React.FC<CollectionStatsSectionProps> = ({
  title,
  isSetAlbum,
  stats,
  chosenAlbum,
  setChosenAlbum,
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col w-full items-center gap-y-4">
      <div className="text-xl font-bold underline">{title}</div>
      <div className="grid px-2 grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-full">
        {stats.map((album) => {
          const percentage = (album.total.collected / album.total.total) * 100;
          const isChosenAlbum = isSetAlbum && album.name === chosenAlbum?.name;
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
                } else if (isSetAlbum && setChosenAlbum) {
                  setChosenAlbum(album);
                }
              }}
            >
              <h2 className="mb-2 truncate text-lg font-bold">{album.name}</h2>
              <p className="mb-2">
                Collected: {album.total.collected} / {album.total.total}
              </p>
              {isSetAlbum && (
                <>
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
                  <div className="flex justify-between items-center">
                    <p className="text-sm">
                      {percentage === 100
                        ? percentage
                        : percentage.toPrecision(2)}
                      % Complete
                    </p>
                    <p className="text-sm">${album.value}</p>
                  </div>
                </>
              )}
              {!isSetAlbum && (
                <div className="flex justify-end items-center">
                  <p className="text-sm">${album.value}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CollectionStats;
