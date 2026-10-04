"use client";
import { services, priceTable } from "@/data/services.js";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Seo } from "@/components/Seo";
import { PriceTable } from "@/components/PriceTable";
import { pathToPay } from "@/utils/payment.js";

export function Services() {
  return (
    <>
      <Seo
        title="Serviços — Jogo de Búzios e Tarô Online | Reino de Mulambo"
        description="Valores e formatos de Jogo de Búzios e Tarô online com o Reino de Mulambo. Texto, áudio, vídeo, ligação e consulta espiritual."
      />
      <section className="page-hero">
        <div className="container-wide">
          <span className="eyebrow">serviços</span>
          <h1 className="font-display mt-4 max-w-3xl text-5xl md:text-7xl">Cada pergunta pede uma linguagem.</h1>
        </div>
      </section>
      <section className="py-16">
        <div className="container-wide">
          <p className="max-w-2xl leading-7 text-branco-lua/75">
            Escolha o formato e o oráculo. Pague primeiro para liberar a agenda. O WhatsApp fica só para dúvidas.
          </p>
          <div className="mt-10">
            <PriceTable />
          </div>
        </div>
      </section>
      <section className="pb-20">
        <div className="container-wide space-y-16">
          {services.map((s: (typeof services)[number]) => {
            const oferta = priceTable.find(
              (item: { calendlySlug?: string }) => item.calendlySlug === s.calendlySlug,
            );
            return (
            <Card key={s.id}>
              <h2 className="font-display text-3xl">{s.nome}</h2>
              <p className="mt-4 max-w-2xl leading-7 text-branco-lua/75">{s.oQueE}</p>
              {s.oQueConsulta ? (
                <ul className="mt-5 list-disc space-y-1 pl-5 text-sm text-branco-lua/70">
                  {s.oQueConsulta.map((item: string) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {s.tiragens ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {s.tiragens.map((t: { nome: string; descricao: string }) => (
                    <div key={t.nome} className="rounded-xl border border-dourado/20 p-4">
                      <h3 className="font-display text-xl">{t.nome}</h3>
                      <p className="mt-2 text-sm text-branco-lua/65">{t.descricao}</p>
                    </div>
                  ))}
                </div>
              ) : null}
              <p className="mt-5 text-sm text-dourado">{s.duracao}</p>
              <p className="text-sm text-branco-lua/55">{s.formatos.join(" · ")}</p>
              <Button className="mt-6" href={oferta ? pathToPay(oferta.id) : "/contato"}>
                Pay e agendar {s.nome}
              </Button>
            </Card>
            );
          })}
        </div>
      </section>
    </>
  );
}
