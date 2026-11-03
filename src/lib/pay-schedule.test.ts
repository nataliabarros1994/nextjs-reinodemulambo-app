import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { config } from "../data/config.js";
import { catalogPriceTable, priceTable } from "../data/services.js";
import { linkCalcom, offerBySlugOrId, schedulePath } from "../utils/calcom.js";
import {
  confirmationPath,
  pathToPay,
  paymentIdFromSearch,
  resolveServiceId,
} from "../utils/payment.js";
import {
  bookingAccessUrl,
  formatAppointmentWhen,
  isDeliverableEmail,
  offerFromCalcomSlug,
  payerEmailFromPayment,
} from "./booking-mail.ts";
import { appointmentFromCalcomPayload, verifyCalcomSignature } from "./calcom.ts";
import {
  checkoutPreferencePayload,
  checkoutUrl,
  findOffer,
  offerReais,
  paymentUnlocksOffer,
  publicOrigin,
  sessionUnlock,
  verifyMercadoPagoSignature,
} from "./mercadopago.ts";

const EXPECTED = [
  { id: "taro-texto", cents: 6000, reais: 60, slug: "30min-taro-texto", valor: "R$ 60,00" },
  { id: "taro-audio", cents: 8000, reais: 80, slug: "30min-taro-audio", valor: "R$ 80,00" },
  { id: "taro-ligacao", cents: 15000, reais: 150, slug: "30min-ligacao", valor: "R$ 150,00" },
  { id: "taro-video", cents: 18000, reais: 180, slug: "30min-taro-video", valor: "R$ 180,00" },
  { id: "buzios-tradicional", cents: 22000, reais: 220, slug: "30min-buzios", valor: "R$ 220,00" },
  { id: "maria-mulambo", cents: 40000, reais: 400, slug: "40min-maria-mulambo", valor: "R$ 400,00" },
] as const;

function hexOf(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hmacHex(secret: string, message: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return hexOf(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message)));
}

describe("catálogo de consultas", () => {
  it("mantém as seis ofertas públicas e os preços em BRL", () => {
    assert.equal(priceTable.length, 6);
    assert.equal(catalogPriceTable.length, 6);
    assert.equal(
      priceTable.some((item: { id: string }) => item.id === "teste-fluxo"),
      false,
    );
    for (const expected of EXPECTED) {
      const offer = findOffer(expected.id);
      assert.ok(offer, expected.id);
      assert.equal(offer.amountCents, expected.cents);
      assert.equal(offerReais(offer), expected.reais);
      assert.equal(offer.calcomSlug, expected.slug);
      assert.equal(offer.valor, expected.valor);
      assert.equal("calendlySlug" in offer, false);
      assert.equal("stripePaymentUrl" in offer, false);
      assert.equal("stripePaymentLinkId" in offer, false);
    }
    const entidade = findOffer("maria-mulambo");
    assert.equal(entidade?.duracao, "40 minutos");
    assert.equal(config.calcomUsuario, "reinodemulambo");
    assert.equal("calendlyUsuario" in config, false);
    assert.equal("calendly" in config, false);
  });
});

describe("rotas pagar → agendar", () => {
  it("resolve aliases e aponta o pagamento para /pagar/{id}", () => {
    assert.equal(resolveServiceId("buzios"), "buzios-tradicional");
    assert.equal(resolveServiceId("taro"), "taro-texto");
    assert.equal(pathToPay("taro-texto"), "/pagar/taro-texto");
    assert.equal(pathToPay("buzios"), "/pagar/buzios-tradicional");
    assert.equal(pathToPay(""), "/agendar");
    assert.equal(schedulePath("30min-buzios"), "/pagar/buzios-tradicional");
    assert.equal(schedulePath("inexistente"), "/agendar");
  });

  it("monta a URL da agenda com payment_id do Mercado Pago", () => {
    assert.equal(confirmationPath("taro-texto"), "/agendar?servico=taro-texto");
    assert.equal(
      confirmationPath("taro-texto", "182621074725"),
      "/agendar?servico=taro-texto&payment_id=182621074725",
    );
    assert.equal(
      bookingAccessUrl("taro-texto", "182621074725"),
      "https://reinodemulambo.com/agendar?servico=taro-texto&payment_id=182621074725",
    );
  });

  it("lê payment_id e collection_id; ignora session_id do Stripe", () => {
    const params = new URLSearchParams(
      "servico=taro-texto&payment_id=111&collection_id=222&session_id=cs_test_stripe",
    );
    assert.equal(paymentIdFromSearch(params), "111");
    assert.equal(paymentIdFromSearch(new URLSearchParams("collection_id=222")), "222");
    assert.equal(paymentIdFromSearch(new URLSearchParams("session_id=cs_test")), "");
    assert.equal(paymentIdFromSearch({ collection_id: "333" }), "333");
    assert.equal(paymentIdFromSearch(null), "");
  });
});

describe("Cal.com", () => {
  it("mapeia id e slug do catálogo e gera o embed em cal.com", () => {
    assert.equal(offerBySlugOrId("taro-texto")?.id, "taro-texto");
    assert.equal(offerBySlugOrId("30min-taro-texto")?.id, "taro-texto");
    assert.equal(offerBySlugOrId("40min-maria-mulambo")?.id, "maria-mulambo");
    assert.equal(offerFromCalcomSlug("30min-ligacao")?.id, "taro-ligacao");
    assert.equal(offerBySlugOrId("30min-taro-texto-calendly"), undefined);
    const url = linkCalcom("30min-taro-texto");
    assert.match(url, /^https:\/\/cal\.com\/reinodemulambo\/30min-taro-texto\?/);
    assert.match(url, /embed=true/);
    assert.match(url, /lang=pt-BR/);
    assert.equal(url.includes("calendly"), false);
  });

  it("traduz BOOKING_CREATED para o e-mail da consulta", () => {
    const mail = appointmentFromCalcomPayload("BOOKING_CREATED", {
      uid: "abc123",
      type: "30min-taro-texto",
      eventTitle: "Leitura de Tarô por Mensagem (Texto)",
      startTime: "2026-10-13T12:45:00.000Z",
      endTime: "2026-10-13T13:15:00.000Z",
      length: 30,
      attendees: [{ name: "Josue", email: "joshbarrosweb@gmail.com" }],
      organizer: { timeZone: "America/Sao_Paulo" },
      videoCallUrl: "https://app.cal.com/video/abc",
    });
    assert.ok(mail);
    assert.equal(mail.trigger, "created");
    assert.equal(mail.offerName, "Leitura de Tarô por Mensagem (Texto)");
    assert.equal(mail.offerPrice, "R$ 60,00");
    assert.equal(mail.durationLabel, "30 minutos");
    assert.equal(mail.clientEmail, "joshbarrosweb@gmail.com");
    assert.equal(mail.location, "https://app.cal.com/video/abc");
    assert.equal(appointmentFromCalcomPayload("BOOKING_REQUESTED", { startTime: "x", endTime: "y" }), null);
  });

  it("formata dia e horário em português de Brasília", () => {
    const when = formatAppointmentWhen({
      startIso: "2026-10-13T12:45:00.000Z",
      endIso: "2026-10-13T13:15:00.000Z",
      timeZone: "America/Sao_Paulo",
    });
    assert.match(when.dia, /terça-feira/i);
    assert.match(when.dia, /13 de outubro de 2026/);
    assert.equal(when.horario, "9h45 às 10h15");
    assert.equal(when.duracao, "30 minutos");
  });
});

describe("preferência de checkout Mercado Pago", () => {
  it("cobra em reais BRL e devolve para /agendar com o SKU", () => {
    const offer = findOffer("taro-texto");
    assert.ok(offer);
    const payload = checkoutPreferencePayload(offer, "https://reinodemulambo.com", "  Cliente@Email.COM ");
    assert.equal(payload.items[0].unit_price, 60);
    assert.equal(payload.items[0].currency_id, "BRL");
    assert.equal(payload.items[0].quantity, 1);
    assert.equal(payload.external_reference, "taro-texto");
    assert.equal(payload.statement_descriptor, "REINO MULAMBO");
    assert.equal(payload.auto_return, "approved");
    assert.equal(payload.payer?.email, "cliente@email.com");
    assert.equal(payload.metadata.calcomSlug, "30min-taro-texto");
    assert.equal(payload.metadata.serviceId, "taro-texto");
    assert.equal(payload.back_urls.success, "https://reinodemulambo.com/agendar?servico=taro-texto");
    assert.equal(payload.back_urls.pending, payload.back_urls.success);
    assert.equal(payload.back_urls.failure, "https://reinodemulambo.com/pagar/taro-texto");
    assert.equal(payload.notification_url, "https://reinodemulambo.com/api/mercadopago/webhook");
    const semEmail = checkoutPreferencePayload(offer, "https://reinodemulambo.com");
    assert.equal(semEmail.payer, undefined);
  });

  it("troca localhost por reinodemulambo.com nas back_urls", () => {
    const local = publicOrigin(new Request("http://127.0.0.1:3010/api/mercadopago/checkout"));
    assert.equal(local, "https://reinodemulambo.com");
    const live = publicOrigin(new Request("https://reinodemulambo.com/api/mercadopago/checkout"));
    assert.equal(live, "https://reinodemulambo.com");
  });

  it("escolhe sandbox só com token TEST-", () => {
    const preference = {
      init_point: "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=live",
      sandbox_init_point: "https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=test",
    };
    const previous = process.env.MERCADOPAGO_ACCESS_TOKEN;
    process.env.MERCADOPAGO_ACCESS_TOKEN = "APP_USR-x";
    assert.equal(checkoutUrl(preference), preference.init_point);
    process.env.MERCADOPAGO_ACCESS_TOKEN = "TEST-x";
    assert.equal(checkoutUrl(preference), preference.sandbox_init_point);
    process.env.MERCADOPAGO_ACCESS_TOKEN = previous;
  });
});

describe("paymentUnlocksOffer", () => {
  const offer = findOffer("taro-texto")!;

  it("libera só pagamento aprovado, no SKU certo, valor e BRL", () => {
    assert.deepEqual(
      paymentUnlocksOffer(
        { status: "approved", external_reference: "taro-texto", transaction_amount: 60, currency_id: "BRL" },
        offer,
      ),
      { paid: true, pending: false },
    );
    assert.deepEqual(
      paymentUnlocksOffer({ status: "pending", external_reference: "taro-texto", transaction_amount: 60 }, offer),
      { paid: false, pending: true },
    );
    assert.deepEqual(
      paymentUnlocksOffer({ status: "in_process", external_reference: "taro-texto", transaction_amount: 60 }, offer),
      { paid: false, pending: true },
    );
    assert.deepEqual(
      paymentUnlocksOffer({ status: "rejected", external_reference: "taro-texto", transaction_amount: 60 }, offer),
      { paid: false, pending: false },
    );
    assert.deepEqual(
      paymentUnlocksOffer(
        { status: "approved", external_reference: "maria-mulambo", transaction_amount: 60, currency_id: "BRL" },
        offer,
      ),
      { paid: false, pending: false },
    );
    assert.deepEqual(
      paymentUnlocksOffer(
        { status: "approved", external_reference: "taro-texto", transaction_amount: 1, currency_id: "BRL" },
        offer,
      ),
      { paid: false, pending: false },
    );
    assert.deepEqual(
      paymentUnlocksOffer(
        { status: "approved", external_reference: "taro-texto", transaction_amount: 60, currency_id: "USD" },
        offer,
      ),
      { paid: false, pending: false },
    );
  });

  it("aceita referência vazia quando o valor bate com o catálogo", () => {
    assert.deepEqual(
      paymentUnlocksOffer({ status: "approved", transaction_amount: 60, currency_id: "BRL" }, offer),
      { paid: true, pending: false },
    );
  });

  it("não libera teste-fluxo nem valor errado para Maria Mulambo", () => {
    assert.equal(findOffer("teste-fluxo"), undefined);
    const entidade = findOffer("maria-mulambo")!;
    assert.deepEqual(
      paymentUnlocksOffer(
        { status: "approved", external_reference: "maria-mulambo", transaction_amount: 400, currency_id: "BRL" },
        entidade,
      ),
      { paid: true, pending: false },
    );
    assert.deepEqual(
      paymentUnlocksOffer(
        { status: "approved", external_reference: "maria-mulambo", transaction_amount: 60, currency_id: "BRL" },
        entidade,
      ),
      { paid: false, pending: false },
    );
  });
});

describe("assinatura HMAC", () => {
  afterEach(() => {
    delete process.env.MERCADOPAGO_WEBHOOK_SECRET;
    delete process.env.CALCOM_WEBHOOK_SECRET;
  });

  it("Mercado Pago falha aberto sem segredo e fecha com HMAC inválido", async () => {
    delete process.env.MERCADOPAGO_WEBHOOK_SECRET;
    const bare = new Request("https://reinodemulambo.com/api/mercadopago/webhook", { method: "POST" });
    assert.equal(await verifyMercadoPagoSignature(bare, "123"), true);

    process.env.MERCADOPAGO_WEBHOOK_SECRET = "segredo-mp";
    const unsigned = new Request("https://reinodemulambo.com/api/mercadopago/webhook", { method: "POST" });
    assert.equal(await verifyMercadoPagoSignature(unsigned, "123"), false);

    const ts = "1700000000";
    const requestId = "req-1";
    const dataId = "Pay_ABC";
    const v1 = await hmacHex("segredo-mp", `id:${dataId.toLowerCase()};request-id:${requestId};ts:${ts};`);
    const signed = new Request("https://reinodemulambo.com/api/mercadopago/webhook", {
      method: "POST",
      headers: {
        "x-signature": `ts=${ts},v1=${v1}`,
        "x-request-id": requestId,
      },
    });
    assert.equal(await verifyMercadoPagoSignature(signed, dataId), true);
  });

  it("Cal.com falha aberto sem segredo e exige HMAC quando há chave", async () => {
    delete process.env.CALCOM_WEBHOOK_SECRET;
    assert.equal(await verifyCalcomSignature("{}", ""), true);
    process.env.CALCOM_WEBHOOK_SECRET = "segredo-cal";
    assert.equal(await verifyCalcomSignature("{}", ""), false);
    const body = '{"triggerEvent":"BOOKING_CREATED"}';
    const digest = await hmacHex("segredo-cal", body);
    assert.equal(await verifyCalcomSignature(body, digest), true);
    assert.equal(await verifyCalcomSignature(body, `sha256=${digest}`), true);
    assert.equal(await verifyCalcomSignature(body, "deadbeef"), false);
  });
});

describe("e-mail do pagador", () => {
  it("ignora e-mail mascarado do Mercado Pago e lê metadata", () => {
    assert.equal(isDeliverableEmail("cliente@email.com"), true);
    assert.equal(isDeliverableEmail("xxxxxxxxxxx@gmail.com"), false);
    assert.equal(isDeliverableEmail("a*b@email.com"), false);
    assert.equal(
      payerEmailFromPayment({
        payer: { email: "xxxxxxxxxxx@gmail.com" },
        metadata: { payerEmail: "joshbarrosweb@gmail.com" },
      }),
      "joshbarrosweb@gmail.com",
    );
    assert.equal(payerEmailFromPayment({ payer: { email: "xxxxxxxxxxx@gmail.com" } }), "");
  });
});

describe("sessionUnlock", () => {
  const originalFetch = globalThis.fetch;
  const originalToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    process.env.MERCADOPAGO_ACCESS_TOKEN = originalToken;
    process.env.NODE_ENV = originalEnv;
  });

  it("recusa sessão sem pagamento ou com serviço desconhecido", async () => {
    const missing = await sessionUnlock("taro-texto", paymentIdFromSearch(new URLSearchParams("servico=taro-texto")));
    assert.equal(missing.status, 400);
    assert.equal(missing.body.paid, false);

    const unknown = await sessionUnlock("teste-fluxo", "1");
    assert.equal(unknown.status, 400);

    const stripeAlias = await sessionUnlock(
      "taro-texto",
      paymentIdFromSearch(new URLSearchParams("session_id=cs_test")),
    );
    assert.equal(stripeAlias.status, 400);
  });

  it("aceita o atalho de desenvolvimento payment_id=test", async () => {
    process.env.NODE_ENV = "test";
    const response = await sessionUnlock("taro-texto", "test");
    assert.equal(response.status, 200);
    assert.equal(response.body.paid, true);
    assert.equal(response.body.dev, true);
  });

  it("consulta o pagamento mockado e só libera o SKU pago", async () => {
    process.env.NODE_ENV = "production";
    process.env.MERCADOPAGO_ACCESS_TOKEN = "APP_USR-fake";
    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const url = String(input);
      assert.match(url, /\/v1\/payments\/999$/);
      return new Response(
        JSON.stringify({
          id: 999,
          status: "approved",
          external_reference: "taro-texto",
          transaction_amount: 60,
          currency_id: "BRL",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }) as typeof fetch;

    const collectionId = paymentIdFromSearch(new URLSearchParams("collection_id=999"));
    const ok = await sessionUnlock("taro-texto", collectionId);
    assert.equal(ok.status, 200);
    assert.deepEqual(ok.body, { ok: true, paid: true, pending: false });

    const wrongSku = await sessionUnlock("maria-mulambo", "999");
    assert.equal(wrongSku.status, 200);
    assert.equal(wrongSku.body.paid, false);
  });
});
