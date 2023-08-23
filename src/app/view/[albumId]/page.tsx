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
        My album: {params.albumId} Cards count: {cards.length}
      </div>
      <div className="grid grid-cols-5 gap-1">
        {cards.map((card) => (
          <Card key={card.name} card={card} />
        ))}
      </div>
    </div>
  );
}
