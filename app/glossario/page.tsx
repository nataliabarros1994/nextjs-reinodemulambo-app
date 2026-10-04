import type { Metadata } from "next";
import { Glossary } from "@/views/Glossary";

export const metadata: Metadata = {
  title: "Glossário de Búzios e Tarô — Reino de Mulambo",
  description:
    "Glossário de termos de búzios, tarô e práticas espirituais, em linguagem simples. Ninguém precisa saber nada para ser atendida.",
};

export default function Page() {
  return <Glossary />;
}
