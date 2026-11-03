import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import {
  ALLOWED_NEWSLETTER_LIST_ID,
  buildNewsletterClientRequest,
  jsonStatus,
  newsletterDryRun,
  newsletterErrorFromHttp,
  sanitizeKlaviyoErrorText,
  subscribeNewsletter,
} from "./newsletter.ts";

describe("newsletter Lua Nova", () => {
  const previousDry = process.env.KLAVIYO_DRY_RUN;
  const previousList = process.env.KLAVIYO_NEWSLETTER_LIST_ID;
  const previousKey = process.env.KLAVIYO_PUBLIC_KEY;

  afterEach(() => {
    process.env.KLAVIYO_DRY_RUN = previousDry;
    process.env.KLAVIYO_NEWSLETTER_LIST_ID = previousList;
    process.env.KLAVIYO_PUBLIC_KEY = previousKey;
  });

  it("só aceita a lista UZXm8g e o payload Client Subscriptions", () => {
    assert.equal(ALLOWED_NEWSLETTER_LIST_ID, "UZXm8g");
    const request = buildNewsletterClientRequest({
      email: "leitora@example.com",
      source: "home",
      listId: ALLOWED_NEWSLETTER_LIST_ID,
      companyId: "pk_public",
    });
    assert.match(request.url, /\/client\/subscriptions\?company_id=pk_public/);
    const body = request.body as {
      data: { attributes: { profile: { data: { attributes: { email: string } } } }; relationships: { list: { data: { id: string } } } };
    };
    assert.equal(body.data.attributes.profile.data.attributes.email, "leitora@example.com");
    assert.equal(body.data.relationships.list.data.id, "UZXm8g");
    assert.equal(jsonStatus({ ok: true, status: "pending" }), 200);
    assert.equal(jsonStatus({ ok: false, error: "consent_required" }), 400);
    assert.equal(jsonStatus({ ok: false, error: "rate_limited" }), 429);
    assert.equal(newsletterErrorFromHttp(429), "rate_limited");
    assert.equal(sanitizeKlaviyoErrorText("pk_abc123 and a@b.com"), "[redacted] and [redacted-email]");
  });

  it("valida e-mail, consentimento e isca sem chamar a Klaviyo", async () => {
    process.env.KLAVIYO_DRY_RUN = "true";
    assert.equal(newsletterDryRun(), true);

    const invalid = await subscribeNewsletter({ email: "nao-e-email", consent: true, startedAt: Date.now() - 2000 }, "127.0.0.1");
    assert.deepEqual(invalid, { ok: false, error: "invalid_email" });

    const noConsent = await subscribeNewsletter(
      { email: "leitora@example.com", consent: false, startedAt: Date.now() - 2000 },
      "127.0.0.1",
    );
    assert.deepEqual(noConsent, { ok: false, error: "consent_required" });

    const tooFast = await subscribeNewsletter(
      { email: "leitora@example.com", consent: true, startedAt: Date.now() },
      "127.0.0.1",
    );
    assert.deepEqual(tooFast, { ok: false, error: "too_fast" });

    const bot = await subscribeNewsletter(
      { email: "leitora@example.com", consent: true, startedAt: Date.now() - 2000, honeypot: "http://spam" },
      "127.0.0.1",
    );
    assert.deepEqual(bot, { ok: true, status: "pending" });

    const dry = await subscribeNewsletter(
      { email: "leitora@example.com", consent: true, startedAt: Date.now() - 2000 },
      "127.0.0.1",
    );
    assert.deepEqual(dry, { ok: true, status: "pending" });
  });

  it("recusa lista de pagamento/agenda quando não está em dry-run", async () => {
    delete process.env.KLAVIYO_DRY_RUN;
    process.env.KLAVIYO_NEWSLETTER_LIST_ID = "TNQYi4";
    process.env.KLAVIYO_PUBLIC_KEY = "pk_public";
    const blocked = await subscribeNewsletter(
      { email: "leitora@example.com", consent: true, startedAt: Date.now() - 2000 },
      "10.0.0.2",
    );
    assert.deepEqual(blocked, { ok: false, error: "config" });
  });
});
