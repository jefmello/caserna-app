"use server";

import { writeFile, mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { revalidatePath } from "next/cache";
import {
  readRevistaManifest,
  slugifyTitulo,
  writeRevistaManifest,
  type RevistaEntry,
  type RevistaTipo,
} from "@/lib/revistas";

const execAsync = promisify(exec);

// Limite duro pra cada comando git: se push travar pedindo credencial ou
// dois-factor, a action não fica pendurada e o botão na UI consegue mostrar
// erro em vez de "Excluindo…" infinito.
const GIT_TIMEOUT_MS = 30_000;
const GIT_ENV = {
  ...process.env,
  GIT_TERMINAL_PROMPT: "0",
  GIT_ASKPASS: "echo",
};

/**
 * Dev-only server action: accepts the HTML file + metadata, writes it to
 * /public/revistas, optionally saves a cover image, and appends an entry
 * to /data/revistas.json. Refuses to run in production so the endpoint
 * can't be hit on deployed environments.
 */

const REVISTAS_DIR = path.join(process.cwd(), "public", "revistas");
const COVERS_DIR = path.join(REVISTAS_DIR, "covers");

export type UploadResult =
  | { ok: true; id: string; published: boolean; gitMessage?: string; gitError?: string }
  | { ok: false; error: string };

export type DeleteResult =
  | { ok: true; id: string; published: boolean; gitMessage?: string; gitError?: string }
  | { ok: false; error: string };

async function publishToGit(entry: RevistaEntry): Promise<{ ok: boolean; message: string }> {
  const cwd = process.cwd();
  const commitMessage = `revista(${entry.id}): ${entry.titulo}`;
  try {
    await execAsync("git add public/revistas data/revistas.json", {
      cwd,
      timeout: GIT_TIMEOUT_MS,
      env: GIT_ENV,
    });
    // `git commit` exits 1 when there's nothing staged — treat that as benign.
    try {
      await execAsync(`git commit -m ${JSON.stringify(commitMessage)}`, {
        cwd,
        timeout: GIT_TIMEOUT_MS,
        env: GIT_ENV,
      });
    } catch (commitErr) {
      const stderr = (commitErr as { stderr?: string }).stderr ?? "";
      if (!/nothing to commit/i.test(stderr)) throw commitErr;
    }
    const pushResult = await execAsync("git push origin HEAD", {
      cwd,
      timeout: GIT_TIMEOUT_MS,
      env: GIT_ENV,
    });
    const combined = [pushResult.stdout, pushResult.stderr].filter(Boolean).join("\n").trim();
    return { ok: true, message: combined || "Push concluído." };
  } catch (err) {
    const stderr = (err as { stderr?: string }).stderr;
    const message = stderr || (err instanceof Error ? err.message : "Erro git desconhecido.");
    return { ok: false, message };
  }
}

async function commitDeletionToGit(entry: RevistaEntry): Promise<{ ok: boolean; message: string }> {
  const cwd = process.cwd();
  const commitMessage = `revista(${entry.id}): remove ${entry.titulo}`;
  try {
    await execAsync("git add public/revistas data/revistas.json", {
      cwd,
      timeout: GIT_TIMEOUT_MS,
      env: GIT_ENV,
    });
    try {
      await execAsync(`git commit -m ${JSON.stringify(commitMessage)}`, {
        cwd,
        timeout: GIT_TIMEOUT_MS,
        env: GIT_ENV,
      });
    } catch (commitErr) {
      const stderr = (commitErr as { stderr?: string }).stderr ?? "";
      if (!/nothing to commit/i.test(stderr)) throw commitErr;
    }
    const pushResult = await execAsync("git push origin HEAD", {
      cwd,
      timeout: GIT_TIMEOUT_MS,
      env: GIT_ENV,
    });
    const combined = [pushResult.stdout, pushResult.stderr].filter(Boolean).join("\n").trim();
    return { ok: true, message: combined || "Push concluído." };
  } catch (err) {
    const stderr = (err as { stderr?: string }).stderr;
    const message = stderr || (err instanceof Error ? err.message : "Erro git desconhecido.");
    return { ok: false, message };
  }
}

async function safeUnlink(absPath: string): Promise<void> {
  try {
    await unlink(absPath);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
  }
}

function slugifyId(turno: number, etapa: number): string {
  return `t${turno}e${String(etapa).padStart(2, "0")}`;
}

function uniqueInformativaId(titulo: string, existing: RevistaEntry[]): string {
  const base = `info-${slugifyTitulo(titulo)}`;
  const taken = new Set(existing.map((e) => e.id));
  if (!taken.has(base)) return base;
  for (let n = 2; n < 9999; n++) {
    const candidate = `${base}-${n}`;
    if (!taken.has(candidate)) return candidate;
  }
  return `${base}-${Date.now()}`;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

const MAX_HTML_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_COVER_BYTES = 4 * 1024 * 1024; // 4 MB

function extractOgImage(buf: Buffer): string | undefined {
  // Olha apenas os primeiros 64 KB do HTML — meta tags moram no <head>, não
  // precisamos parsear a edição inteira. Aceita só URLs http/https; data:URIs
  // ou caminhos relativos exigiriam baixar/copiar e não vale a pena automático.
  const head = buf.slice(0, 64 * 1024).toString("utf-8");
  const re = /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i;
  const match = head.match(re);
  if (!match) return undefined;
  const url = match[1].trim();
  if (!/^https?:\/\//i.test(url)) return undefined;
  return url;
}

function validateHtml(buf: Buffer): string | null {
  if (buf.byteLength === 0) return "Arquivo HTML vazio.";
  if (buf.byteLength > MAX_HTML_BYTES) {
    return `Arquivo HTML maior que o limite (${Math.round(MAX_HTML_BYTES / 1024 / 1024)} MB).`;
  }
  // Olha apenas os primeiros 8 KB — suficiente pra pegar doctype/html/charset
  // sem virar UTF-8 decode do arquivo inteiro.
  const head = buf
    .slice(0, 8 * 1024)
    .toString("utf-8")
    .toLowerCase();
  if (!/<html[\s>]/i.test(head) && !/<!doctype\s+html/i.test(head)) {
    return "Arquivo não parece ser HTML (falta <!doctype html> ou <html>).";
  }
  return null;
}

function uploadEnabled(): boolean {
  const flag = process.env.CASERNA_UPLOAD_ENABLED;
  if (flag === "1" || flag === "true") return true;
  if (flag === "0" || flag === "false") return false;
  return process.env.NODE_ENV !== "production";
}

export async function uploadRevistaAction(formData: FormData): Promise<UploadResult> {
  if (!uploadEnabled()) {
    return { ok: false, error: "Upload desativado neste ambiente." };
  }

  try {
    const file = formData.get("file");
    const cover = formData.get("cover");
    const titulo = String(formData.get("titulo") ?? "").trim();
    const descricao = String(formData.get("descricao") ?? "").trim();
    const tipoRaw = String(formData.get("tipo") ?? "etapa").trim();
    const tipo: RevistaTipo = tipoRaw === "informativa" ? "informativa" : "etapa";
    const turnoRaw = String(formData.get("turno") ?? "").trim();
    const etapaRaw = String(formData.get("etapa") ?? "").trim();
    const data = String(formData.get("data") ?? "").trim();

    if (!(file instanceof File)) return { ok: false, error: "Arquivo HTML ausente." };
    if (!file.name.toLowerCase().endsWith(".html")) {
      return { ok: false, error: "O arquivo precisa ter extensão .html." };
    }
    if (!titulo) return { ok: false, error: "Informe um título." };

    const existing = await readRevistaManifest();

    let id: string;
    let turno: number | undefined;
    let etapa: number | undefined;
    let dataFinal: string | undefined;

    if (tipo === "etapa") {
      if (!data) return { ok: false, error: "Informe a data (YYYY-MM-DD)." };
      const t = Number.parseInt(turnoRaw, 10);
      const e = Number.parseInt(etapaRaw, 10);
      if (!Number.isFinite(t) || t <= 0) return { ok: false, error: "Turno inválido." };
      if (!Number.isFinite(e) || e <= 0) return { ok: false, error: "Etapa inválida." };
      turno = t;
      etapa = e;
      dataFinal = data;
      id = slugifyId(t, e);
    } else {
      const previous = existing.find(
        (r) => (r.tipo ?? "etapa") === "informativa" && r.titulo === titulo
      );
      id = previous?.id ?? uniqueInformativaId(titulo, existing);
      dataFinal = data || undefined;
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const htmlError = validateHtml(buf);
    if (htmlError) return { ok: false, error: htmlError };

    if (cover instanceof File && cover.size > MAX_COVER_BYTES) {
      return {
        ok: false,
        error: `Capa maior que o limite (${Math.round(MAX_COVER_BYTES / 1024 / 1024)} MB).`,
      };
    }

    // Rastreia arquivos escritos pra desfazer em caso de falha tardia.
    const writtenPaths: string[] = [];
    let entry!: RevistaEntry;
    try {
      await mkdir(REVISTAS_DIR, { recursive: true });
      const filename = sanitizeFilename(file.name);
      const targetFile = path.join(REVISTAS_DIR, filename);
      await writeFile(targetFile, buf);
      writtenPaths.push(targetFile);

      let coverRelative: string | undefined;
      if (cover instanceof File && cover.size > 0) {
        await mkdir(COVERS_DIR, { recursive: true });
        const ext = path.extname(cover.name).toLowerCase() || ".png";
        const coverName = `${id}${ext}`;
        const coverPath = path.join(COVERS_DIR, coverName);
        const coverBuf = Buffer.from(await cover.arrayBuffer());
        await writeFile(coverPath, coverBuf);
        writtenPaths.push(coverPath);
        coverRelative = `/revistas/covers/${coverName}`;
      } else {
        // Sem capa explícita: tenta usar og:image do próprio HTML como fallback.
        // Mantém URL externa direto na entry.cover — o card aceita absoluto.
        const fallback = extractOgImage(buf);
        if (fallback) coverRelative = fallback;
      }

      const filtered = existing.filter((r) => r.id !== id);
      entry = {
        id,
        titulo,
        tipo,
        arquivo: filename,
        descricao: descricao || undefined,
        cover: coverRelative ?? existing.find((r) => r.id === id)?.cover,
        ...(turno !== undefined ? { turno } : {}),
        ...(etapa !== undefined ? { etapa } : {}),
        ...(dataFinal ? { data: dataFinal } : {}),
      };
      const next = [...filtered, entry];
      await writeRevistaManifest(next);
    } catch (writeErr) {
      // Desfaz arquivos criados pra não deixar órfão em public/revistas.
      await Promise.all(writtenPaths.map((p) => safeUnlink(p)));
      throw writeErr;
    }

    revalidatePath("/revistas");
    revalidatePath(`/revistas/${id}`);

    const autoPush = String(formData.get("autoPush") ?? "") === "on";
    let result: UploadResult;
    if (!autoPush) {
      result = { ok: true, id, published: false };
    } else {
      const git = await publishToGit(entry);
      result = git.ok
        ? { ok: true, id, published: true, gitMessage: git.message }
        : { ok: true, id, published: false, gitError: git.message };
    }

    // Signal file for the caserna-upload.bat wrapper on the user's desktop:
    // the bat script polls for this sentinel and, once it appears, kills the
    // dev server and exits. We only create it once everything succeeded
    // (file saved + optional push) so a failed push keeps the server alive.
    try {
      await writeFile(
        path.join(process.cwd(), ".upload-done"),
        JSON.stringify({ id, at: new Date().toISOString(), published: result.published ?? false }),
        "utf-8"
      );
    } catch {
      // Not critical — just means the bat helper won't auto-close.
    }

    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Falha inesperada no upload.";
    return { ok: false, error: message };
  }
}

export async function deleteRevistaAction(formData: FormData): Promise<DeleteResult> {
  if (!uploadEnabled()) {
    return { ok: false, error: "Exclusão desativada neste ambiente." };
  }

  try {
    const id = String(formData.get("id") ?? "").trim();
    if (!id) return { ok: false, error: "ID ausente." };

    const existing = await readRevistaManifest();
    const entry = existing.find((r) => r.id === id);
    if (!entry) return { ok: false, error: `Edição "${id}" não encontrada.` };

    const fileAbs = path.join(REVISTAS_DIR, entry.arquivo);
    await safeUnlink(fileAbs);

    if (entry.cover && entry.cover.startsWith("/revistas/")) {
      const coverAbs = path.join(process.cwd(), "public", entry.cover.replace(/^\/+/, ""));
      await safeUnlink(coverAbs);
    }

    const next = existing.filter((r) => r.id !== id);
    await writeRevistaManifest(next);

    revalidatePath("/revistas");
    revalidatePath(`/revistas/${id}`);
    revalidatePath("/upload");

    const autoPush = String(formData.get("autoPush") ?? "") === "on";
    if (!autoPush) {
      return { ok: true, id, published: false };
    }
    const git = await commitDeletionToGit(entry);
    return git.ok
      ? { ok: true, id, published: true, gitMessage: git.message }
      : { ok: true, id, published: false, gitError: git.message };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Falha inesperada na exclusão.";
    return { ok: false, error: message };
  }
}
