import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Classificação Geral - Caserna Kart Racing",
  description:
    "Acompanhe a classificação oficial do campeonato Caserna Kart Racing. Pontuação, pilotos e destaques atualizados em tempo real.",

  openGraph: {
    title: "Classificação Geral - Caserna Kart Racing",
    description:
      "Veja a classificação completa do campeonato Caserna Kart Racing em tempo real.",
    url: "https://caserna-app.vercel.app",
    siteName: "Caserna Kart Racing",
    images: [
      {
        url: "https://caserna-app.vercel.app/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Classificação Geral - Caserna Kart Racing",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Classificação Geral - Caserna Kart Racing",
    description:
      "Classificação oficial do campeonato Caserna Kart Racing.",
    images: ["https://caserna-app.vercel.app/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
