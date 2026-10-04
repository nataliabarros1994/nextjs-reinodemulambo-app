import type { Metadata } from "next";
import { Suspense } from "react";
import { Contact } from "@/views/Contact";

export const metadata: Metadata = {
  title: "Agendar consulta — Reino de Mulambo | Tarô e búzios online",
  description:
    "Pague a consulta para liberar a agenda. O horário só é escolhido depois da confirmação do pagamento.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Contact />
    </Suspense>
  );
}
