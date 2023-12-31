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

  await page.getByTestId("set-selector-option-wilds of eldraine").click();

  await page.getByTestId("create-album-from-set-button").click();

  await page.waitForTimeout(2000);

  await expect(page.getByTestId("album-name-div")).toBeVisible();

  await expect(page.getByTestId("album-collection-status-div")).toHaveText(
    "Collected: 0/266",
  );
});

test("search card", async ({ page }) => {
  await page.goto("http://localhost:3001");

  await page.getByTestId("card-search-input").fill("giant killer");
  await page.keyboard.press("Enter");

  await expect(
    page.getByTestId("search-page-display-message-div"),
  ).toBeVisible();
});
