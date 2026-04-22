import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AppMainLayout from "@/components/navigation/app-main-layout";
import RevistaUploadForm from "./upload-form";

export const dynamic = "force-dynamic";

// Guarda mínima: em produção a página retorna 404 e nem renderiza o form.
// O próprio server action também recusa uploads se NODE_ENV === "production".
export const metadata: Metadata = {
  title: "Upload — Caserna Kart Racing",
  robots: { index: false, follow: false },
};

export default function UploadPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <AppMainLayout>
      <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6">
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
      </div>
    </AppMainLayout>
  );
}
