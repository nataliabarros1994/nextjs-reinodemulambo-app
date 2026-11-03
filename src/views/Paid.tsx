"use client";
import { useEffect, useMemo, useState } from "react";
import { Clock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { catalogPriceTable, priceTable } from "@/data/services.js";
import { config } from "@/data/config.js";
import { Button } from "@/components/Button";
import { CalComEmbed } from "@/components/CalComEmbed";
import { Seo } from "@/components/Seo";
import { linkCalcom } from "@/utils/calcom.js";
import { hasPayment, markPaid, pathToPay, paymentIdFromSearch, resolveServiceId } from "@/utils/payment.js";
import { linkWhatsApp } from "@/utils/whatsapp.js";

type UnlockState = "checking" | "pending" | "locked" | "open";

function paymentQuery(searchParams: URLSearchParams) {
  return paymentIdFromSearch(searchParams);
}

export function Paid() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = resolveServiceId(searchParams.get("servico") || searchParams.get("evento") || searchParams.get("external_reference") || "");
  const paymentId = paymentQuery(searchParams);
  const returnStatus = searchParams.get("status") || searchParams.get("collection_status") || "";
  const servico = useMemo(
    () => priceTable.find((item: { id: string }) => item.id === id),
    [id],
  );
  const [unlock, setUnlock] = useState<UnlockState>("checking");

  useEffect(() => {
    if (!servico) {
      setUnlock("locked");
      return;
    }
    if (hasPayment(servico.id)) {
      setUnlock("open");
      return;
    }
    if (returnStatus === "rejected" || returnStatus === "cancelled" || returnStatus === "failure") {
      setUnlock("locked");
      router.replace(pathToPay(servico.id));
      return;
    }
    if (!paymentId) {
      setUnlock("locked");
      router.replace(pathToPay(servico.id));
      return;
    }

    let ativo = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const started = Date.now();

    const voltarAoPagamento = () => {
      setUnlock("locked");
      router.replace(pathToPay(servico.id));
    };

    const consultar = () => {
      fetch(`/api/mercadopago/session?servico=${encodeURIComponent(servico.id)}&payment_id=${encodeURIComponent(paymentId)}`)
        .then((res) => res.json())
        .then((data: { paid?: boolean; pending?: boolean }) => {
          if (!ativo) return;
          if (data.paid) {
            markPaid(servico.id, paymentId);
            setUnlock("open");
            let storedEmail = "";
            try {
              storedEmail = sessionStorage.getItem("reino-payer-email") || "";
            } catch {
              storedEmail = "";
            }
            fetch("/api/mercadopago/notify-booking", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, serviceId: servico.id, email: storedEmail }),
            }).catch(() => {
              /* webhook already sends; this is a second path if the client stayed on the site */
            });
            return;
          }
          if (data.pending) {
            setUnlock("pending");
            if (Date.now() - started < 3 * 60 * 1000) {
              timer = setTimeout(consultar, 4000);
            }
            return;
          }
          voltarAoPagamento();
        })
        .catch(() => {
          if (ativo) voltarAoPagamento();
        });
    };

    consultar();
    return () => {
      ativo = false;
      if (timer) clearTimeout(timer);
    };
  }, [paymentId, returnStatus, router, servico]);

  if (!servico) {
    return (
      <>
        <Seo
          title="Agendar consulta — Reino de Mulambo"
          description="Escolha o encontro, pague e depois confirme o horário."
        />
        <section className="page-hero">
          <div className="container-wide">
            <span className="eyebrow">agenda</span>
            <h1 className="font-display mt-4">Escolha o encontro e pague para liberar o horário.</h1>
            <p className="mt-5 max-w-xl text-[1.05rem] leading-7 text-branco-lua/75">
              {config.paymentPolicy}
            </p>
          </div>
        </section>
        <section className="pb-24">
          <div className="container-wide">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {catalogPriceTable.map((item: (typeof catalogPriceTable)[number]) => (
                <article key={item.id} className="rounded-2xl border border-dourado/20 bg-preto-carvao/70 p-5">
                  <p className="text-xs uppercase tracking-widest text-dourado">{item.formato}</p>
                  <h2 className="font-display mt-2 text-xl">{item.nome}</h2>
                  <p className="mt-2 text-sm text-branco-lua/60">{item.duracao}</p>
                  <p className="mt-3 font-display text-xl text-dourado">{item.valor}</p>
                  <Button className="mt-5 w-full" href={pathToPay(item.id)}>
                    Pagar e agendar
                  </Button>
                </article>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  if (unlock === "pending") {
    const whatsapp = linkWhatsApp(
      "pagamento",
      `${servico.nome} (${servico.valor}). Paguei no Mercado Pago e o Pix ainda está pendente.`,
    );
    return (
      <>
        <Seo
          title={`Agendar ${servico.nome} — Reino de Mulambo`}
          description="Aguardando a confirmação do Pix para liberar a agenda."
        />
        <section className="flex min-h-[50vh] items-center py-24">
          <div className="container-wide max-w-xl text-center">
            <p className="eyebrow">pix</p>
            <h1 className="font-display mt-4 text-[2rem] leading-tight">Aguardando o Pix.</h1>
            <p className="mt-5 text-sm leading-7 text-branco-lua/70">
              Assim que o Mercado Pago confirmar o pagamento, a agenda abre nesta página. Mantenha esta aba aberta.
            </p>
            <div className="mt-8 flex justify-center">
              <Button href={whatsapp} external variant="contornado">
                Avisar no WhatsApp
              </Button>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (unlock !== "open") {
    return (
      <>
        <Seo
          title={`Agendar ${servico.nome} — Reino de Mulambo`}
          description="Confirmando o pagamento para liberar a agenda."
        />
        <section className="flex min-h-[50vh] items-center justify-center">
          <p className="text-sm text-branco-lua/70">
            {unlock === "checking" ? "Confirmando o pagamento…" : "Abrindo o pagamento…"}
          </p>
        </section>
      </>
    );
  }

  return (
    <>
      <Seo
        title={`Agendar ${servico.nome} — Reino de Mulambo`}
        description="Pagamento confirmado. Escolha o dia e o horário."
      />
      <section className="page-hero">
        <div className="container-wide">
          <span className="eyebrow">agenda</span>
          <h1 className="font-display mt-4">Pagamento confirmado. Escolha o horário.</h1>
          <p className="mt-5 max-w-xl text-[1.05rem] leading-7 text-branco-lua/75">
            {servico.nome} · {servico.valor}. Há 30 minutos de intervalo entre um atendimento e o próximo.
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
            <p className="mt-2 text-sm leading-6 text-branco-lua/65">
              Este link de agenda vale para esta consulta paga.
            </p>
            <div className="preco-acoes">
              <Button href={linkCalcom(servico.calcomSlug)} external variant="contornado">
                Abrir agenda numa nova aba
              </Button>
              <Button href="/agendar" variant="contornado">
                Escolher outro serviço
              </Button>
            </div>
          </article>
          <CalComEmbed url={linkCalcom(servico.calcomSlug)} />
        </div>
      </section>
    </>
  );
}
