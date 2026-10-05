import type { Metadata } from "next";
import { Suspense } from "react";
import { Paid } from "@/views/Paid";

export const metadata: Metadata = {
  title: "Agendar — Reino de Mulambo",
  description: "Escolha o dia e o horário. O pagamento é feito na confirmação, via Stripe no Calendly.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Paid />
    </Suspense>
  );
}
