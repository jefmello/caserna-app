"use client";

import * as htmlToImage from "html-to-image";

type ShareWhatsAppParams = {
  dataUrl: string;
  fileName: string;
  text: string;
};

type ShareNativeParams = {
  dataUrl: string;
  fileName: string;
  title?: string;
  text?: string;
};

type ShareNativeResult = "shared" | "downloaded" | "cancelled" | "error";

type UseRankingShareParams = {
  isDarkMode: boolean;
};

export default function useRankingShare({ isDarkMode }: UseRankingShareParams) {
  async function generateImage(ref: HTMLElement | null) {
    if (!ref) return null;

    return htmlToImage.toPng(ref, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: isDarkMode ? "#0b1220" : "#f4f4f5",
    });
  }

  function download(dataUrl: string, fileName: string) {
    const link = document.createElement("a");
    link.download = fileName;
    link.href = dataUrl;
    link.click();
  }

  async function shareDataUrlToWhatsApp({ dataUrl, fileName, text }: ShareWhatsAppParams) {
    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: "image/png" });
      const navigatorWithShare = navigator as Navigator & {
        canShare?: (data: ShareData) => boolean;
      };

      if (
        typeof navigator !== "undefined" &&
        navigator.share &&
        navigatorWithShare.canShare?.({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: "Caserna Kart Racing",
          text,
        });
        return;
      }

      download(dataUrl, fileName);

      window.open(
        `https://wa.me/?text=${encodeURIComponent(text)}`,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (err) {
      console.error(err);
      window.alert("Não foi possível compartilhar no WhatsApp.");
    }
  }

  /**
   * Native Web Share for image files. Opens OS share sheet (WhatsApp, Instagram,
   * Telegram, AirDrop, etc.) when supported. Falls back to download otherwise.
   * Prefer this over shareDataUrlToWhatsApp for general-purpose sharing.
   */
  async function share({
    dataUrl,
    fileName,
    title,
    text,
  }: ShareNativeParams): Promise<ShareNativeResult> {
    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: blob.type || "image/png" });

      const canShareFiles =
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] });

      if (canShareFiles) {
        try {
          await navigator.share({ title, text, files: [file] });
          return "shared";
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") return "cancelled";
          // fall through to download
        }
      }

      download(dataUrl, fileName);
      return "downloaded";
    } catch (err) {
      console.error(err);
      return "error";
    }
  }

  return {
    generateImage,
    download,
    share,
    shareDataUrlToWhatsApp,
  };
}
