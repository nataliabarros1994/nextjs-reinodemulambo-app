"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { priceTable } from "@/data/services.js";
import { Button } from "@/components/Button";
import { CalendlyEmbed } from "@/components/CalendlyEmbed";
import { Seo } from "@/components/Seo";
import { linkCalendly } from "@/utils/calendly.js";
import { pathToPay, markPaid, hasPayment } from "@/utils/payment.js";

function paramsDaAgenda(search: string) {
  return new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
}

export function Paid() {
  const searchParams = useSearchParams();
  const q = searchParams.toString();
  const search = q ? `?${q}` : "";
  const router = useRouter();
  
  const params = paramsDaAgenda(search);
  const id = params.get("servico") || "";
  const servico = useMemo(
    () => priceTable.find((item: { id: string }) => item.id === id),
    [id],
  );
  const [liberado, setLiberado] = useState(false);

  useEffect(() => {
    const query = paramsDaAgenda(search);
    if (!servico) {
      router.push("/servicos");
      return;
    }
    if (query.get("sucesso") === "1" || query.get("session_id")) {
      markPaid(servico.id);
    }
    if (!hasPayment(servico.id)) {
      router.push(pathToPay(servico.id));
      return;
    }
    setLiberado(true);
  }, [servico, search]);

  if (!servico || !liberado) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-branco-lua/70">Confirmando o pagamento…</p>
      </section>
    );
  }

  return (
    <>
      <Seo
        title={`Escolher horário — ${servico.nome}`}
        description="Pagamento confirmado. Escolha o dia e o horário da consulta."
      />
      <section className="page-hero">
        <div className="container-wide">
          <span className="eyebrow">agenda liberada</span>
          <h1 className="font-display mt-4 text-5xl md:text-7xl">Escolha o horário.</h1>
          <p className="mt-6 max-w-2xl text-[1.0625rem] leading-[1.7] text-branco-lua/75">
            Pagamento de {servico.nome} ({servico.valor}) confirmado. Marque o dia e o turno na agenda.
          </p>
        </div>
      </section>
      <section className="pb-24">
        <div className="container-wide">
          <CalendlyEmbed url={linkCalendly(servico.calendlySlug)} />
          <div className="mt-8">
            <Button href="/servicos" variant="contornado">
              Voltar aos serviços
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
