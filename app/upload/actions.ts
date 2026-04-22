"use server";

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { revalidatePath } from "next/cache";
import { readRevistaManifest, writeRevistaManifest, type RevistaEntry } from "@/lib/revistas";

const execAsync = promisify(exec);

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

async function publishToGit(entry: RevistaEntry): Promise<{ ok: boolean; message: string }> {
  const cwd = process.cwd();
  const commitMessage = `revista(${entry.id}): ${entry.titulo}`;
  try {
    await execAsync("git add public/revistas data/revistas.json", { cwd });
    // `git commit` exits 1 when there's nothing staged — treat that as benign.
    try {
      await execAsync(`git commit -m ${JSON.stringify(commitMessage)}`, { cwd });
    } catch (commitErr) {
      const stderr = (commitErr as { stderr?: string }).stderr ?? "";
      if (!/nothing to commit/i.test(stderr)) throw commitErr;
    }
    const pushResult = await execAsync("git push origin HEAD", { cwd });
    const combined = [pushResult.stdout, pushResult.stderr].filter(Boolean).join("\n").trim();
    return { ok: true, message: combined || "Push concluído." };
  } catch (err) {
    const stderr = (err as { stderr?: string }).stderr;
    const message = stderr || (err instanceof Error ? err.message : "Erro git desconhecido.");
    return { ok: false, message };
  }
}

function slugifyId(turno: number, etapa: number): string {
  return `t${turno}e${String(etapa).padStart(2, "0")}`;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

export async function uploadRevistaAction(formData: FormData): Promise<UploadResult> {
  if (process.env.NODE_ENV === "production") {
    return { ok: false, error: "Upload desativado em produção." };
  }

  try {
    const file = formData.get("file");
    const cover = formData.get("cover");
    const titulo = String(formData.get("titulo") ?? "").trim();
    const descricao = String(formData.get("descricao") ?? "").trim();
    const turnoRaw = String(formData.get("turno") ?? "").trim();
    const etapaRaw = String(formData.get("etapa") ?? "").trim();
    const data = String(formData.get("data") ?? "").trim();

    if (!(file instanceof File)) return { ok: false, error: "Arquivo HTML ausente." };
    if (!file.name.toLowerCase().endsWith(".html")) {
      return { ok: false, error: "O arquivo precisa ter extensão .html." };
    }
    if (!titulo) return { ok: false, error: "Informe um título." };
    if (!data) return { ok: false, error: "Informe a data (YYYY-MM-DD)." };

    const turno = Number.parseInt(turnoRaw, 10);
    const etapa = Number.parseInt(etapaRaw, 10);
    if (!Number.isFinite(turno) || turno <= 0) return { ok: false, error: "Turno inválido." };
    if (!Number.isFinite(etapa) || etapa <= 0) return { ok: false, error: "Etapa inválida." };

    const id = slugifyId(turno, etapa);
    await mkdir(REVISTAS_DIR, { recursive: true });
    const filename = sanitizeFilename(file.name);
    const targetFile = path.join(REVISTAS_DIR, filename);
    const buf = Buffer.from(await file.arrayBuffer());
    await writeFile(targetFile, buf);

    let coverRelative: string | undefined;
    if (cover instanceof File && cover.size > 0) {
      await mkdir(COVERS_DIR, { recursive: true });
      const ext = path.extname(cover.name).toLowerCase() || ".png";
      const coverName = `${id}${ext}`;
      const coverPath = path.join(COVERS_DIR, coverName);
      const coverBuf = Buffer.from(await cover.arrayBuffer());
      await writeFile(coverPath, coverBuf);
      coverRelative = `/revistas/covers/${coverName}`;
    }

    const existing = await readRevistaManifest();
    const filtered = existing.filter((r) => r.id !== id);
    const entry: RevistaEntry = {
      id,
      titulo,
      turno,
      etapa,
      data,
      arquivo: filename,
      descricao: descricao || undefined,
      cover: coverRelative ?? existing.find((r) => r.id === id)?.cover,
    };
    const next = [...filtered, entry];
    await writeRevistaManifest(next);

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
