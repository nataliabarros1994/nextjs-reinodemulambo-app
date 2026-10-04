import type { Metadata } from "next";
import { About } from "@/views/About";

export const metadata: Metadata = {
  title: "About Reino de Mulambo — Jogo de Búzios e Tarô Online",
  description:
    "Conheça a história, o caminho espiritual e os valores do Reino de Mulambo.",
};

export default function Page() {
  return <About />;
}
