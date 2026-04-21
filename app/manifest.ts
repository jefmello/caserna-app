import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Caserna Kart Racing",
    short_name: "Caserna",
    description:
      "Classificação oficial, estatísticas e simulações do campeonato Caserna Kart Racing.",
    start_url: "/",
    display: "standalone",
    background_color: "#05070a",
    theme_color: "#0f172a",
    orientation: "portrait-primary",
    lang: "pt-BR",
    categories: ["sports", "entertainment"],
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
