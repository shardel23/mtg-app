import { prisma } from "./prisma";

export const getCardsFromAlbum = async (
  userId: string,
  collection: string,
  albumId: number,
) => {
  return await prisma.album.findUnique({
    where: {
      id: albumId,
      collection: {
        name: {
          equals: collection,
        },
        userId: userId,
      },
    },
    select: {
      name: true,
      cards: {
        select: {
          id: true,
          numCollected: true,
          albumId: true,
          CardDetails: {
            select: {
              name: true,
              collectorNumber: true,
              normalImageURI: true,
              set: true,
              setIconSvgUri: true,
              rarity: true,
              colors: true,
              mana_cost: true,
              cmc: true,
              layout: true,
              type_line: true,
              card_faces: {
                select: {
                  name: true,
                  faceNumber: true,
                  normalImageURI: true,
                  colors: true,
                  mana_cost: true,
                  type_line: true,
                },
                orderBy: {
                  faceNumber: "asc",
                },
              },
            },
          },
        },
        orderBy: {
          CardDetails: {
            collectorNumber: "asc",
          },
        },
      },
    },
  });
};

export const searchCardsInCollection = async (
  userId: string,
  collection: string,
  cardName: string,
) => {
  return await prisma.card.findMany({
    where: {
      CardDetails: {
        name: {
          contains: cardName,
          mode: "insensitive",
        },
      },
      Album: {
        collection: {
          name: {
            equals: collection,
          },
          userId: userId,
        },
      },
    },
    select: {
      id: true,
      numCollected: true,
      albumId: true,
      CardDetails: {
        select: {
          name: true,
          collectorNumber: true,
          normalImageURI: true,
          set: true,
          setIconSvgUri: true,
          rarity: true,
          colors: true,
          mana_cost: true,
          cmc: true,
          layout: true,
          type_line: true,
          card_faces: {
            select: {
              name: true,
              faceNumber: true,
              normalImageURI: true,
              colors: true,
              mana_cost: true,
              type_line: true,
            },
            orderBy: {
              faceNumber: "asc",
            },
          },
        },
      },
    },
  });
};

export const getCardsAvailableForTrade = (
  userId: string,
  collection: string,
) => {
  return prisma.card.findMany({
    where: {
      numCollected: {
        gt: 1,
      },
      Album: {
        collection: {
          name: {
            equals: collection,
          },
          userId: userId,
        },
      },
    },
    select: {
      id: true,
      numCollected: true,
      albumId: true,
      CardDetails: {
        select: {
          name: true,
          collectorNumber: true,
          normalImageURI: true,
          set: true,
          setIconSvgUri: true,
          rarity: true,
          colors: true,
          mana_cost: true,
          cmc: true,
          layout: true,
          type_line: true,
          card_faces: {
            select: {
              name: true,
              faceNumber: true,
              normalImageURI: true,
              colors: true,
              mana_cost: true,
              type_line: true,
            },
            orderBy: {
              faceNumber: "asc",
            },
          },
        },
      },
    },
  });
};
