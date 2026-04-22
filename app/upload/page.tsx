import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AppMainLayout from "@/components/navigation/app-main-layout";
import { readRevistaManifest, sortRevistas } from "@/lib/revistas";
import RevistaUploadForm from "./upload-form";
import RevistaList from "./revista-list";

export const dynamic = "force-dynamic";

// Guarda mínima: em produção a página retorna 404 e nem renderiza o form.
// O próprio server action também recusa uploads se NODE_ENV === "production".
export const metadata: Metadata = {
  title: "Upload — Caserna Kart Racing",
  robots: { index: false, follow: false },
};

function uploadEnabled(): boolean {
  // Flag explícita ganha de tudo. Útil em preview deploys onde NODE_ENV é
  // "production" mas você quer testar o fluxo mesmo assim.
  const flag = process.env.CASERNA_UPLOAD_ENABLED;
  if (flag === "1" || flag === "true") return true;
  if (flag === "0" || flag === "false") return false;
  return process.env.NODE_ENV !== "production";
}

export default async function UploadPage() {
  if (!uploadEnabled()) {
    notFound();
  }

  const revistas = sortRevistas(await readRevistaManifest());

  return (
    <AppMainLayout>
      <div className="mx-auto my-6 w-full max-w-3xl rounded-[28px] bg-[#0a0f1c] px-4 py-8 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)] ring-1 ring-white/10 md:my-10 md:px-6">
        <header className="mb-5 flex flex-col gap-2">
          <p className="text-[11px] font-bold tracking-[0.24em] text-amber-400 uppercase">
            Apenas desenvolvimento
          </p>
          <h1 className="text-[22px] font-black tracking-tight text-white md:text-[28px]">
            Publicar nova edição
          </h1>
          <p className="max-w-2xl text-[13px] text-white/60">
            Disponível somente rodando o app em <code>npm run dev</code>. O upload grava em{" "}
            <code>public/revistas/</code> e atualiza <code>data/revistas.json</code>. Após publicar,
            faça commit e push para subir ao deploy.
          </p>
        </header>

        <RevistaUploadForm />
        <RevistaList revistas={revistas} />
      </div>
    </AppMainLayout>
  );
}
