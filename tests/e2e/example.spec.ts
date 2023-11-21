import { expect, test } from "@playwright/test";

test("homepage", async ({ page }) => {
  await page.goto("http://localhost:3001");

  await expect(page.getByTestId("app-banner")).toBeVisible();
});
