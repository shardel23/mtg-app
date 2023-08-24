import { getAlbumCards } from "@/actions/mtgActions";
import Card from "@/components/card";

export default async function AlbumPage({
  params,
}: {
  params: { albumId: string };
}) {
  const cards = await getAlbumCards(parseInt(params.albumId));
  return (
    <div>
      <div>
        My album: {params.albumId} Cards count: {cards.size}
      </div>
      <div className="grid grid-cols-5 gap-1">
        {Array.from(cards.keys()).map((cardName) => {
          const cardVersions = cards.get(cardName)!;
          return <Card key={cardName} cardVersions={cardVersions} />;
        })}
      </div>
    </div>
  );
}
