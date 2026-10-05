import type { Metadata } from "next";
import { Works } from "@/views/Works";

export const metadata: Metadata = {
  title: "Trabalhos espirituais — Reino de Mulambo",
  description:
    "Limpeza, abertura de caminhos, harmonização e proteção. Cada caso é único. Valores somente após a consulta.",
};

export default function Page() {
  return <Works />;
}
