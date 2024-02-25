import { CardData, ViewMode } from "@/types/types";
import { createContext, useContext, useState } from "react";

type CardContextType = {
  viewMode: ViewMode;
  isCardDeleteable?: boolean;
  isCardDialogOpen: boolean;
  currentVersion: number;
  currentCard: CardData | null;
  cardVersions: CardData[];
  hasMoreVersions: boolean;
  setIsCardDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFoil: (newValue: boolean) => void;
  changeCardVersion: () => void;
  setNumCollected: (newNumCollected: number) => void;
};

const cardContextDefaultValues: CardContextType = {
  viewMode: "view",
  isCardDeleteable: false,
  isCardDialogOpen: false,
  currentVersion: 0,
  currentCard: null,
  cardVersions: [],
  hasMoreVersions: false,
  setIsCardDialogOpen: () => {},
  setIsFoil: () => {},
  changeCardVersion: () => {},
  setNumCollected: () => {},
};

const CardContext = createContext<CardContextType>(cardContextDefaultValues);

export function useCardContext() {
  return useContext(CardContext);
}

type CardProviderProps = {
  children: React.ReactNode;
  cardVersions: CardData[];
  viewMode: ViewMode;
  isCardDeleteable?: boolean;
};

export function CardProvider({
  children,
  cardVersions,
  viewMode,
  isCardDeleteable,
}: CardProviderProps) {
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
  const [cardVersionsLocal, setCardVersionsLocal] =
    useState<CardData[]>(cardVersions);
  const [currentVersion, setCurrentVersion] = useState(() => {
    const inCollectionIndex = cardVersions.findIndex(
      (card) => card.isCollected,
    );
    return inCollectionIndex === -1 ? 0 : inCollectionIndex;
  });

  const values = {
    // getters
    viewMode,
    isCardDeleteable,
    isCardDialogOpen,
    currentVersion,
    currentCard: cardVersionsLocal[currentVersion],
    cardVersions: cardVersionsLocal,
    hasMoreVersions: cardVersionsLocal.length > 1,
    // setters
    setIsFoil: (newValue: boolean) => {
      setCardVersionsLocal((curr) => {
        const newCardVersions = [...curr];
        newCardVersions[currentVersion].isFoil = newValue;
        return newCardVersions;
      });
    },
    changeCardVersion: () => {
      setCurrentVersion((currentVersion + 1) % cardVersionsLocal.length);
    },
    setNumCollected: (newNumCollected: number) => {
      setCardVersionsLocal((curr) => {
        const newCardVersions = [...curr];
        newCardVersions[currentVersion].numCollected = newNumCollected;
        if (newNumCollected === 0) {
          newCardVersions[currentVersion].isFoil = false;
        }
        return newCardVersions;
      });
    },
    setIsCardDialogOpen,
  };

  return <CardContext.Provider value={values}>{children}</CardContext.Provider>;
}
