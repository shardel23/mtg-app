import { AlbumStats } from "@/types/types";

interface CollectionStatsProps {
  collectionData: AlbumStats[];
}

const CollectionStats: React.FC<CollectionStatsProps> = ({
  collectionData,
}) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {collectionData.map((album) => {
        const percentage = (album.total.collected / album.total.total) * 100;
        return (
          <div
            key={album.name}
            className="bg-slate-500 rounded-lg shadow-md p-4"
          >
            <h2 className="text-lg font-medium mb-2">{album.name}</h2>
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
