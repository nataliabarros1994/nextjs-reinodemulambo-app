import type { Metadata } from "next";
import { Home } from "@/views/Home";
import { pageOpenGraph } from "@/lib/open-graph";

const title = "Reino de Mulambo — Jogo de Búzios e Tarô Online";
const description =
  "Consulta de tarô online e jogo de búzios com a Mãe Natália. Taróloga e oráculo afro-brasileiro por texto, áudio, WhatsApp, ligação ou vídeo. Sigilo, para todo o Brasil.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: pageOpenGraph("/", { title, description }),
};

export default function Page() {
  return <Home />;
}
