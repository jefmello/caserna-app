"use client";

import React, { useState } from "react";
import { Download, Share2, Check, Link2 } from "lucide-react";

type Props = {
  title: string;
  fileUrl: string;
  pageUrl: string;
};

/**
 * Download + share buttons rendered next to the revista reader header.
 * - Download: native <a download> forcing file save.
 * - Share: Web Share API when available, clipboard copy as fallback.
 */
export default function RevistaShareActions({ title, fileUrl, pageUrl }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title, url: pageUrl });
        return;
      } catch {
        // User cancelled or API failed — fall back to copy.
      }
    }
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copie o link:", pageUrl);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <a
        href={fileUrl}
        download
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[11px] font-bold tracking-[0.1em] text-white/80 uppercase transition hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
      >
        <Download className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Baixar</span>
      </a>
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-[11px] font-bold tracking-[0.1em] text-amber-300 uppercase transition hover:border-amber-400/60 hover:bg-amber-400/20"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
        <span className="hidden sm:inline">{copied ? "Copiado" : "Compartilhar"}</span>
      </button>
      <a
        href={pageUrl}
        className="hidden items-center gap-1 text-[10px] font-semibold tracking-[0.1em] text-white/40 uppercase hover:text-white/70 md:inline-flex"
        aria-label="Link desta edição"
      >
        <Link2 className="h-3 w-3" />
      </a>
    </div>
  );
}
