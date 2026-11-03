import type { Metadata } from "next";
import { Glossary } from "@/views/Glossary";
import { pageOpenGraph } from "@/lib/open-graph";

const title = "Glossário de Búzios e Tarô — Reino de Mulambo";
const description =
  "Glossário de termos de búzios, tarô e práticas espirituais, em linguagem simples. Ninguém precisa saber nada para ser atendida.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/glossario" },
  openGraph: pageOpenGraph("/glossario", { title, description }),
};

export default function Page() {
  return <Glossary />;
}
