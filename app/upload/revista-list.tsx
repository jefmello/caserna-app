"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Trash2, Loader2, AlertTriangle, CheckCircle2, X } from "lucide-react";
import type { RevistaEntry } from "@/lib/revistas";
import { deleteRevistaAction, type DeleteResult } from "./actions";

const isInformativa = (e: RevistaEntry) => (e.tipo ?? "etapa") === "informativa";

type Feedback = { id: string; result: DeleteResult };

export default function RevistaList({ revistas }: { revistas: RevistaEntry[] }) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [autoPush, setAutoPush] = useState(true);
  const [confirmTarget, setConfirmTarget] = useState<RevistaEntry | null>(null);

  const runDelete = (entry: RevistaEntry) => {
    const fd = new FormData();
    fd.set("id", entry.id);
    if (autoPush) fd.set("autoPush", "on");

    setPendingId(entry.id);
    setFeedback(null);
    setConfirmTarget(null);
    startTransition(async () => {
      const result = await deleteRevistaAction(fd);
      setPendingId(null);
      setFeedback({ id: entry.id, result });
    });
  };

  if (revistas.length === 0) {
    return (
      <section className="mt-6 rounded-[22px] border border-white/10 bg-white/[0.03] p-5 text-white/60">
        <p className="text-[13px]">Nenhuma edição publicada ainda.</p>
      </section>
    );
  }

  return (
    <section className="mt-6 flex flex-col gap-3 rounded-[22px] border border-white/10 bg-white/[0.03] p-5 text-white md:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-[16px] font-bold tracking-tight">Edições publicadas</h2>
          <p className="text-[11px] text-white/55">
            Exclusão remove arquivo + capa + entrada do manifest. Use com cuidado.
          </p>
        </div>
        <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
          <input
            type="checkbox"
            checked={autoPush}
            onChange={(e) => setAutoPush(e.target.checked)}
            className="h-4 w-4 accent-amber-400"
          />
          <span className="text-[11px] font-semibold text-white/85">
            Commit + push após excluir
          </span>
        </label>
      </header>

      <ul className="flex flex-col gap-2">
        {revistas.map((entry) => {
          const isThisPending = pendingId === entry.id && isPending;
          const isThisFeedback = feedback?.id === entry.id ? feedback.result : null;
          return (
            <li
              key={entry.id}
              className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="truncate text-[13px] font-semibold text-white">{entry.titulo}</p>
                  <p className="text-[10px] tracking-[0.18em] text-white/45 uppercase">
                    <code className="text-amber-300">{entry.id}</code>
                    {isInformativa(entry) ? (
                      <> · Informativa{entry.data ? ` · ${entry.data}` : ""}</>
                    ) : (
                      <>
                        {" · "}T{entry.turno ?? "—"} E
                        {entry.etapa !== undefined ? String(entry.etapa).padStart(2, "0") : "—"}
                        {entry.data ? ` · ${entry.data}` : ""}
                      </>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/revistas/${entry.id}`}
                    target="_blank"
                    className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-semibold tracking-[0.1em] text-white/70 uppercase hover:border-white/40 hover:text-white"
                  >
                    Abrir
                  </Link>
                  <button
                    type="button"
                    onClick={() => setConfirmTarget(entry)}
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-400/40 bg-red-400/10 px-3 py-1.5 text-[11px] font-bold tracking-[0.1em] text-red-200 uppercase transition hover:border-red-400/70 hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isThisPending ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" /> Excluindo…
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-3 w-3" /> Excluir
                      </>
                    )}
                  </button>
                </div>
              </div>

              {isThisFeedback ? (
                <div
                  role="status"
                  className={`flex items-start gap-2 rounded-lg border p-2 text-[11px] ${
                    isThisFeedback.ok
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                      : "border-red-400/30 bg-red-400/10 text-red-200"
                  }`}
                >
                  {isThisFeedback.ok ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      <div className="flex flex-col gap-1">
                        <p>
                          Edição <code>{isThisFeedback.id}</code> removida.
                          {isThisFeedback.published ? " Push enviado ao repositório." : ""}
                        </p>
                        {isThisFeedback.gitMessage ? (
                          <pre className="mt-1 max-h-32 overflow-auto rounded-md bg-black/30 p-2 text-[10px] leading-snug whitespace-pre-wrap text-white/65">
                            {isThisFeedback.gitMessage}
                          </pre>
                        ) : null}
                        {isThisFeedback.gitError ? (
                          <div className="text-red-300/90">
                            <p className="font-semibold">
                              Arquivos removidos, mas o push automático falhou. Rode manualmente.
                            </p>
                            <pre className="mt-1 max-h-32 overflow-auto rounded-md bg-black/30 p-2 text-[10px] leading-snug whitespace-pre-wrap">
                              {isThisFeedback.gitError}
                            </pre>
                          </div>
                        ) : null}
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      <p>{isThisFeedback.error}</p>
                    </>
                  )}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      {confirmTarget ? (
        <ConfirmDeleteModal
          entry={confirmTarget}
          autoPush={autoPush}
          onCancel={() => setConfirmTarget(null)}
          onConfirm={() => runDelete(confirmTarget)}
        />
      ) : null}
    </section>
  );
}

function ConfirmDeleteModal({
  entry,
  autoPush,
  onCancel,
  onConfirm,
}: {
  entry: RevistaEntry;
  autoPush: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const [typed, setTyped] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const matches = typed.trim().toLowerCase() === entry.titulo.trim().toLowerCase();

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="relative flex w-full max-w-md flex-col gap-4 rounded-[20px] border border-red-400/30 bg-[#0a0f1c] p-5 text-white shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onCancel}
          aria-label="Fechar"
          className="absolute top-3 right-3 rounded-full p-1 text-white/55 hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col gap-1.5 pr-6">
          <p className="text-[10px] font-bold tracking-[0.24em] text-red-300 uppercase">
            Ação destrutiva
          </p>
          <h3 id="confirm-delete-title" className="text-[17px] font-black tracking-tight">
            Excluir esta edição?
          </h3>
          <p className="text-[12px] leading-relaxed text-white/65">
            Vai apagar arquivo HTML, capa e a entrada do manifest.
            {autoPush ? " Em seguida roda commit + push." : " O push fica por sua conta."}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <p className="text-[11px] text-white/55">Título da edição:</p>
          <p className="mt-0.5 text-[13px] font-semibold text-white">{entry.titulo}</p>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold tracking-[0.18em] text-white/55 uppercase">
            Para confirmar, digite o título acima
          </span>
          <input
            ref={inputRef}
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder={entry.titulo}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[13px] text-white placeholder:text-white/30 focus:border-red-400/50 focus:outline-none"
          />
        </label>

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-white/15 px-4 py-2 text-[12px] font-bold tracking-[0.1em] text-white/70 uppercase hover:border-white/40 hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!matches}
            className="inline-flex items-center gap-1.5 rounded-full border border-red-400/50 bg-red-400/15 px-4 py-2 text-[12px] font-bold tracking-[0.1em] text-red-200 uppercase transition hover:border-red-400/80 hover:bg-red-400/25 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 className="h-3 w-3" />
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
