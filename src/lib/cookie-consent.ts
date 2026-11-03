/**
 * Cookie consent for Reino de Mulambo.
 *
 * Necessary cookies (payment, authentication, scheduling) stay on.
 * Analytics (GA4) and advertising (Meta Pixel) load only after an explicit
 * stored choice that enables the matching category.
 */

export const CONSENT_STORAGE_KEY = "reino_cookie_consent";
export const CONSENT_VERSION = 1;
export const CONSENT_CHANGE_EVENT = "reino-cookie-consent";
export const CONSENT_OPEN_EVENT = "reino-cookie-consent-open";

export type ConsentRecord = {
  version: number;
  necessary: true;
  analytics: boolean;
  advertising: boolean;
  updatedAt: string;
};

export type ConsentChoice = {
  analytics: boolean;
  advertising: boolean;
};

const SENSITIVE_PARAM_KEYS = new Set([
  "t",
  "token",
  "access_token",
  "exchange",
  "grant",
  "grant_id",
  "grantid",
  "payment_id",
  "paymentid",
  "payment",
  "transaction_id",
  "transactionid",
  "email",
  "payer_email",
  "payeremail",
  "e-mail",
  "mail",
  "phone",
  "telefone",
  "whatsapp",
  "name",
  "nome",
  "recovery",
  "code",
  "otp",
  "session",
  "session_id",
  "sessionid",
  "uid",
  "user",
  "user_id",
  "userid",
  "consulta",
  "pergunta",
  "conteudo",
  "content",
  "message",
  "mensagem",
  "crenca",
  "crença",
  "belief",
  "religion",
  "religiao",
  "religião",
  "intencao",
  "intenção",
  "card",
  "card_id",
  "cvv",
]);

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const ACCESS_TOKEN_RE = /\b(gex_|gat_)[A-Za-z0-9_-]{16,}/i;
const TRACKER_COOKIE_RE = /^(_ga|_ga_|_gid|_gat|_fbp|_fbc|fr)/i;

function storage(): Storage | null {
  try {
    if (typeof globalThis.localStorage === "undefined") return null;
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

export function defaultDeniedConsent(updatedAt = new Date().toISOString()): ConsentRecord {
  return {
    version: CONSENT_VERSION,
    necessary: true,
    analytics: false,
    advertising: false,
    updatedAt,
  };
}

export function parseConsent(raw: string | null | undefined): ConsentRecord | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ConsentRecord>;
    if (parsed.version !== CONSENT_VERSION) return null;
    if (typeof parsed.analytics !== "boolean") return null;
    if (typeof parsed.advertising !== "boolean") return null;
    if (typeof parsed.updatedAt !== "string" || !parsed.updatedAt) return null;
    return {
      version: CONSENT_VERSION,
      necessary: true,
      analytics: parsed.analytics,
      advertising: parsed.advertising,
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return null;
  }
}

export function readConsent(): ConsentRecord | null {
  return parseConsent(storage()?.getItem(CONSENT_STORAGE_KEY) ?? null);
}

export function hasStoredConsent(): boolean {
  return readConsent() !== null;
}

export function hasAnalyticsConsent(record: ConsentRecord | null = readConsent()): boolean {
  return record?.analytics === true;
}

export function hasAdvertisingConsent(record: ConsentRecord | null = readConsent()): boolean {
  return record?.advertising === true;
}

function persist(record: ConsentRecord): ConsentRecord {
  storage()?.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: record }));
  }
  if (!record.analytics && !record.advertising) {
    clearFirstPartyTrackerCookies();
  } else {
    if (!record.analytics) clearAnalyticsCookies();
    if (!record.advertising) clearAdvertisingCookies();
  }
  return record;
}

export function writeConsent(choice: ConsentChoice): ConsentRecord {
  return persist({
    version: CONSENT_VERSION,
    necessary: true,
    analytics: Boolean(choice.analytics),
    advertising: Boolean(choice.advertising),
    updatedAt: new Date().toISOString(),
  });
}

export function acceptAllCookies(): ConsentRecord {
  return writeConsent({ analytics: true, advertising: true });
}

export function rejectNonEssentialCookies(): ConsentRecord {
  return writeConsent({ analytics: false, advertising: false });
}

export function openCookiePreferences(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT));
}

export function isSensitiveParamKey(key: string): boolean {
  return SENSITIVE_PARAM_KEYS.has(key.trim().toLowerCase());
}

export function isSensitiveValue(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  return EMAIL_RE.test(trimmed) || ACCESS_TOKEN_RE.test(trimmed);
}

export function sanitizeAnalyticsPath(input: string): string {
  if (!input) return "/";
  try {
    const origin = "https://reinodemulambo.com";
    const url = input.startsWith("http://") || input.startsWith("https://")
      ? new URL(input)
      : new URL(input, origin);
    let pathname = url.pathname || "/";
    pathname = pathname.replace(ACCESS_TOKEN_RE, "[redacted]");
    if (!pathname.startsWith("/")) pathname = `/${pathname}`;
    return pathname;
  } catch {
    const pathOnly = input.split(/[?#]/)[0] || "/";
    return pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`;
  }
}

export function sanitizePageLocation(href: string, origin?: string): string {
  const path = sanitizeAnalyticsPath(href);
  if (origin) return `${origin.replace(/\/$/, "")}${path}`;
  try {
    const url = new URL(href);
    return `${url.origin}${path}`;
  } catch {
    return path;
  }
}

export function urlHasSensitiveData(href: string): boolean {
  try {
    const origin = "https://reinodemulambo.com";
    const url = href.startsWith("http://") || href.startsWith("https://")
      ? new URL(href)
      : new URL(href, origin);
    if (ACCESS_TOKEN_RE.test(url.pathname) || EMAIL_RE.test(url.pathname)) return true;
    if (ACCESS_TOKEN_RE.test(url.hash) || EMAIL_RE.test(url.hash)) return true;
    for (const [key, value] of url.searchParams.entries()) {
      if (isSensitiveParamKey(key) || isSensitiveValue(value)) return true;
    }
    return false;
  } catch {
    return ACCESS_TOKEN_RE.test(href) || EMAIL_RE.test(href);
  }
}

export function sanitizeAnalyticsParams(
  params?: Record<string, unknown>,
): Record<string, unknown> | undefined {
  if (!params) return undefined;
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    if (isSensitiveParamKey(key)) continue;
    if (isSensitiveValue(value)) continue;
    if (key === "page_path" && typeof value === "string") {
      clean[key] = sanitizeAnalyticsPath(value);
      continue;
    }
    if (key === "page_location" && typeof value === "string") {
      clean[key] = sanitizePageLocation(value);
      continue;
    }
    clean[key] = value;
  }
  return clean;
}

function expireCookie(name: string): void {
  if (typeof document === "undefined") return;
  const expire = "Thu, 01 Jan 1970 00:00:00 GMT";
  const host = typeof location !== "undefined" ? location.hostname : "";
  document.cookie = `${name}=; expires=${expire}; path=/`;
  if (host) {
    document.cookie = `${name}=; expires=${expire}; path=/; domain=${host}`;
    document.cookie = `${name}=; expires=${expire}; path=/; domain=.${host}`;
  }
}

function cookieNames(): string[] {
  if (typeof document === "undefined" || !document.cookie) return [];
  return document.cookie
    .split(";")
    .map((part) => part.split("=")[0]?.trim())
    .filter((name): name is string => Boolean(name));
}

export function clearAnalyticsCookies(): void {
  for (const name of cookieNames()) {
    if (/^(_ga|_ga_|_gid|_gat)/i.test(name)) expireCookie(name);
  }
}

export function clearAdvertisingCookies(): void {
  for (const name of cookieNames()) {
    if (/^(_fbp|_fbc|fr)/i.test(name)) expireCookie(name);
  }
}

export function clearFirstPartyTrackerCookies(): void {
  for (const name of cookieNames()) {
    if (TRACKER_COOKIE_RE.test(name)) expireCookie(name);
  }
}
