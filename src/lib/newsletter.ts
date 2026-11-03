const KLAVIYO_API = "https://a.klaviyo.com";
/**
 * Client Subscriptions na revisão 2024-10-15 usava o schema depreciado
 * OnsiteSubscriptionCreateQueryDeprecatedOct24, sem `subscriptions` no perfil.
 * O payload atual (consent em subscriptions.email.marketing) só é válido na GA
 * 2026-10-15. Enviar 2024-10-15 com esse body tende a 400, mapeado localmente a 503.
 */
const KLAVIYO_REVISION = "2026-10-15";
const MAX_UPSTREAM_LOG_CHARS = 1500;
const SECRET_RE = /pk_[a-zA-Z0-9_]+|Bearer\s+\S+|Klaviyo-API-Key\s+\S+/gi;
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
/** Lista exclusiva da Newsletter Lua Nova. Qualquer outro ID é recusado. */
export const ALLOWED_NEWSLETTER_LIST_ID = "UZXm8g";
/** Segmento e listas de pagamento/agenda — a newsletter não pode usá-las. */
const BLOCKED_LIST_IDS = new Set(["Yz7AcS", "Twsh58", "WiFuzG", "TNQYi4", "TbPVFr"]);
const MIN_SUBMIT_MS = 800;
const IP_WINDOW_MS = 10 * 60 * 1000;
const IP_MAX = 8;
const EMAIL_WINDOW_MS = 60 * 60 * 1000;
const EMAIL_MAX = 3;

export const NEWSLETTER_CONSENT_VERSION = "2026-10-16";
export const NEWSLETTER_CONSENT_TEXT =
  "Aceito receber mensagens espirituais e comunicações do Reino de Mulambo.";

export type NewsletterError =
  | "invalid_email"
  | "consent_required"
  | "rate_limited"
  | "config"
  | "upstream"
  | "too_fast";

export type NewsletterResponse = {
  ok: boolean;
  status?: "pending";
  error?: NewsletterError;
};

export type NewsletterInput = {
  email?: unknown;
  consent?: unknown;
  source?: unknown;
  honeypot?: unknown;
  startedAt?: unknown;
};

export type NewsletterFetch = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

export type KlaviyoErrorSummary = {
  code?: string;
  title?: string;
  detail?: string;
  pointer?: string;
};

type LimitedMap = Map<string, number[]>;
const hitsByIp: LimitedMap = new Map();
const hitsByEmail: LimitedMap = new Map();

export function newsletterDryRun(): boolean {
  // Acesso por colchete: o Next não incorpora o valor no bundle de build.
  const value = String(process.env["KLAVIYO_DRY_RUN"] || "").trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}

export function newsletterListId(): string {
  return String(process.env["KLAVIYO_NEWSLETTER_LIST_ID"] || "").trim();
}

export function newsletterPublicKey(): string {
  return String(process.env["KLAVIYO_PUBLIC_KEY"] || "").trim();
}

/**
 * Client Subscriptions: a Klaviyo trata como opt-in de formulário e, em lista
 * double opt-in, só marca SUBSCRIBED depois do clique no e-mail oficial.
 * O Bulk Subscribe privado (profile-subscription-bulk-create-jobs) concedeu
 * consentimento imediato em 2026-10-22, mesmo com UZXm8g em double opt-in.
 */
export function buildNewsletterClientRequest(input: {
  email: string;
  source: string;
  listId: string;
  companyId: string;
}): { url: string; headers: Record<string, string>; body: unknown } {
  return {
    url: `${KLAVIYO_API}/client/subscriptions?company_id=${encodeURIComponent(input.companyId)}`,
    headers: {
      revision: KLAVIYO_REVISION,
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
    },
    body: {
      data: {
        type: "subscription",
        attributes: {
          custom_source: input.source,
          profile: {
            data: {
              type: "profile",
              attributes: {
                email: input.email,
                subscriptions: {
                  email: { marketing: { consent: "SUBSCRIBED" } },
                },
              },
            },
          },
        },
        relationships: {
          list: { data: { type: "list", id: input.listId } },
        },
      },
    },
  };
}

export function sanitizeKlaviyoErrorText(raw: string): string {
  return raw
    .slice(0, MAX_UPSTREAM_LOG_CHARS)
    .replace(SECRET_RE, "[redacted]")
    .replace(/cookie\s*[:=][^;\n]*/gi, "cookie=[redacted]")
    .replace(EMAIL_RE, "[redacted-email]");
}

export function summarizeKlaviyoErrors(raw: string): KlaviyoErrorSummary[] {
  try {
    const parsed = JSON.parse(raw) as { errors?: unknown };
    if (!Array.isArray(parsed.errors)) return [];
    return parsed.errors.slice(0, 5).map((item) => {
      const error = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
      const source =
        error.source && typeof error.source === "object"
          ? (error.source as Record<string, unknown>)
          : {};
      return {
        code: typeof error.code === "string" ? error.code : undefined,
        title: typeof error.title === "string" ? error.title : undefined,
        detail: typeof error.detail === "string" ? sanitizeKlaviyoErrorText(error.detail) : undefined,
        pointer: typeof source.pointer === "string" ? source.pointer : undefined,
      };
    });
  } catch {
    return [];
  }
}

export function logKlaviyoUpstreamFailure(status: number, raw: string): void {
  const errors = summarizeKlaviyoErrors(raw);
  console.error(
    "[newsletter-klaviyo]",
    JSON.stringify({
      endpoint: "/client/subscriptions",
      revision: KLAVIYO_REVISION,
      status,
      errors,
      body: errors.length ? undefined : sanitizeKlaviyoErrorText(raw),
    }),
  );
}

export function newsletterErrorFromHttp(status: number): NewsletterError {
  if (status === 429) return "rate_limited";
  return "upstream";
}

export function clientIp(request: Request): string {
  const cf = request.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return "unknown";
}

function limited(store: LimitedMap, key: string, windowMs: number, max: number): boolean {
  const now = Date.now();
  const next = (store.get(key) || []).filter((stamp) => now - stamp < windowMs);
  if (next.length >= max) {
    store.set(key, next);
    return true;
  }
  next.push(now);
  store.set(key, next);
  return false;
}

const RATE_CACHE_PREFIX = "https://newsletter-rate.invalid";

function cachesDefault(): Cache | undefined {
  const stores = (globalThis as { caches?: { default?: Cache } }).caches;
  return stores?.default;
}

/** No Worker, o Cache API compartilha o contador entre isolados. Sem KV pago. */
async function limitedDurable(
  store: LimitedMap,
  key: string,
  windowMs: number,
  max: number,
  kind: "ip" | "email",
): Promise<boolean> {
  const cache = cachesDefault();
  if (cache) {
    try {
      const request = new Request(
        `${RATE_CACHE_PREFIX}/${kind}/${encodeURIComponent(key)}`,
      );
      const cached = await cache.match(request);
      const now = Date.now();
      let stamps: number[] = [];
      if (cached) {
        const parsed: unknown = await cached.json().catch(() => []);
        if (Array.isArray(parsed)) {
          stamps = parsed.filter((item): item is number => typeof item === "number");
        }
      }
      stamps = stamps.filter((stamp) => now - stamp < windowMs);
      if (stamps.length >= max) return true;
      stamps.push(now);
      await cache.put(
        request,
        new Response(JSON.stringify(stamps), {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": `max-age=${Math.ceil(windowMs / 1000)}`,
          },
        }),
      );
    } catch {
      // Se o Cache API falhar, o mapa em memória ainda vale neste isolado.
    }
  }
  return limited(store, key, windowMs, max);
}

function isNewsletterEmail(value: string): boolean {
  const email = value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
  if (email.includes("*")) return false;
  if (/^x+@/.test(email)) return false;
  return true;
}

function asBoolean(value: unknown): boolean {
  return value === true || value === "true" || value === "on" || value === "1";
}

function parseStartedAt(value: unknown): number | null {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export function jsonStatus(body: NewsletterResponse): number {
  if (body.ok) return 200;
  if (body.error === "rate_limited") return 429;
  if (body.error === "config" || body.error === "upstream") return 503;
  return 400;
}

export async function subscribeNewsletter(
  input: NewsletterInput,
  ip: string,
  fetcher: NewsletterFetch = fetch,
): Promise<NewsletterResponse> {
  const honeypot = String(input.honeypot ?? "").trim();
  const email = String(input.email ?? "").trim().toLowerCase();
  const consent = asBoolean(input.consent);
  const startedAt = parseStartedAt(input.startedAt);
  const source = String(input.source || "newsletter").trim() || "newsletter";
  const dryRun = newsletterDryRun();

  if (!dryRun && (await limitedDurable(hitsByIp, ip || "unknown", IP_WINDOW_MS, IP_MAX, "ip"))) {
    return { ok: false, error: "rate_limited" };
  }

  if (!isNewsletterEmail(email)) {
    return { ok: false, error: "invalid_email" };
  }

  if (!dryRun && (await limitedDurable(hitsByEmail, email, EMAIL_WINDOW_MS, EMAIL_MAX, "email"))) {
    return { ok: false, error: "rate_limited" };
  }

  if (!consent) {
    return { ok: false, error: "consent_required" };
  }

  const tooFast = startedAt !== null && Date.now() - startedAt < MIN_SUBMIT_MS;
  // Visitante humano rápido (autofill + envio) precisa poder tentar de novo.
  // Responder "pending" aqui mentiria que um e-mail de confirmação foi enviado.
  if (tooFast) {
    return { ok: false, error: "too_fast" };
  }
  // Campo-isca preenchido: bot. Sem chamada à Klaviyo; pending falso de propósito.
  if (honeypot) {
    return { ok: true, status: "pending" };
  }

  if (dryRun) {
    if (email === "simulate-error@reinodemulambo.invalid") {
      return { ok: false, error: "upstream" };
    }
    if (email === "simulate-rate@reinodemulambo.invalid") {
      return { ok: false, error: "rate_limited" };
    }
    return { ok: true, status: "pending" };
  }

  const listId = newsletterListId();
  const companyId = newsletterPublicKey();
  if (
    !companyId ||
    !listId ||
    listId !== ALLOWED_NEWSLETTER_LIST_ID ||
    BLOCKED_LIST_IDS.has(listId)
  ) {
    return { ok: false, error: "config" };
  }

  try {
    const request = buildNewsletterClientRequest({
      email,
      source,
      listId,
      companyId,
    });
    const response = await fetcher(request.url, {
      method: "POST",
      headers: request.headers,
      body: JSON.stringify(request.body),
      signal: AbortSignal.timeout(8000),
    });

    // Só 202 (aceite assíncrono da Client Subscriptions) vira pendente.
    // 409 e demais 4xx/5xx não afirmam envio de e-mail.
    if (response.status === 202) {
      return { ok: true, status: "pending" };
    }

    const raw = await response.text().catch(() => "");
    logKlaviyoUpstreamFailure(response.status, raw);
    return { ok: false, error: newsletterErrorFromHttp(response.status) };
  } catch {
    logKlaviyoUpstreamFailure(0, "timeout_or_network");
    return { ok: false, error: "upstream" };
  }
}
