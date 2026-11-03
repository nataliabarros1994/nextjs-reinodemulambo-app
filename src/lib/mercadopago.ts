import { priceTable } from "@/data/services.js";

const MP_API = "https://api.mercadopago.com";
const SITE_ORIGIN = "https://reinodemulambo.com";

export type PriceOffer = (typeof priceTable)[number];

export function findOffer(serviceId: string): PriceOffer | undefined {
  return priceTable.find((item: PriceOffer) => item.id === serviceId);
}

export function mercadoPagoAccessToken(): string {
  return process.env.MERCADOPAGO_ACCESS_TOKEN || "";
}

export function requestOrigin(request: Request): string {
  const url = new URL(request.url);
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || url.host;
  const proto = request.headers.get("x-forwarded-proto") || (url.protocol === "https:" ? "https" : "http");
  return `${proto}://${host}`;
}

/** Mercado Pago rejects localhost in back_urls. */
export function publicOrigin(request: Request): string {
  const origin = requestOrigin(request);
  if (/localhost|127\.0\.0\.1|\[::1\]/i.test(origin)) return SITE_ORIGIN;
  return origin;
}

export function offerReais(offer: PriceOffer): number {
  return Math.round(Number(offer.amountCents)) / 100;
}

export function checkoutPreferencePayload(offer: PriceOffer, origin: string, payerEmail = "") {
  const reais = offerReais(offer);
  const success = `${origin}/agendar?servico=${encodeURIComponent(offer.id)}`;
  const failure = `${origin}/pagar/${encodeURIComponent(offer.id)}`;
  const email = payerEmail.trim().toLowerCase();
  return {
    items: [
      {
        id: offer.id,
        title: offer.nome,
        description: offer.descricao,
        quantity: 1,
        currency_id: "BRL",
        unit_price: reais,
        category_id: "services",
      },
    ],
    statement_descriptor: "REINO MULAMBO",
    external_reference: offer.id,
    payer: email ? { email } : undefined,
    metadata: {
      serviceId: offer.id,
      calcomSlug: offer.calcomSlug,
      payerEmail: email,
    },
    back_urls: { success, pending: success, failure },
    auto_return: "approved" as const,
    notification_url: `${origin}/api/mercadopago/webhook`,
    expires: false,
  };
}

async function mpFetch(path: string, init?: RequestInit) {
  const token = mercadoPagoAccessToken();
  if (!token) throw new Error("missing_mercadopago_token");
  const response = await fetch(`${MP_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers || {}),
    },
  });
  const json = (await response.json()) as Record<string, unknown>;
  if (!response.ok) {
    const message =
      (json.message as string) ||
      (json.error as string) ||
      ((json.cause as { description?: string }[] | undefined)?.[0]?.description) ||
      `mercadopago_${response.status}`;
    throw new Error(message);
  }
  return json;
}

export async function createPreference(offer: PriceOffer, origin: string, payerEmail = "") {
  return mpFetch("/checkout/preferences", {
    method: "POST",
    headers: { "X-Idempotency-Key": crypto.randomUUID() },
    body: JSON.stringify(checkoutPreferencePayload(offer, origin, payerEmail)),
  });
}

export async function createPixPayment(offer: PriceOffer, origin: string, payerEmail: string) {
  const reais = offerReais(offer);
  const email = payerEmail.trim().toLowerCase();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  return mpFetch("/v1/payments", {
    method: "POST",
    headers: { "X-Idempotency-Key": crypto.randomUUID() },
    body: JSON.stringify({
      transaction_amount: reais,
      description: offer.nome,
      payment_method_id: "pix",
      date_of_expiration: expires,
      payer: { email },
      external_reference: offer.id,
      metadata: {
        serviceId: offer.id,
        calcomSlug: offer.calcomSlug,
        payerEmail: email,
        channel: "whatsapp",
      },
      notification_url: `${origin}/api/mercadopago/webhook`,
    }),
  });
}

export function pixCopyFromPayment(payment: Record<string, unknown>): {
  paymentId: string;
  qrCode: string;
  qrImage: string;
} {
  const poi = (payment.point_of_interaction || {}) as Record<string, unknown>;
  const data = (poi.transaction_data || {}) as Record<string, unknown>;
  return {
    paymentId: String(payment.id || ""),
    qrCode: String(data.qr_code || ""),
    qrImage: String(data.qr_code_base64 || ""),
  };
}

export async function retrievePayment(paymentId: string) {
  return mpFetch(`/v1/payments/${encodeURIComponent(paymentId)}`);
}

export async function retrieveMerchantOrder(orderId: string) {
  return mpFetch(`/merchant_orders/${encodeURIComponent(orderId)}`);
}

export async function retrievePreference(preferenceId: string) {
  return mpFetch(`/checkout/preferences/${encodeURIComponent(preferenceId)}`);
}

export function checkoutUrl(preference: Record<string, unknown>): string {
  const live = typeof preference.init_point === "string" ? preference.init_point : "";
  const sandbox = typeof preference.sandbox_init_point === "string" ? preference.sandbox_init_point : "";
  const token = mercadoPagoAccessToken();
  if (token.startsWith("TEST-")) return sandbox || live;
  return live || sandbox;
}

export type SessionUnlock = {
  status: number;
  body: { ok: boolean; paid: boolean; pending: boolean; reason?: string; dev?: boolean };
};

/** Prova de pagamento para abrir a agenda. Sem chamada de rede quando o id falta. */
export async function sessionUnlock(serviceId: string, paymentId: string): Promise<SessionUnlock> {
  const offer = findOffer(serviceId);
  if (!paymentId || !offer) {
    return { status: 400, body: { ok: false, paid: false, pending: false } };
  }
  if (process.env.NODE_ENV !== "production" && paymentId === "test") {
    return { status: 200, body: { ok: true, paid: true, pending: false, dev: true } };
  }
  if (!mercadoPagoAccessToken()) {
    return { status: 503, body: { ok: false, paid: false, pending: false, reason: "unconfigured" } };
  }
  try {
    const payment = await retrievePayment(paymentId);
    const result = paymentUnlocksOffer(payment, offer);
    return { status: 200, body: { ok: true, ...result } };
  } catch {
    return { status: 502, body: { ok: false, paid: false, pending: false } };
  }
}

export function paymentUnlocksOffer(
  payment: Record<string, unknown>,
  offer: PriceOffer,
): { paid: boolean; pending: boolean } {
  const status = String(payment.status || "");
  if (status === "pending" || status === "in_process") {
    return { paid: false, pending: true };
  }
  if (status !== "approved") {
    return { paid: false, pending: false };
  }
  const reference = String(payment.external_reference || "");
  if (reference && reference !== offer.id) {
    return { paid: false, pending: false };
  }
  const amount = Number(payment.transaction_amount);
  const expected = offerReais(offer);
  if (Number.isFinite(amount) && Math.abs(amount - expected) > 0.009) {
    return { paid: false, pending: false };
  }
  const currency = String(payment.currency_id || "BRL").toUpperCase();
  if (currency && currency !== "BRL") {
    return { paid: false, pending: false };
  }
  return { paid: true, pending: false };
}

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

export async function verifyMercadoPagoSignature(request: Request, dataId: string) {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET || "";
  if (!secret) return true;
  const header = request.headers.get("x-signature") || "";
  const requestId = request.headers.get("x-request-id") || "";
  const parts = Object.fromEntries(
    header.split(",").map((item) => {
      const [k, ...rest] = item.split("=");
      return [k.trim(), rest.join("=")];
    }),
  );
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;
  const id = dataId.toLowerCase();
  const manifest = `id:${id};request-id:${requestId};ts:${ts};`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(manifest));
  return timingSafeEqual(toHex(signed), v1);
}
