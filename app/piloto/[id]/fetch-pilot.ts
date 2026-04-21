import { headers } from "next/headers";
import type { RankingData, RankingItem } from "@/types/ranking";

type RankingApiResponse = {
  categories?: string[];
  data?: RankingData;
};

/**
 * Resolve the absolute base URL of the current deployment. Prefers the forwarded
 * proto+host so the server-side fetch works behind Vercel proxies, SSR on localhost,
 * and preview URLs alike.
 */
async function resolveBaseUrl(): Promise<string> {
  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host");
  const proto = hdrs.get("x-forwarded-proto") ?? "https";
  if (host) return `${proto}://${host}`;
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://caserna-app.vercel.app";
}

/**
 * Fetches the most recent (highest points) entry for a pilot across all
 * categories and competitions. Returns null when the id does not resolve.
 *
 * Cached for 120s via Next's fetch-level revalidate, matching the API route.
 */
export async function fetchPilotById(id: string): Promise<RankingItem | null> {
  if (!id) return null;
  try {
    const base = await resolveBaseUrl();
    const res = await fetch(`${base}/api/ranking`, { next: { revalidate: 120 } });
    if (!res.ok) return null;
    const json = (await res.json()) as RankingApiResponse;

    let best: RankingItem | null = null;
    for (const category of Object.values(json.data ?? {})) {
      for (const competitionList of Object.values(category)) {
        for (const pilot of competitionList) {
          if (pilot.pilotoId !== id) continue;
          if (!best || pilot.pontos > best.pontos) best = pilot;
        }
      }
    }
    return best;
  } catch {
    return null;
  }
}
