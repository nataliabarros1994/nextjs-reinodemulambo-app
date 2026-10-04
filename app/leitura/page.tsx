import type { Metadata } from "next";
import { Reading } from "@/views/Reading";

export const metadata: Metadata = {
  title: "A leitura — como funciona uma consulta de búzios e tarô online",
  description:
    "Como funciona uma consulta de búzios e tarô online: o que o oráculo responde, o que eu não faço, como perguntar e como se preparar. Atendimento por texto, áudio ou vídeo.",
};

export default function Page() {
  return <Reading />;
}
