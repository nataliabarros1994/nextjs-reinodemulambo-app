import type { Metadata } from "next";
import { Home } from "@/views/Home";

export const metadata: Metadata = {
  title: "Reino de Mulambo — Jogo de Búzios e Tarô Online",
  description:
    "Jogo de búzios online e tarô online para todo o Brasil. Consultas por texto, áudio ou vídeo, com sigilo, respeito e escuta.",
};

export default function Page() {
  return <Home />;
}
