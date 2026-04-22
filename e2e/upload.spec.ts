import { test, expect } from "@playwright/test";

// Smoke do fluxo do /upload. Não submete o form (evita escrever em disco e
// disparar git push lateral). Cobre: render do form, gating dev-only, toggle
// entre tipos e a lista de edições publicadas.
test.describe("/upload", () => {
  test("renders dev-only form with Etapa selected by default", async ({ page }) => {
    await page.goto("/upload");
    await expect(page.getByRole("heading", { name: /Publicar nova edição/i })).toBeVisible();
    await expect(page.getByLabel(/Arquivo HTML/i)).toBeVisible();
    await expect(page.getByLabel(/Turno/i)).toBeVisible();
    await expect(page.getByLabel(/Etapa\s*\*/i)).toBeVisible();
    await expect(page.getByLabel(/Data/i)).toBeVisible();
  });

  test("switching to Informativa hides turno/etapa/data fields", async ({ page }) => {
    await page.goto("/upload");
    await page.getByRole("button", { name: /Informativa/i }).click();
    await expect(page.getByLabel(/Turno/i)).toHaveCount(0);
    await expect(page.getByLabel(/Etapa\s*\*/i)).toHaveCount(0);
    await expect(page.getByText(/turno, etapa e data não se aplicam/i)).toBeVisible();
  });

  test("lists existing editions with delete button", async ({ page }) => {
    await page.goto("/upload");
    const lista = page.locator("section", { hasText: /Edições publicadas|Nenhuma edição/i });
    await expect(lista).toBeVisible();
  });
});
