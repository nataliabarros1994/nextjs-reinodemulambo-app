import type { Metadata } from "next";
import { Services } from "@/views/Services";
import { pageOpenGraph } from "@/lib/open-graph";

const title = "Serviços — Jogo de Búzios e Tarô Online | Reino de Mulambo";
const description =
  "Consulta de tarot online, jogo de búzios e consulta com entidade. Valores, taróloga no WhatsApp, texto, áudio, ligação e vídeo. Pague e depois escolha o horário.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/servicos" },
  openGraph: pageOpenGraph("/servicos", { title, description }),
};

export default function Page() {
  return <Services />;
}
