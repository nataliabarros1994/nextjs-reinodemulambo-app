import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import {
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  acceptAllCookies,
  clearFirstPartyTrackerCookies,
  defaultDeniedConsent,
  hasAdvertisingConsent,
  hasAnalyticsConsent,
  isSensitiveParamKey,
  isSensitiveValue,
  parseConsent,
  readConsent,
  rejectNonEssentialCookies,
  sanitizeAnalyticsParams,
  sanitizeAnalyticsPath,
  sanitizePageLocation,
  urlHasSensitiveData,
  writeConsent,
} from "./cookie-consent.ts";

class MemoryStorage {
  store = new Map<string, string>();
  get length() {
    return this.store.size;
  }
  clear() {
    this.store.clear();
  }
  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  key(index: number) {
    return [...this.store.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.store.delete(key);
  }
  setItem(key: string, value: string) {
    this.store.set(key, String(value));
  }
}

const memory = new MemoryStorage();

beforeEach(() => {
  memory.clear();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: memory,
  });
});

afterEach(() => {
  memory.clear();
});

describe("parseConsent", () => {
  it("returns null for missing, invalid or outdated records", () => {
    assert.equal(parseConsent(null), null);
    assert.equal(parseConsent("{"), null);
    assert.equal(parseConsent(JSON.stringify({ version: 0, analytics: true, advertising: true, updatedAt: "x" })), null);
    assert.equal(parseConsent(JSON.stringify({ version: CONSENT_VERSION, analytics: "yes", advertising: false, updatedAt: "x" })), null);
  });

  it("reads a valid stored choice", () => {
    const record = parseConsent(
      JSON.stringify({
        version: CONSENT_VERSION,
        analytics: true,
        advertising: false,
        updatedAt: "2026-10-24T12:00:00.000Z",
      }),
    );
    assert.deepEqual(record, {
      version: CONSENT_VERSION,
      necessary: true,
      analytics: true,
      advertising: false,
      updatedAt: "2026-10-24T12:00:00.000Z",
    });
  });
});

describe("writeConsent", () => {
  it("stores accept, reject and customize without pre-enabling categories", () => {
    assert.equal(readConsent(), null);
    assert.equal(hasAnalyticsConsent(), false);
    assert.equal(hasAdvertisingConsent(), false);

    const denied = defaultDeniedConsent("2026-10-24T00:00:00.000Z");
    assert.equal(denied.analytics, false);
    assert.equal(denied.advertising, false);
    assert.equal(denied.necessary, true);

    const accepted = acceptAllCookies();
    assert.equal(accepted.analytics, true);
    assert.equal(accepted.advertising, true);
    assert.equal(hasAnalyticsConsent(), true);
    assert.equal(hasAdvertisingConsent(), true);

    const rejected = rejectNonEssentialCookies();
    assert.equal(rejected.analytics, false);
    assert.equal(rejected.advertising, false);
    assert.equal(hasAnalyticsConsent(), false);
    assert.equal(hasAdvertisingConsent(), false);

    const custom = writeConsent({ analytics: true, advertising: false });
    assert.equal(custom.analytics, true);
    assert.equal(custom.advertising, false);
    assert.equal(JSON.parse(memory.getItem(CONSENT_STORAGE_KEY) || "{}").analytics, true);
  });

  it("persists the choice so a later read sees the same decision", () => {
    writeConsent({ analytics: false, advertising: true });
    const again = readConsent();
    assert.equal(again?.analytics, false);
    assert.equal(again?.advertising, true);
    assert.equal(again?.necessary, true);
  });
});

describe("sanitizeAnalyticsPath and params", () => {
  it("drops query strings and access tokens from paths", () => {
    assert.equal(sanitizeAnalyticsPath("/agendar"), "/agendar");
    assert.equal(sanitizeAnalyticsPath("/agendar?t=gex_abcdefghijklmnopqrstuvwxyz012345"), "/agendar");
    assert.equal(sanitizeAnalyticsPath("/pago?payment_id=1234567890"), "/pago");
    assert.equal(sanitizeAnalyticsPath("/pagar/taro-texto"), "/pagar/taro-texto");
    assert.equal(
      sanitizeAnalyticsPath("/agendar/gex_abcdefghijklmnopqrstuvwxyz012345"),
      "/agendar/[redacted]",
    );
  });

  it("builds a page location without sensitive query params", () => {
    assert.equal(
      sanitizePageLocation(
        "https://reinodemulambo.com/agendar?t=gex_abcdefghijklmnopqrstuvwxyz012345&servico=taro-texto",
      ),
      "https://reinodemulambo.com/agendar",
    );
  });

  it("strips payment ids, emails, tokens, recovery and consultation fields", () => {
    const cleaned = sanitizeAnalyticsParams({
      slug: "o-que-e-jogo-de-buzios",
      title: "O que é jogo de búzios",
      transaction_id: "1234567890",
      payment_id: "999",
      email: "cliente@example.com",
      t: "gex_abcdefghijklmnopqrstuvwxyz012345",
      pergunta: "sobre um trabalho espiritual",
      consulta: "conteúdo da consulta",
      source: "blog",
    });
    assert.deepEqual(cleaned, {
      slug: "o-que-e-jogo-de-buzios",
      title: "O que é jogo de búzios",
      source: "blog",
    });
  });

  it("detects sensitive URLs used by scheduling and payment return", () => {
    assert.equal(urlHasSensitiveData("https://reinodemulambo.com/servicos"), false);
    assert.equal(urlHasSensitiveData("https://reinodemulambo.com/pagar/taro-texto"), false);
    assert.equal(urlHasSensitiveData("https://reinodemulambo.com/agendar?t=gex_abcdefghijklmnopqrstuvwxyz012345"), true);
    assert.equal(urlHasSensitiveData("https://reinodemulambo.com/pago?payment_id=123"), true);
    assert.equal(urlHasSensitiveData("/agendar?email=a@b.com"), true);
    assert.equal(isSensitiveParamKey("payment_id"), true);
    assert.equal(isSensitiveParamKey("slug"), false);
    assert.equal(isSensitiveValue("gex_abcdefghijklmnopqrstuvwxyz012345"), true);
    assert.equal(isSensitiveValue("cliente@example.com"), true);
    assert.equal(isSensitiveValue("taro-texto"), false);
  });
});

describe("clearFirstPartyTrackerCookies", () => {
  it("expires first-party tracker cookies and leaves unrelated cookies", () => {
    const jar = new Map<string, string>([
      ["_ga", "GA1.1.1"],
      ["_ga_YEXTQ4NY3E", "GS1.1"],
      ["_fbp", "fb.1.1"],
      ["reino_grant", "keep-me"],
    ]);
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: {
        get cookie() {
          return [...jar.entries()].map(([name, value]) => `${name}=${value}`).join("; ");
        },
        set cookie(value: string) {
          const [pair] = value.split(";");
          const [name, raw] = pair.split("=");
          const trimmed = name.trim();
          if (/expires=Thu, 01 Jan 1970/i.test(value) || raw === "") jar.delete(trimmed);
          else jar.set(trimmed, raw);
        },
      },
    });
    Object.defineProperty(globalThis, "location", {
      configurable: true,
      value: { hostname: "127.0.0.1" },
    });

    clearFirstPartyTrackerCookies();
    assert.equal(jar.has("_ga"), false);
    assert.equal(jar.has("_ga_YEXTQ4NY3E"), false);
    assert.equal(jar.has("_fbp"), false);
    assert.equal(jar.get("reino_grant"), "keep-me");
  });
});
