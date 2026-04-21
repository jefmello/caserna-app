import { test, expect } from "@playwright/test";

const routes = [
  { path: "/", title: /Caserna/i },
  { path: "/classificacao", title: /Classificação/i },
  { path: "/pilotos", title: /Pilotos/i },
  { path: "/estatisticas", title: /Estatísticas/i },
  { path: "/duelos", title: /Duelos/i },
  { path: "/simulacoes", title: /Simulações/i },
  { path: "/midia", title: /Mídia/i },
];

test.describe("Routes load without errors", () => {
  for (const route of routes) {
    test(`GET ${route.path} responds 200 and renders title`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (err) => errors.push(err.message));

      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(route.title);
      expect(errors).toEqual([]);
    });
  }
});
