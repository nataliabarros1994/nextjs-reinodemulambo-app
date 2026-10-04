import type { Metadata } from "next";
import { Blog } from "@/components/Blog";

export const metadata: Metadata = {
  title: "Blog — Palavra e caminho | Reino de Mulambo",
  description:
    "Escritos sobre búzios, tarô, autoconhecimento e espiritualidade no dia a dia. Consultas online por texto, áudio ou vídeo.",
};

export default function Page() {
  return <Blog />;
}
