import type { Metadata } from "next";
import { Button } from "@/components/Button";

export const metadata: Metadata = {
  title: "Consulta não encontrada | Reino de Mulambo",
  robots: { index: false, follow: true },
};

export default function ServiceNotFound() {
  return (
    <section className="py-24 text-center">
      <h1 className="font-display text-4xl">Consulta não encontrada</h1>
      <p className="mx-auto mt-4 max-w-md text-branco-lua/70">
        Este endereço não corresponde a uma consulta publicada. Veja os serviços disponíveis.
      </p>
      <Button className="mt-6" href="/servicos" variant="contornado">
        Ver serviços
      </Button>
    </section>
  );
}
