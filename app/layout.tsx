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

// Inline script runs before hydration. Reads the persisted theme variant
// from localStorage and sets a CSS custom property on <html> so the correct
// background gradient paints on the first frame — no flash from midnight
// default → user's chosen variant (Gulf/Ferrari/Stealth) after hydration.
const THEME_VARIANT_BOOT_SCRIPT = `
(function() {
  try {
    var v = localStorage.getItem('caserna-theme-variant');
    var g = {
      midnight: 'linear-gradient(180deg,#04060b 0%,#0a0f1c 55%,#05070a 100%)',
      gulf: 'linear-gradient(180deg,#001a3a 0%,#003876 55%,#001428 100%)',
      ferrari: 'linear-gradient(180deg,#180000 0%,#2d0000 55%,#0e0000 100%)',
      stealth: 'linear-gradient(180deg,#030303 0%,#080808 55%,#000000 100%)'
    };
    var chosen = g[v] || g.midnight;
    document.documentElement.style.setProperty('--caserna-bg-gradient', chosen);
    var theme = localStorage.getItem('caserna-theme');
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_VARIANT_BOOT_SCRIPT }} />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-zinc-900 focus:shadow-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
        >
          Pular para o conteúdo
        </a>
        <QueryProvider>
          <ChampionshipProvider>
            <ToastProvider>{children}</ToastProvider>
          </ChampionshipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
