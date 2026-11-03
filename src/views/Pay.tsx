"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Clock, Copy } from "lucide-react";
import { catalogPriceTable, priceTable } from "@/data/services.js";
import { config } from "@/data/config.js";
import { Button } from "@/components/Button";
import { Seo } from "@/components/Seo";
import { pathToPay, resolveServiceId } from "@/utils/payment.js";
import { linkWhatsApp } from "@/utils/whatsapp.js";

type PixPayload = { paymentId: string; qrCode: string; qrImage: string };

function Catalog() {
  return (
    <>
      <Seo
        title="Pagar consulta — Reino de Mulambo"
        description="Pague a consulta no Mercado Pago e, em seguida, escolha o horário. Pix ou cartão."
      />
      <section className="page-hero">
        <div className="container-wide">
          <span className="eyebrow">pagamento</span>
          <h1 className="font-display mt-4">Pague primeiro, depois escolha o horário.</h1>
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

function EmailField({
  email,
  onChange,
}: {
  email: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm text-branco-lua/80">
      E-mail para receber o link da agenda
      <input
        className="field-input mt-2 w-full"
        type="email"
        name="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => onChange(event.target.value)}
        placeholder="nome@email.com"
      />
    </label>
  );
}

function WhatsAppPixPanel({
  serviceId,
  nome,
  valor,
  email,
  pix,
  whatsapp,
  onBack,
}: {
  serviceId: string;
  nome: string;
  valor: string;
  email: string;
  pix: PixPayload;
  whatsapp: string;
  onBack: () => void;
}) {
  const [copiado, setCopiado] = useState(false);
  const [status, setStatus] = useState("Aguardando o Pix…");

  useEffect(() => {
    let ativo = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const started = Date.now();
    const poll = () => {
      fetch(
        `/api/mercadopago/session?servico=${encodeURIComponent(serviceId)}&payment_id=${encodeURIComponent(pix.paymentId)}`,
      )
        .then((res) => res.json())
        .then((data: { paid?: boolean; pending?: boolean }) => {
          if (!ativo) return;
          if (data.paid) {
            setStatus("Pagamento confirmado. Abrindo a agenda…");
            window.location.assign(
              `/agendar?servico=${encodeURIComponent(serviceId)}&payment_id=${encodeURIComponent(pix.paymentId)}`,
            );
            return;
          }
          if (data.pending && Date.now() - started < 20 * 60 * 1000) {
            setStatus("Aguardando o banco confirmar o Pix…");
            timer = setTimeout(poll, 4000);
          }
        })
        .catch(() => {
          if (ativo && Date.now() - started < 20 * 60 * 1000) {
            timer = setTimeout(poll, 6000);
          }
        });
    };
    poll();
    return () => {
      ativo = false;
      if (timer) clearTimeout(timer);
    };
  }, [pix.paymentId, serviceId]);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(pix.qrCode);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2500);
    } catch {
      setCopiado(false);
    }
  }

  const qrSrc = pix.qrImage
    ? pix.qrImage.startsWith("data:")
      ? pix.qrImage
      : `data:image/png;base64,${pix.qrImage}`
    : "";

  return (
    <div className="space-y-4">
      <p className="font-display text-xl text-branco-lua">Bem-vinda ao Reino de Mulambo.</p>
      <p className="text-sm leading-6 text-branco-lua/75">
        Pague <strong className="text-dourado">{nome} ({valor})</strong> no Pix abaixo. Assim que o
        banco confirmar, o e-mail de pagamento aprovado e o link para escolher o horário chegam em{" "}
        <strong>{email}</strong>.
      </p>
      {qrSrc ? (
        <img
          src={qrSrc}
          alt="QR Code Pix"
          className="mx-auto h-44 w-44 rounded-lg bg-branco-lua p-2"
        />
      ) : null}
      <p className="text-xs uppercase tracking-widest text-dourado">Pix copia e cola</p>
      <textarea className="field-input min-h-24 w-full break-all text-xs" readOnly value={pix.qrCode} />
      <Button className="w-full" variant="contornado" onClick={copiar}>
        <Copy size={16} /> {copiado ? "Chave copiada" : "Copiar Pix"}
      </Button>
      <p className="text-xs leading-5 text-branco-lua/55">{status}</p>
      <Button className="w-full" href={whatsapp} external>
        Abrir WhatsApp e enviar o comprovante
      </Button>
      <button type="button" className="w-full text-center text-sm text-branco-lua/55 underline" onClick={onBack}>
        Voltar ao pagamento
      </button>
    </div>
  );
}

function CheckoutActions({
  serviceId,
  nome,
  valor,
  whatsapp,
}: {
  serviceId: string;
  nome: string;
  valor: string;
  whatsapp: string;
}) {
  const [busy, setBusy] = useState<"mp" | "wa" | "">("");
  const [erro, setErro] = useState("");
  const [email, setEmail] = useState("");
  const [pix, setPix] = useState<PixPayload | null>(null);

  function emailLimpo() {
    return email.trim().toLowerCase();
  }

  function exigirEmail() {
    const cleanEmail = emailLimpo();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErro("Informe um e-mail válido. O link da agenda chega nele assim que o pagamento confirmar.");
      return "";
    }
    try {
      sessionStorage.setItem("reino-payer-email", cleanEmail);
    } catch {
      /* ignore */
    }
    return cleanEmail;
  }

  async function pagarMercadoPago() {
    const cleanEmail = exigirEmail();
    if (!cleanEmail) return;
    setBusy("mp");
    setErro("");
    try {
      const response = await fetch("/api/mercadopago/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, email: cleanEmail }),
      });
      const data = (await response.json()) as { url?: string; reason?: string };
      if (data.url) {
        window.location.assign(data.url);
        return;
      }
      if (data.reason === "unconfigured") {
        setErro("O Mercado Pago ainda não recebeu a chave da conta. Pague pelo WhatsApp por agora.");
        return;
      }
      if (data.reason === "missing_email") {
        setErro("Informe um e-mail válido. O link da agenda chega nele assim que o pagamento confirmar.");
        return;
      }
      setErro("Não foi possível abrir o Mercado Pago. Tente de novo ou pague pelo WhatsApp.");
    } catch {
      setErro("Não foi possível abrir o Mercado Pago. Tente de novo ou pague pelo WhatsApp.");
    } finally {
      setBusy("");
    }
  }

  async function pagarWhatsApp() {
    const cleanEmail = exigirEmail();
    if (!cleanEmail) return;
    setBusy("wa");
    setErro("");
    try {
      const response = await fetch("/api/mercadopago/pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, email: cleanEmail }),
      });
      const data = (await response.json()) as PixPayload & { ok?: boolean; reason?: string };
      if (data.ok && data.paymentId && data.qrCode) {
        setPix({ paymentId: data.paymentId, qrCode: data.qrCode, qrImage: data.qrImage || "" });
        return;
      }
      if (data.reason === "unconfigured") {
        setErro("O Pix ainda não está disponível. Chame no WhatsApp que eu te envio a chave.");
        return;
      }
      setErro("Não foi possível gerar o Pix. Tente de novo ou chame no WhatsApp.");
    } catch {
      setErro("Não foi possível gerar o Pix. Tente de novo ou chame no WhatsApp.");
    } finally {
      setBusy("");
    }
  }

  const whatsappComEmail = linkWhatsApp(
    "pagamento",
    `${nome} (${valor}). Meu e-mail é ${emailLimpo() || "—"}. Vou pagar o Pix e enviar o comprovante.`,
  );

  if (pix) {
    return (
      <WhatsAppPixPanel
        serviceId={serviceId}
        nome={nome}
        valor={valor}
        email={emailLimpo()}
        pix={pix}
        whatsapp={whatsappComEmail}
        onBack={() => setPix(null)}
      />
    );
  }

  return (
    <div className="space-y-3">
      <EmailField email={email} onChange={setEmail} />
      <p className="text-xs leading-5 text-branco-lua/55">
        Assim que o Pix ou o cartão for confirmado, o e-mail de pagamento aprovado e o link para
        escolher o dia e o horário chegam neste endereço.
      </p>
      <Button className="w-full" onClick={pagarMercadoPago} disabled={Boolean(busy)}>
        {busy === "mp" ? "Abrindo o Mercado Pago…" : "Pagar no Mercado Pago"}
      </Button>
      <Button className="w-full" variant="contornado" onClick={pagarWhatsApp} disabled={Boolean(busy)}>
        {busy === "wa" ? "Gerando o Pix…" : "Pagar pelo WhatsApp"}
      </Button>
      {erro ? (
        <p className="text-sm text-vermelho-vivo">
          {erro}{" "}
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="underline">
            Abrir WhatsApp
          </a>
        </p>
      ) : null}
    </div>
  );
}

export function Pay({ params }: { params?: { id?: string } } = {}) {
  const routeParams = useParams<{ id?: string }>();
  const searchParams = useSearchParams();
  const id = resolveServiceId(params?.id || routeParams?.id || searchParams.get("servico") || "");
  const servico = useMemo(
    () => priceTable.find((item: { id: string }) => item.id === id),
    [id],
  );
  const whatsapp = servico
    ? linkWhatsApp(
        "pagamento",
        `${servico.nome} (${servico.valor}). Quero pagar e reservar o horário.`,
      )
    : linkWhatsApp("pagamento");

  if (!servico) return <Catalog />;

  return (
    <>
      <Seo
        title={`Pagar ${servico.nome} — Reino de Mulambo`}
        description="Pague a consulta no Mercado Pago e, em seguida, escolha o horário no calendário."
      />
      <section className="page-hero">
        <div className="container-wide">
          <span className="eyebrow">pagamento</span>
          <h1 className="font-display mt-4">Pague para liberar a agenda.</h1>
          <p className="mt-5 max-w-xl text-[1.05rem] leading-7 text-branco-lua/75">
            {servico.nome} · {servico.valor}. Depois do pagamento, você escolhe o dia e o horário.
          </p>
        </div>
      </section>
      <section className="pb-24">
        <div className="container-wide grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:items-start">
          <article className="preco-card">
            <p className="preco-formato">{servico.formato}</p>
            <h2 className="preco-titulo">{servico.nome}</h2>
            <p className="preco-desc">{servico.descricao}</p>
            <p className="preco-tempo">
              <Clock size={14} /> {servico.duracao}
              {servico.disponibilidade ? ` · ${servico.disponibilidade}` : ""}
            </p>
            <p className="preco-valor">{servico.valor}</p>
            <p className="mt-2 text-sm leading-6 text-branco-lua/65">{config.paymentPolicy}</p>
            <ol className="mt-5 space-y-2 text-sm text-branco-lua/70">
              <li>1. Informe o e-mail que vai receber o link da agenda</li>
              <li>2. Pague no Mercado Pago ou no Pix do WhatsApp</li>
              <li>3. Abra o e-mail de confirmação e escolha o horário</li>
            </ol>
            <div className="preco-acoes">
              <CheckoutActions
                serviceId={servico.id}
                nome={servico.nome}
                valor={servico.valor}
                whatsapp={whatsapp}
              />
              <Button href="/agendar" variant="contornado">
                Escolher outro serviço
              </Button>
            </div>
          </article>
          <aside className="rounded-2xl border border-dourado/20 bg-preto-carvao/60 p-6 text-sm leading-7 text-branco-lua/70">
            <p className="font-display text-xl text-branco-lua">Por que pagar antes?</p>
            <p className="mt-3">
              O horário só é reservado depois do pagamento. Assim a agenda não fica ocupada com
              consultas que não se confirmam.
            </p>
            <p className="mt-4">
              No Mercado Pago você paga com Pix ou cartão. No WhatsApp aparece o Pix na hora, com
              QR e copia e cola. Nos dois caminhos o e-mail de pagamento aprovado e o link da agenda
              saem assim que o Pix confirmar.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}

export default Pay;
