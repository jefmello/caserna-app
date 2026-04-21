import Link from "next/link";
import { Home, Trophy } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-zinc-700/50 bg-zinc-900/50 p-8 text-center backdrop-blur-xl">
        <Trophy className="h-12 w-12 text-zinc-500" aria-hidden="true" />

        <div className="flex flex-col gap-2">
          <h2 className="text-5xl font-bold text-zinc-300">404</h2>
          <p className="text-lg text-zinc-400">Página não encontrada</p>
          <p className="text-sm text-zinc-500">
            A página que você procura não existe ou foi removida.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-600 bg-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-200 transition-all duration-200 hover:scale-[1.03] hover:bg-zinc-700 active:scale-[0.98]"
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
