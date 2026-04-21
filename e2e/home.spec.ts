import { test, expect } from "@playwright/test";

test.describe("Home", () => {
  test("loads with title and main header", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Caserna Kart Racing/i);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  });
});
