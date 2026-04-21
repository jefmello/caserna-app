import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ChampionshipProvider } from "@/context/championship-context";
import { ToastProvider } from "@/components/ui/toast";
import { QueryProvider } from "@/components/providers/query-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://caserna-app.vercel.app"),
  title: "Classificação Geral - Caserna Kart Racing",
  description:
    "Acompanhe a classificação oficial do campeonato Caserna Kart Racing. Pontuação, pilotos e destaques atualizados em tempo real.",

  openGraph: {
    title: "Classificação Geral - Caserna Kart Racing",
    description: "Veja a classificação completa do campeonato Caserna Kart Racing em tempo real.",
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
    description: "Classificação oficial do campeonato Caserna Kart Racing.",
    images: ["https://caserna-app.vercel.app/opengraph-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <QueryProvider>
          <ChampionshipProvider>
            <ToastProvider>{children}</ToastProvider>
          </ChampionshipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
