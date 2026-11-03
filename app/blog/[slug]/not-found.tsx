import type { Metadata } from "next";
import { Button } from "@/components/Button";

export const metadata: Metadata = {
  title: "Artigo não encontrado | Reino de Mulambo",
  robots: { index: false, follow: false },
};

export default function BlogArticleNotFound() {
  return (
    <section className="py-24 text-center">
      <h1 className="font-display text-4xl">Artigo não encontrado</h1>
      <Button className="mt-6" href="/blog" variant="contornado">
        Voltar ao blog
      </Button>
    </section>
  );
}
