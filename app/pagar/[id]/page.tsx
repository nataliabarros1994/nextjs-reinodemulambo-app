import type { Metadata } from "next";
import { Suspense } from "react";
import { Pay } from "@/views/Pay";

export const metadata: Metadata = {
  title: "Pay — Reino de Mulambo",
  description: "Pague a consulta para liberar a agenda.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Pay />
    </Suspense>
  );
}
