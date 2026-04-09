"use client";

import * as htmlToImage from "html-to-image";

type ShareWhatsAppParams = {
  dataUrl: string;
  fileName: string;
  text: string;
};

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

  async function shareDataUrlToWhatsApp({
    dataUrl,
    fileName,
    text,
  }: ShareWhatsAppParams) {
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

  return {
    generateImage,
    download,
    shareDataUrlToWhatsApp,
  };
}