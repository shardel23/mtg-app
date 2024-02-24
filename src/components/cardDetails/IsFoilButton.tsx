import { setCardFoil } from "@/actions/update/setCardFoilAction";
import { useTransition } from "react";
import SparklesIcon from "../icons/SparklesIcon";
import { Button } from "../ui/button";

type IsFoilButtonProps = {
  cardId: string;
  albumId: string;
  isFoil: boolean;
  setIsFoil: React.Dispatch<React.SetStateAction<boolean>>;
  isCollected: boolean;
};

export default function IsFoilButton({
  cardId,
  albumId,
  isFoil,
  setIsFoil,
  isCollected,
}: IsFoilButtonProps) {
  const [_, startTransition] = useTransition();

  return (
    <Button
      variant={"secondary"}
      className="absolute top-4 left-4 rounded-full w-10 h-10 md:w-12 md:h-12"
      onClick={() => {
        startTransition(() => {
          setCardFoil(cardId, albumId, !isFoil);
          setIsFoil((prev) => !prev);
        });
      }}
      disabled={!isCollected}
    >
      <SparklesIcon
        className={isFoil ? "text-yellow-500 fill-yellow-500" : ""}
      />
    </Button>
  );
}
