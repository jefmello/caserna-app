"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { Upload, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { uploadRevistaAction, type UploadResult } from "./actions";

export default function RevistaUploadForm() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<UploadResult | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    startTransition(async () => {
      const res = await uploadRevistaAction(fd);
      setResult(res);
      if (res.ok) form.reset();
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-[22px] border border-white/10 bg-white/[0.03] p-5 text-white md:p-6"
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field label="Arquivo HTML *" id="file">
          <input
            id="file"
            name="file"
            type="file"
            accept="text/html,.html"
            required
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[13px] text-white file:mr-3 file:rounded-md file:border-0 file:bg-amber-400/15 file:px-3 file:py-1 file:text-[11px] file:font-bold file:tracking-[0.1em] file:text-amber-300 file:uppercase"
          />
        </Field>
        <Field label="Capa (opcional)" id="cover">
          <input
            id="cover"
            name="cover"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[13px] text-white file:mr-3 file:rounded-md file:border-0 file:bg-white/[0.06] file:px-3 file:py-1 file:text-[11px] file:font-bold file:tracking-[0.1em] file:text-white/80 file:uppercase"
          />
        </Field>
      </div>

      <Field label="Título *" id="titulo">
        <input
          id="titulo"
          name="titulo"
          type="text"
          required
          placeholder="Ex: Edição Nº01 — Abertura do campeonato"
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[13px] text-white placeholder:text-white/35"
        />
      </Field>

      <Field label="Descrição" id="descricao">
        <textarea
          id="descricao"
          name="descricao"
          rows={2}
          placeholder="Resumo curto que aparece no card e nos metadados OG."
          className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[13px] text-white placeholder:text-white/35"
        />
      </Field>

      <div className="grid grid-cols-3 gap-3">
        <Field label="Turno *" id="turno">
          <input
            id="turno"
            name="turno"
            type="number"
            min={1}
            required
            defaultValue={1}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[13px] text-white tabular-nums"
          />
        </Field>
        <Field label="Etapa *" id="etapa">
          <input
            id="etapa"
            name="etapa"
            type="number"
            min={1}
            required
            defaultValue={1}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[13px] text-white tabular-nums"
          />
        </Field>
        <Field label="Data *" id="data">
          <input
            id="data"
            name="data"
            type="date"
            required
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[13px] text-white"
          />
        </Field>
      </div>

      <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
        <input
          type="checkbox"
          name="autoPush"
          defaultChecked
          className="h-4 w-4 accent-amber-400"
        />
        <span className="flex flex-col">
          <span className="text-[12px] font-semibold text-white">
            Publicar no deploy automaticamente
          </span>
          <span className="text-[10px] text-white/50">
            Roda <code>git add</code> + <code>commit</code> + <code>push</code> após salvar.
            Desmarque se quiser revisar o diff antes.
          </span>
        </span>
      </label>

      <div className="flex items-center justify-between gap-3 pt-1">
        <p className="text-[11px] text-white/45">
          O ID é gerado como{" "}
          <code className="text-amber-300">
            t{"{"}turno{"}"}e{"{"}etapa{"}"}
          </code>
          . Re-upload com o mesmo ID substitui a edição existente.
        </p>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/15 px-4 py-2 text-[12px] font-bold tracking-[0.1em] text-amber-300 uppercase transition hover:border-amber-400/70 hover:bg-amber-400/25 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Enviando…
            </>
          ) : (
            <>
              <Upload className="h-3.5 w-3.5" /> Publicar edição
            </>
          )}
        </button>
      </div>

      {result ? (
        <div
          role="status"
          className={`flex items-start gap-2 rounded-xl border p-3 text-[12px] ${
            result.ok
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
              : "border-red-400/30 bg-red-400/10 text-red-200"
          }`}
        >
          {result.ok ? (
            <>
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <div className="flex flex-col gap-1">
                <p>
                  Edição publicada como <code>{result.id}</code>.{" "}
                  <Link href={`/revistas/${result.id}`} className="underline hover:text-white">
                    Abrir leitor
                  </Link>
                  .
                </p>
                {result.published ? (
                  <p className="text-emerald-300/85">
                    Deploy em andamento — push enviado ao repositório.
                  </p>
                ) : null}
                {result.gitMessage ? (
                  <pre className="mt-1 max-h-32 overflow-auto rounded-md bg-black/30 p-2 text-[10px] leading-snug whitespace-pre-wrap text-white/65">
                    {result.gitMessage}
                  </pre>
                ) : null}
                {result.gitError ? (
                  <div className="text-red-300/90">
                    <p className="font-semibold">
                      Arquivo salvo, mas o push automático falhou. Rode manualmente.
                    </p>
                    <pre className="mt-1 max-h-32 overflow-auto rounded-md bg-black/30 p-2 text-[10px] leading-snug whitespace-pre-wrap">
                      {result.gitError}
                    </pre>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <>
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <p>{result.error}</p>
            </>
          )}
        </div>
      ) : null}
    </form>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold tracking-[0.2em] text-white/55 uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}
