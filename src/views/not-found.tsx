"use client";
import Link from "next/link";
import { Seo } from "@/components/Seo";

export default function NotFound() {
  return (
    <>
      <Seo title="Caminho não encontrado — Reino de Mulambo" description="Esta página tomou outra maré." />
      <div className="not-found-page">
        <p className="eyebrow">um desvio no caminho</p>
        <h1 className="font-display mt-4 text-[5rem] text-dourado">404</h1>
        <p className="mt-2 max-w-md text-branco-lua/70">
          Este caminho não existe... mas todo caminho pode ser reencontrado.
        </p>
        <div className="tarot-scene mt-10">
          <div className="tarot-card-3d pointer-events-none mx-auto">
            <div className="tarot-face tarot-back">
              <span className="font-display text-3xl text-dourado">MN</span>
            </div>
          </div>
        </div>
        <Link href="/" className="btn btn-vermelho mt-10">
          Voltar para a margem
        </Link>
      </div>
    </>
  );
}
