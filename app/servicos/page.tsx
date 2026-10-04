import type { Metadata } from "next";
import { Services } from "@/views/Services";

export const metadata: Metadata = {
  title: "Serviços — Jogo de Búzios e Tarô Online | Reino de Mulambo",
  description:
    "Valores e formatos de Jogo de Búzios e Tarô online com o Reino de Mulambo. Texto, áudio, vídeo, ligação e consulta espiritual.",
};

export default function Page() {
  return <Services />;
}
