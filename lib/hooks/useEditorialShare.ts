"use client";

import { useCallback } from "react";
import * as htmlToImage from "html-to-image";

type ShareType = "leader" | "duel" | "narrative";

export default function useEditorialShare() {
  const generateImage = useCallback(async (ref: HTMLElement | null): Promise<string | null> => {
    if (!ref) return null;
    if (typeof window === "undefined") return null;

    try {
      const dataUrl = await htmlToImage.toPng(ref, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#0b1220",
      });

      return dataUrl;
    } catch (error) {
      console.error("Erro ao gerar imagem editorial:", error);
      return null;
    }
  }, []);

  const downloadImage = useCallback((dataUrl: string, fileName: string) => {
    if (typeof document === "undefined") return;

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const shareImage = useCallback(
    async (ref: HTMLElement | null, type: ShareType): Promise<string | null> => {
      const image = await generateImage(ref);
      if (!image) return null;

      const fileName = `caserna-${type}.png`;
      downloadImage(image, fileName);

      return image;
    },
    [generateImage, downloadImage]
  );

  return {
    generateImage,
    downloadImage,
    shareImage,
  };
}
