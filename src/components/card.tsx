import { CardData } from "@/actions/mtgActions";
import Image from "next/image";

function Card({ card }: { card: CardData }) {
  return (
    <div>
      <div className="truncate"> {card.name} </div>
      {card.image && (
        <Image src={card.image} alt={card.name} height={400} width={300} />
      )}
    </div>
  );
}

export default Card;
