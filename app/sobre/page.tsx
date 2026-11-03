import type { Metadata } from "next";
import { About } from "@/views/About";
import { pageOpenGraph } from "@/lib/open-graph";

const title = "Sobre o Reino de Mulambo — Jogo de Búzios e Tarô Online";
const description =
  "Mãe Natália, taróloga e jogo de búzios online. Consulta espiritual de confiança, 100% online para todo o Brasil, com sigilo e respeito à tradição.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/sobre" },
  openGraph: pageOpenGraph("/sobre", { title, description }),
};

export default function Page() {
  return <About />;
}
