import type { Metadata } from "next";
import { Blog } from "@/components/Blog";
import { pageOpenGraph } from "@/lib/open-graph";

const title = "Blog — Palavra e caminho | Reino de Mulambo";
const description =
  "Escritos sobre búzios, tarô, autoconhecimento e espiritualidade no dia a dia. Consultas online por texto, áudio ou vídeo.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog" },
  openGraph: pageOpenGraph("/blog", { title, description }),
};

export default function Page() {
  return <Blog />;
}
