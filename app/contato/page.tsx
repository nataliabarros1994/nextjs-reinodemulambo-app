import type { Metadata } from "next";
import { Suspense } from "react";
import { Contact } from "@/views/Contact";
import { pageOpenGraph } from "@/lib/open-graph";

const title = "Agendar consulta de tarô e búzios online | Reino de Mulambo";
const description =
  "Agende consulta de tarô online ou jogo de búzios. Taróloga no WhatsApp, texto, áudio ou vídeo. Pague e depois escolha o horário.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contato" },
  openGraph: pageOpenGraph("/contato", { title, description }),
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Contact />
    </Suspense>
  );
}
