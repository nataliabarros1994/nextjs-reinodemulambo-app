"use client";

const nataliaPortrait = "/natalia-retrato.jpg";
import { HeartHandshake, Lock, Scale, Sparkles } from "lucide-react";
import { config } from "@/data/config.js";
import { about } from "@/data/about.js";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Seo } from "@/components/Seo";


const icons = [Lock, Sparkles, Scale, HeartHandshake];

export function About() {
  return (
    <>
      <Seo
        title={`Sobre o ${config.nome} — Jogo de Búzios e Tarô Online`}
        description="Conheça a história, o caminho espiritual e os valores do Reino de Mulambo."
      />
      <section className="page-hero">
        <div className="container-wide">
          <span className="eyebrow">a pessoa por trás da escuta</span>
          <h1 className="font-display mt-4 max-w-3xl text-5xl leading-tight md:text-7xl">
            Presença antes de qualquer resposta.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-dourado/90">{about.apresentacao}</p>
        </div>
      </section>
      <section className="py-24">
        <div className="container-wide grid items-center gap-6 md:grid-cols-[auto_minmax(0,1fr)] md:gap-10">
          <div className="portrait-circle portrait-circle--sm mx-auto md:mx-0">
            <img
              src={nataliaPortrait}
              alt="Reino de Mulambo"
              onError={(e) => {
                e.currentTarget.src = "/natalia-retrato.jpg";
              }}
            />
          </div>
          <div className="space-y-5 text-branco-lua/75 leading-8">
            {about.historia.map((p: string) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>
      </section>
      <section className="pb-24">
        <div className="container-wide">
          <h2 className="font-display text-4xl">Caminho</h2>
          <div className="mt-10 space-y-8 border-l border-dourado/30 pl-8">
            {about.caminho.map((item: { ano: string; texto: string }) => (
              <div key={item.ano}>
                <span className="eyebrow">{item.ano}</span>
                <p className="mt-2 max-w-xl text-branco-lua/70">{item.texto}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 grid gap-4 md:grid-cols-4">
            {about.valores.map((v: { titulo: string; texto: string }, i: number) => {
              const Icon = icons[i];
              return (
                <Card key={v.titulo}>
                  <Icon className="text-dourado" size={22} />
                  <h3 className="font-display mt-4 text-xl">{v.titulo}</h3>
                  <p className="mt-2 text-sm text-branco-lua/65">{v.texto}</p>
                </Card>
              );
            })}
          </div>
          <Button className="mt-12" href="/servicos">
            Agendar consulta
          </Button>
        </div>
      </section>
    </>
  );
}
