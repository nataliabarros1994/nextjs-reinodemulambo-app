"use client";
const nataliaPortrait = "/natalia-retrato.jpg";
import { ArrowRight, HeartHandshake, Lock, Scale, Sparkles } from "lucide-react";

import { faq } from "@/data/faq.js";
import { about, whatItDoesNotAnswer, howToPrepare } from "@/data/about.js";
import { config } from "@/data/config.js";
import { Accordion } from "@/components/Accordion";
import { Button } from "@/components/Button";
import { SpiritualCalendar } from "@/components/SpiritualCalendar";
import { Card } from "@/components/Card";
import { CowrieCast } from "@/components/CowrieCast";
import { NewsletterForm } from "@/components/NewsletterForm";
import { BookingQuiz } from "@/components/BookingQuiz";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";
import { Seo } from "@/components/Seo";
import { Starfield } from "@/components/Starfield";
import { PriceTable } from "@/components/PriceTable";
import { TarotOfTheDay } from "@/components/TarotOfTheDay";
import { GiftCard } from "@/components/GiftCard";
import { WeeklySlots } from "@/components/WeeklySlots";
import { DivisoriaZodiaco } from "@/components/ZodiacOrnament";
import { WaveDivider } from "@/components/WaveDivider";
import { linkWhatsApp } from "@/utils/whatsapp.js";

export function Home() {
  return (
    <>
      <Seo title={config.seo.title} description={config.seo.description} />
      <section className="hero">
        <div className="hero-veil" aria-hidden="true" />
        <Starfield />
        <div className="container-wide hero-content">
          <p className="eyebrow">um espaço de escuta</p>
          <h1 className="text-glow text-glow-pulse">Reino de Mulambo</h1>
          <p className="hero-sub">Jogo de Búzios • Tarô • Orientação Espiritual</p>
          <p className="hero-intro">
            Seja bem-vinda. Aqui o oráculo não apressa o seu caminho — ilumina o próximo passo, com respeito à tradição,
            sigilo e presença.
          </p>
          <div className="hero-actions">
            <Button href="/servicos">
              Agendar Consulta
            </Button>
            <Button href="/servicos" variant="contornado">
              Conhecer os Serviços
            </Button>
          </div>
        </div>
      </section>

      <div className="selo-faixa">{config.selo}</div>

      <Reveal>
        <section className="py-24">
          <div className="container-wide grid items-center gap-12 md:grid-cols-[auto_1fr]">
            <div className="portrait-circle">
              <img
                src={nataliaPortrait}
                alt="Reino de Mulambo durante um jogo de búzios"
                width={960}
                height={960}
                onError={(e) => {
                  e.currentTarget.src = "/natalia-retrato.jpg";
                }}
              />
            </div>
            <div>
              <SectionTitle eyebrow="sobre" title={<>Presença antes de qualquer resposta</>} lede={about.resumo} />
              <Button className="mt-8" href="/sobre" variant="contornado">
                Saiba mais <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </section>
      </Reveal>

      <DivisoriaZodiaco indice={0} />
      <WaveDivider />

      <Reveal>
        <section className="py-24">
          <div className="container-wide">
            <SectionTitle
              eyebrow="valores e serviços"
              title={<>Escolha o encontro que o seu momento pede</>}
              lede="Cada leitura tem tempo, formato e valor claros. Você agenda e paga no Calendly, via Stripe."
            />
            <div className="mt-10">
              <PriceTable />
            </div>
          </div>
        </section>
      </Reveal>

      <DivisoriaZodiaco indice={1} />
      <CowrieCast />

      <SpiritualCalendar />
      <TarotOfTheDay />

      <DivisoriaZodiaco indice={2} />
      <Reveal>
        <section className="py-24">
          <div className="container-wide">
            <SectionTitle eyebrow="como funciona" title={<>Três passos, uma conversa</>} />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                ["01", "Você escolhe o encontro", "Na tabela de valores, com formato e preço já claros."],
                ["02", "Agenda e paga no Calendly", "O Stripe cobra na confirmação do horário. Pix ou cartão. Sem reembolso."],
                ["03", "Conversamos no dia marcado", "Texto, áudio ou vídeo, com sigilo e tempo de escuta."],
              ].map(([n, t, d]) => (
                <Card key={n}>
                  <span className="text-dourado">{n}</span>
                  <h3 className="font-display mt-3 text-2xl">{t}</h3>
                  <p className="mt-2 text-sm text-branco-lua/65">{d}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="py-20">
          <div className="container-wide grid gap-8 md:grid-cols-2">
            <div>
              <SectionTitle eyebrow="ética" title={<>O que o jogo não responde</>} />
              <div className="mt-8 space-y-4">
                {whatItDoesNotAnswer.map((item: { titulo: string; texto: string }) => (
                  <div key={item.titulo} className="border-l-2 border-vermelho-vivo/70 pl-4">
                    <h3 className="font-display text-xl">{item.titulo}</h3>
                    <p className="mt-1 text-sm text-branco-lua/65">{item.texto}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <SectionTitle eyebrow="antes do encontro" title={<>Como me preparar</>} />
              <div className="mt-8 grid gap-4">
                {howToPrepare.map((item: { titulo: string; texto: string }) => (
                  <Card key={item.titulo} className="p-5">
                    <h3 className="font-display text-lg">{item.titulo}</h3>
                    <p className="mt-1 text-sm text-branco-lua/65">{item.texto}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <section className="py-12">
        <div className="container-wide">
          <GiftCard />
        </div>
      </section>

      <DivisoriaZodiaco indice={3} />
      <WeeklySlots />
      <BookingQuiz />

      <Reveal>
        <section className="py-24">
          <div className="container-wide grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
            <SectionTitle eyebrow="perguntas que chegam antes" title={<>Pode perguntar</>} lede="Um atendimento de confiança começa com informação clara." />
            <Accordion items={faq} />
          </div>
        </section>
      </Reveal>

      <section className="bg-roxo-profundo/50 py-20">
        <div className="container-wide max-w-3xl text-sm leading-7 text-branco-lua/70">
          <h2 className="font-display mb-4 text-2xl text-branco-lua">Jogo de búzios online e tarô online para todo o Brasil</h2>
          <p>
            Quem procura jogo de búzios online, tarô online ou uma consulta espiritual à distância encontra neste espaço
            um atendimento 100% online, por texto, áudio ou vídeo. A escuta é sigilosa, a tradição é tratada com dignidade,
            e nenhuma leitura substitui cuidado médico, psicológico ou jurídico.
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-r from-roxo-profundo to-vermelho-sangue/40 py-16">
        <div className="container-wide flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl">Uma mensagem por lua nova.</h2>
            <p className="mt-2 text-sm text-branco-lua/70">Guarde seu e-mail neste navegador — depois ligamos a um serviço real.</p>
          </div>
          <NewsletterForm />
        </div>
      </section>

      <section className="py-20 text-center">
        <div className="container-wide">
          <h2 className="font-display text-4xl">Quando você estiver pronta, estou aqui.</h2>
          <div className="mt-8 flex justify-center gap-4">
            <Button href={linkWhatsApp("home")} external>
              Falar com o Reino de Mulambo
            </Button>
            <Button href="/servicos" variant="contornado">
              Agendar horário
            </Button>
          </div>
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4 text-left md:grid-cols-4">
            {[
              { Icon: Lock, label: "Sigilo" },
              { Icon: Sparkles, label: "Fundamento" },
              { Icon: Scale, label: "Honestidade" },
              { Icon: HeartHandshake, label: "Acolhimento" },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-dourado">
                <Icon size={16} /> {label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
