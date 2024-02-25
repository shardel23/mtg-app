import { setCardFoil } from "@/actions/update/setCardFoilAction";
import { useTransition } from "react";
import { useCardContext } from "../CardContext";
import SparklesIcon from "../icons/SparklesIcon";
import { Button } from "../ui/button";

export default function IsFoilButton() {
  const { currentCard: card, setIsFoil } = useCardContext();
  const [_, startTransition] = useTransition();

  if (card == null || card.albumId == null) {
    return null;
  }

  return (
    <Button
      variant={"secondary"}
      className="absolute top-4 left-4 rounded-full w-10 h-10 md:w-12 md:h-12"
      onClick={() => {
        startTransition(() => {
          setCardFoil(card.id, card.albumId!, !card.isFoil);
        });
        setIsFoil(!card.isFoil);
      }}
      disabled={card.numCollected === 0}
    >
      <SparklesIcon className={card.isFoil ? "text-yellow-500" : ""} />
    </Button>
  );
}
