"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { config } from "@/data/config.js";
import { works } from "@/data/works.js";
import { Card } from "@/components/Card";
import { Seo } from "@/components/Seo";
import { SessionPrice } from "@/components/SessionPrice";

export function Works() {
  const router = useRouter();
  useEffect(() => {
    if (!config.TRABALHOS_ATIVOS) router.push("/");
  }, []);
  if (!config.TRABALHOS_ATIVOS) return null;
  return (
    <>
      <Seo
        title="Trabalhos espirituais — Reino de Mulambo"
        description="Limpeza, abertura de caminhos, harmonização e proteção. Cada caso é único. Valores somente após a consulta."
      />
      <section className="page-hero">
        <div className="container-wide">
          <span className="eyebrow">trabalhos espirituais</span>
          <h1 className="font-display mt-4 max-w-3xl text-5xl">Cuidado que começa antes do trabalho.</h1>
          <p className="mt-6 max-w-2xl leading-7 text-branco-lua/75">{works.intro}</p>
        </div>
      </section>
      <section className="py-20">
        <div className="container-wide grid gap-4 md:grid-cols-2">
          {works.itens.map((item: { nome: string; texto: string }) => (
            <Card key={item.nome}>
              <h2 className="font-display text-2xl">{item.nome}</h2>
              <p className="mt-3 text-sm leading-6 text-branco-lua/70">{item.texto}</p>
            </Card>
          ))}
        </div>
        <div className="container-wide mt-12 space-y-4">
          <p className="rounded-xl border border-vermelho-vivo/50 bg-vermelho-sangue/20 p-5 text-sm">
            {works.aviso}
          </p>
          <p className="text-center text-branco-lua/70">{works.fraseValor}</p>
          <SessionPrice origem="trabalhos" destaque />
        </div>
      </section>
    </>
  );
}
