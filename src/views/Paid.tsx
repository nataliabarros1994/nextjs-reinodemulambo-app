"use client";
import { useMemo } from "react";
import { Clock } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { priceTable } from "@/data/services.js";
import { config } from "@/data/config.js";
import { Button } from "@/components/Button";
import { CalendlyEmbed } from "@/components/CalendlyEmbed";
import { Seo } from "@/components/Seo";
import { linkCalendly } from "@/utils/calendly.js";
import { pathToPay, resolveServiceId } from "@/utils/payment.js";

export function Paid() {
  const searchParams = useSearchParams();
  const id = resolveServiceId(searchParams.get("servico") || searchParams.get("evento") || "");
  const servico = useMemo(
    () => priceTable.find((item: { id: string }) => item.id === id),
    [id],
  );

  if (!servico) {
    return (
      <>
        <Seo
          title="Agendar consulta — Reino de Mulambo"
          description="Escolha o encontro e confirme o horário. O pagamento é feito na agenda, via Stripe."
        />
        <section className="page-hero">
          <div className="container-wide">
            <span className="eyebrow">agenda</span>
            <h1 className="font-display mt-4">Escolha o encontro e confirme o horário.</h1>
            <p className="mt-5 max-w-xl text-[1.05rem] leading-7 text-branco-lua/75">
              O pagamento acontece na confirmação, pelo Stripe no Calendly. Pix ou cartão. O valor não é reembolsável.
            </p>
          </div>
        </section>
        <section className="pb-24">
          <div className="container-wide">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {priceTable.map((item: (typeof priceTable)[number]) => (
                <article key={item.id} className="rounded-2xl border border-dourado/20 bg-preto-carvao/70 p-5">
                  <p className="text-xs uppercase tracking-widest text-dourado">{item.formato}</p>
                  <h2 className="font-display mt-2 text-xl">{item.nome}</h2>
                  <p className="mt-2 text-sm text-branco-lua/60">{item.duracao}</p>
                  <p className="mt-3 font-display text-xl text-dourado">{item.valor}</p>
                  <Button className="mt-5 w-full" href={pathToPay(item.id)}>
                    Agendar
                  </Button>
                </article>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Seo
        title={`Agendar ${servico.nome} — Reino de Mulambo`}
        description="Escolha o dia e o horário. O pagamento é cobrado na confirmação, via Stripe no Calendly."
      />
      <section className="page-hero">
        <div className="container-wide">
          <span className="eyebrow">agenda</span>
          <h1 className="font-display mt-4">Confirme o horário.</h1>
          <p className="mt-5 max-w-xl text-[1.05rem] leading-7 text-branco-lua/75">
            {servico.nome} · {servico.valor}. O Stripe cobra na hora em que você confirma o dia.
          </p>
        </div>
      </section>
      <section className="pb-24">
        <div className="container-wide grid gap-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:items-start">
          <article className="preco-card">
            <p className="preco-formato">{servico.formato}</p>
            <h2 className="preco-titulo">{servico.nome}</h2>
            <p className="preco-desc">{servico.descricao}</p>
            <p className="preco-tempo">
              <Clock size={14} /> {servico.duracao}
            </p>
            <p className="preco-valor">{servico.valor}</p>
            <p className="mt-2 text-sm leading-6 text-branco-lua/65">{config.paymentPolicy}</p>
            <div className="preco-acoes">
              <Button href={linkCalendly(servico.calendlySlug)} external variant="contornado">
                Abrir agenda numa nova aba
              </Button>
              <Button href="/agendar" variant="contornado">
                Escolher outro serviço
              </Button>
            </div>
          </article>
          <CalendlyEmbed url={linkCalendly(servico.calendlySlug)} />
        </div>
      </section>
    </>
  );
}
