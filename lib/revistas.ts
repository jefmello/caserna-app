/**
 * Shared server-side helpers for the Revistas feature.
 *
 * The manifest lives at /data/revistas.json and is committed to the repo.
 * In development the /upload page rewrites it on disk; in production it is
 * read-only and updated via commit+push.
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type RevistaEntry = {
  id: string;
  titulo: string;
  turno: number;
  etapa: number;
  data: string;
  arquivo: string;
  descricao?: string;
  cover?: string;
};

type RevistaManifest = { revistas: RevistaEntry[] };

const MANIFEST_PATH = path.join(process.cwd(), "data", "revistas.json");

export async function readRevistaManifest(): Promise<RevistaEntry[]> {
  try {
    const raw = await readFile(MANIFEST_PATH, "utf-8");
    const parsed = JSON.parse(raw) as RevistaManifest;
    return Array.isArray(parsed.revistas) ? parsed.revistas : [];
  } catch {
    return [];
  }
}

export async function writeRevistaManifest(revistas: RevistaEntry[]): Promise<void> {
  const payload: RevistaManifest = { revistas };
  await writeFile(MANIFEST_PATH, JSON.stringify(payload, null, 2) + "\n", "utf-8");
}

export async function findRevistaById(id: string): Promise<RevistaEntry | null> {
  const all = await readRevistaManifest();
  return all.find((r) => r.id === id) ?? null;
}

export function sortRevistas(list: RevistaEntry[]): RevistaEntry[] {
  return [...list].sort((a, b) => {
    if (a.turno !== b.turno) return a.turno - b.turno;
    return a.etapa - b.etapa;
  });
}
