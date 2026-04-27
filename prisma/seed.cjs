const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "test@localhost" },
    create: {
      email: "test@localhost",
      name: "Test User",
      username: "test",
      emailVerified: new Date(),
      collections: {
        create: [{ name: "Default" }],
      },
    },
    update: {
      username: "test",
      name: "Test User",
    },
  });
}

main()
  .then(() => {
    console.log("Seed OK: test user test@localhost (username: test)");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
