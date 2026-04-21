"use client";

import { useCallback, useState } from "react";

type ShareOptions = {
  title?: string;
  text?: string;
  filename: string;
  dataUrl: string;
};

type ShareResult = "shared" | "downloaded" | "cancelled" | "error";

/**
 * Native Web Share hook. Falls back to download when Share API or file-share is unavailable.
 * Converts a data URL to a File and calls navigator.share when supported.
 */
export default function useNativeShare() {
  const [isSharing, setIsSharing] = useState(false);

  const share = useCallback(
    async ({ title, text, filename, dataUrl }: ShareOptions): Promise<ShareResult> => {
      if (typeof window === "undefined") return "error";

      setIsSharing(true);
      try {
        const file = await dataUrlToFile(dataUrl, filename);

        const canShareFiles =
          typeof navigator.share === "function" &&
          typeof navigator.canShare === "function" &&
          navigator.canShare({ files: [file] });

        if (canShareFiles) {
          try {
            await navigator.share({ title, text, files: [file] });
            return "shared";
          } catch (err) {
            if (err instanceof Error && err.name === "AbortError") return "cancelled";
            // fallthrough to download
          }
        }

        downloadDataUrl(dataUrl, filename);
        return "downloaded";
      } catch {
        return "error";
      } finally {
        setIsSharing(false);
      }
    },
    []
  );

  return { share, isSharing };
}

async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type || "image/png" });
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
