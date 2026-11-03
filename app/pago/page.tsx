import type { Metadata } from "next";
import { Suspense } from "react";
import { Paid } from "@/views/Paid";

export const metadata: Metadata = {
  title: "Agendar — Reino de Mulambo",
  description: "Pagamento confirmado. Escolha o dia e o horário.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Paid />
    </Suspense>
  );
}
