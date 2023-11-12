// @ts-nocheck

import { prisma } from "../../src/lib/prisma";

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

numCollectedMigration().then(() => {
  console.log("numCollectedMigration complete");
});
