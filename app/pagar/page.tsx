import type { Metadata } from "next";
import { Suspense } from "react";
import { Pay } from "@/views/Pay";

export const metadata: Metadata = {
  title: "Pagar — Reino de Mulambo",
  description: "Pague a consulta e, em seguida, escolha o horário.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Pay />
    </Suspense>
  );
}
