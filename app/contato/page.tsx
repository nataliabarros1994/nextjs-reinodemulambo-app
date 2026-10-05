import type { Metadata } from "next";
import { Suspense } from "react";
import { Contact } from "@/views/Contact";

export const metadata: Metadata = {
  title: "Agendar consulta — Reino de Mulambo | Tarô e búzios online",
  description:
    "Escolha o encontro e confirme o horário no Calendly. O pagamento é feito na agenda, via Stripe.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Contact />
    </Suspense>
  );
}
