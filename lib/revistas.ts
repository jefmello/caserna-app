/**
 * Shared server-side helpers for the Revistas feature.
 *
 * The manifest lives at /data/revistas.json and is committed to the repo.
 * In development the /upload page rewrites it on disk; in production it is
 * read-only and updated via commit+push.
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type RevistaTipo = "etapa" | "informativa";

export type RevistaEntry = {
  id: string;
  titulo: string;
  arquivo: string;
  tipo?: RevistaTipo;
  turno?: number;
  etapa?: number;
  data?: string;
  descricao?: string;
  cover?: string;
};

type RevistaManifest = { revistas: RevistaEntry[] };

const MANIFEST_PATH = path.join(process.cwd(), "data", "revistas.json");

export function getTipo(entry: RevistaEntry): RevistaTipo {
  return entry.tipo ?? "etapa";
}

export function isInformativa(entry: RevistaEntry): boolean {
  return getTipo(entry) === "informativa";
}

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

export function slugifyTitulo(t: string): string {
  const base = t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base || "informativa";
}

/**
 * Ordena: informativas primeiro (mais recentes por id desc), depois edições
 * de etapa por turno/etapa crescente. Para informativas o id costuma carregar
 * sufixo numérico; usar comparação reversa de string aproxima "mais novo".
 */
export function sortRevistas(list: RevistaEntry[]): RevistaEntry[] {
  return [...list].sort((a, b) => {
    const aInfo = isInformativa(a);
    const bInfo = isInformativa(b);
    if (aInfo && !bInfo) return -1;
    if (!aInfo && bInfo) return 1;
    if (aInfo && bInfo) return b.id.localeCompare(a.id);
    const at = a.turno ?? 0;
    const bt = b.turno ?? 0;
    if (at !== bt) return at - bt;
    return (a.etapa ?? 0) - (b.etapa ?? 0);
  });
}
