"use client";

import { useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import { getPilotFirstAndLastName } from "@/lib/ranking/ranking-utils";
import { track } from "@/lib/analytics";
import type { RankingItem } from "@/types/ranking";

type UseShareProps = {
  selectedPilot: RankingItem | null;
  safeSelectedPilot: RankingItem;
  category: string;
  competition: string;
  isDarkMode: boolean;
};

export default function useShare({
  selectedPilot,
  safeSelectedPilot,
  category,
  competition,
  isDarkMode,
}: UseShareProps) {
  const shareCardRef = useRef<HTMLDivElement | null>(null);
  const pilotShareCardRef = useRef<HTMLDivElement | null>(null);
  const [isSharingImage, setIsSharingImage] = useState(false);
  const [isSharingPilotImage, setIsSharingPilotImage] = useState(false);

  async function handleShareClassification() {
    if (!shareCardRef.current || isSharingImage) return;

    try {
      setIsSharingImage(true);
      const dataUrl = await htmlToImage.toPng(shareCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: isDarkMode ? "#0b1220" : "#f4f4f5",
      });

      const link = document.createElement("a");
      link.download = `classificacao-${category.toLowerCase()}-${competition.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      window.alert("Não foi possível gerar a imagem da classificação.");
    } finally {
      setIsSharingImage(false);
    }
  }

  async function handleSharePilotCard() {
    if (!selectedPilot || !pilotShareCardRef.current || isSharingPilotImage) return;

    try {
      setIsSharingPilotImage(true);
      track("pilot_shared", {
        pilot: safeSelectedPilot.piloto,
        category,
        competition,
      });
      const dataUrl = await htmlToImage.toPng(pilotShareCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: isDarkMode ? "#0b1220" : "#f4f4f5",
      });

      const safePilotName = getPilotFirstAndLastName(safeSelectedPilot.piloto)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/\s+/g, "-");

      const link = document.createElement("a");
      link.download = `piloto-${safePilotName}-${category.toLowerCase()}-${competition.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      window.alert("Não foi possível gerar a imagem do piloto.");
    } finally {
      setIsSharingPilotImage(false);
    }
  }

  return {
    shareCardRef,
    pilotShareCardRef,
    isSharingImage,
    isSharingPilotImage,
    handleShareClassification,
    handleSharePilotCard,
  };
}
