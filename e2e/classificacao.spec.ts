import { test, expect } from "@playwright/test";

test.describe("Classificação", () => {
  test("renders table after data loads", async ({ page }) => {
    await page.goto("/classificacao");

    await expect(page).toHaveTitle(/Classificação/i);
    await expect(page.getByText(/Classificação Geral/i).first()).toBeVisible({ timeout: 30_000 });
  });

  test("pilot row click navigates to /pilotos", async ({ page }) => {
    await page.goto("/classificacao");
    await expect(page.getByText(/Classificação Geral/i).first()).toBeVisible({ timeout: 30_000 });

    const firstPilotRow = page.locator("table tbody tr").first();
    await firstPilotRow.click();
    await expect(page).toHaveURL(/\/pilotos/);
  });
});
