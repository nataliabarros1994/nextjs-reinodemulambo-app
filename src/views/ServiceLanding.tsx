"use client";

import Link from "next/link";
import { CalendarDays, Clock, MessageCircle } from "lucide-react";
import { Accordion } from "@/components/Accordion";
import { Button } from "@/components/Button";
import { Seo } from "@/components/Seo";
import { config } from "@/data/config.js";
import { pathToServicePage, serviceLandingJsonLd } from "@/lib/offers-schema";
import type { ServiceLandingCopy } from "@/lib/service-landings";
import { serviceLandings } from "@/lib/service-landings";
import { pathToPay } from "@/utils/payment.js";
import { linkWhatsAppOferta } from "@/utils/whatsapp.js";

type Offer = {
  id: string;
  nome: string;
  formato: string;
  duracao: string;
  valor: string;
  amountCents: number;
  descricao: string;
  disponibilidade: string;
};

export function ServiceLanding({ offer, copy }: { offer: Offer; copy: ServiceLandingCopy }) {
  const schema = serviceLandingJsonLd({
    id: offer.id,
    nome: offer.nome,
    description: copy.seoDescription,
    amountCents: offer.amountCents,
    faqs: copy.faqs,
  });

  return (
    <>
      <Seo schema={schema} />
      <section className="page-hero">
        <div className="container-wide">
          <nav aria-label="Trilha" className="text-sm text-branco-lua/55">
            <Link href="/" className="hover:text-dourado">
              Início
            </Link>
            <span aria-hidden="true"> · </span>
            <Link href="/servicos" className="hover:text-dourado">
              Serviços
            </Link>
            <span aria-hidden="true"> · </span>
            <span className="text-branco-lua/80">{offer.nome}</span>
          </nav>
          <span className="eyebrow mt-6 block">{copy.eyebrow}</span>
          <h1 className="font-display mt-4 max-w-3xl text-[2.15rem] leading-tight sm:text-5xl md:text-6xl">
            {copy.h1}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-branco-lua/80">{copy.lead}</p>
        </div>
      </section>

      <section className="pb-8">
        <div className="container-wide">
          <div className="max-w-2xl rounded-2xl border border-dourado/25 bg-preto-carvao px-6 py-5">
            <p className="preco-formato">{offer.formato}</p>
            <p className="mt-2 font-display text-3xl text-dourado">{offer.valor}</p>
            <p className="mt-3 flex items-center gap-2 text-sm text-branco-lua/70">
              <Clock size={14} /> {offer.duracao}
              {offer.disponibilidade ? ` · ${offer.disponibilidade}` : ""}
            </p>
            <p className="mt-3 text-sm leading-6 text-branco-lua/65">{offer.descricao}</p>
            <p className="mt-4 text-sm leading-6 text-branco-lua/60">{config.paymentPolicy}</p>
            <div className="preco-acoes mt-6">
              <Button href={pathToPay(offer.id)}>
                <CalendarDays size={16} /> Pagar e agendar
              </Button>
              <Button href={linkWhatsAppOferta(offer.nome, offer.valor)} external variant="contornado">
                <MessageCircle size={16} /> Tirar dúvidas no WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-wide grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl">Como funciona o atendimento</h2>
            <ol className="mt-6 list-decimal space-y-4 pl-5 text-[1.02rem] leading-7 text-branco-lua/75">
              {copy.howItWorks.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="font-display text-3xl">O que esta consulta inclui</h2>
            <ul className="mt-6 list-disc space-y-3 pl-5 text-[1.02rem] leading-7 text-branco-lua/75">
              {copy.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-wide max-w-3xl">
          <h2 className="font-display text-3xl">Perguntas frequentes</h2>
          <div className="mt-8">
            <Accordion items={copy.faqs} />
          </div>
          <p className="mt-8 text-sm leading-6 text-branco-lua/55">{config.avisoLegal}</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-wide">
          <h2 className="font-display text-3xl">Outras consultas</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-branco-lua/65">
            Se este formato não for o do seu momento, veja as outras consultas públicas. O pagamento continua em cada
            página de checkout correspondente.
          </p>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {copy.related.map((id) => {
              const related = serviceLandings[id];
              return (
                <li key={id}>
                  <Link
                    href={pathToServicePage(id)}
                    className="block rounded-xl border border-dourado/20 px-5 py-4 hover:border-dourado/50"
                  >
                    <span className="font-display text-xl text-branco-lua">{related.h1}</span>
                    <span className="mt-2 block text-sm text-branco-lua/60">{related.lead}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <li>
              <Link href="/servicos" className="text-dourado underline underline-offset-2">
                Todos os serviços
              </Link>
            </li>
            {copy.extraLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-dourado underline underline-offset-2">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
