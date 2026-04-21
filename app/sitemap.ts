import type { MetadataRoute } from "next";

const BASE_URL = "https://caserna-app.vercel.app";

const ROUTES = [
  "",
  "/classificacao",
  "/pilotos",
  "/estatisticas",
  "/duelos",
  "/simulacoes",
  "/midia",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/classificacao" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/classificacao" ? 0.9 : 0.7,
  }));
}
