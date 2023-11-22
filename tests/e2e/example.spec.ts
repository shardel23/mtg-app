import { prisma } from "@/lib/prisma";
import { expect, test } from "@playwright/test";

test.afterEach(async () => {
  console.log("resetting db");
  await prisma.card.deleteMany({});
  await prisma.album.deleteMany({});
});

test("homepage", async ({ page }) => {
  await page.goto("http://localhost:3001");

  await expect(page.getByTestId("app-banner")).toBeVisible();
});

test("create album", async ({ page }) => {
  await page.goto("http://localhost:3001");

  await page.getByTestId("create-album-button").click();

  await page.getByTestId("set-selector").click();

  await page.getByTestId("set-selector-option-1").click();

  await page.getByTestId("create-album-from-set-button").click();

  await page.waitForTimeout(3000);

  await expect(page.getByTestId("album-name-div")).toBeVisible();
});
