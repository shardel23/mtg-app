import { prisma } from "@/lib/prisma";

export const numCollectedMigration = async () => {
  await prisma.card.updateMany({
    where: {
      isCollected: true,
    },
    data: {
      numCollected: 1,
    },
  });
};
