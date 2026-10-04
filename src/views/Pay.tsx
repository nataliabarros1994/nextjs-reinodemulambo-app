"use client";
import { useEffect, useMemo } from "react";
import { Clock } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { priceTable } from "@/data/services.js";
import { Button } from "@/components/Button";
import { Seo } from "@/components/Seo";
import { confirmationPath, markPaid, hasPayment } from "@/utils/payment.js";

function idDaRota(search: string, pathId?: string) {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  return pathId || params.get("servico") || "";
}

function veioDoStripe(search: string) {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  return Boolean(params.get("session_id") || params.get("sucesso") === "1");
}

export function Pay({ params }: { params?: { id?: string } } = {}) {
  const routeParams = useParams<{ id?: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.toString();
  const search = q ? `?${q}` : "";
  
  const id = idDaRota(search, params?.id || routeParams?.id);
  const servico = useMemo(
    () => priceTable.find((item: { id: string }) => item.id === id),
    [id],
  );

  useEffect(() => {
    if (!id) return;
    if (veioDoStripe(search) || hasPayment(id)) {
      markPaid(id);
      router.push(confirmationPath(id));
    }
  }, [id, search]);

  if (!servico) {
    return (
      <section className="flex min-h-[70vh] items-center py-24">
        <div className="container-wide max-w-xl text-center">
          <h1 className="font-display text-4xl">Serviço não encontrado</h1>
          <p className="mt-4 text-branco-lua/70">Escolha um formato na tabela de valores para pagar e, depois, marcar o horário.</p>
          <Button className="mt-8" href="/servicos">
            Ver serviços
          </Button>
        </div>
      </section>
    );
  }

  const confirmarPagamento = () => {
    markPaid(servico.id);
    router.push(confirmationPath(servico.id));
  };

  return (
    <>
      <Seo
        title={`Pay ${servico.nome} — Reino de Mulambo`}
        description="Pague a consulta para liberar a agenda. O horário só é escolhido depois da confirmação do pagamento."
      />
      <section className="page-hero">
        <div className="container-wide">
          <span className="eyebrow">pagamento</span>
          <h1 className="font-display mt-4 text-5xl md:text-7xl">Pague para liberar a agenda.</h1>
        </div>
      </section>
      <section className="pb-24">
        <div className="container-wide max-w-xl">
          <article className="preco-card">
            <p className="preco-formato">{servico.formato}</p>
            <h2 className="preco-titulo">{servico.nome}</h2>
            <p className="preco-desc">{servico.descricao}</p>
            <p className="preco-tempo">
              <Clock size={14} /> {servico.duracao}
            </p>
            <p className="preco-valor">{servico.valor}</p>
            <p className="mt-2 text-sm leading-6 text-branco-lua/65">
              O horário no Calendly só aparece depois do pagamento. Pix ou cartão. O valor não é reembolsável.
            </p>
            <div className="preco-acoes">
              {servico.stripePaymentUrl ? (
                <Button href={servico.stripePaymentUrl} external>
                  Pay agora
                </Button>
              ) : null}
              <Button
                variant={servico.stripePaymentUrl ? "contornado" : "vermelho"}
                onClick={confirmarPagamento}
              >
                {servico.stripePaymentUrl ? "Já paguei — escolher horário" : "Confirmar pagamento e agendar"}
              </Button>
            </div>
          </article>
          <p className="mt-6 text-sm text-branco-lua/50">
            Depois de pagar no Stripe, volte a esta página e toque em “Já paguei — escolher horário”.
          </p>
          <Button className="mt-6" href="/servicos" variant="contornado">
            Escolher outro serviço
          </Button>
        </div>
      </section>
    </>
  );
}

export default Pay;
