// O browser só fala com /api/newsletter.

type NewsletterClientResult = {
  ok: boolean;
  status?: "pending";
  error?: "invalid_email" | "consent_required" | "rate_limited" | "config" | "upstream";
};

type NewsletterSignupInput = {
  email: string;
  consent: boolean;
  honeypot?: string;
  startedAt?: number;
  source?: string;
};

async function postNewsletter(payload: Record<string, unknown>): Promise<NewsletterClientResult> {
  try {
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(12000),
    });
    const body = (await response.json().catch(() => ({}))) as NewsletterClientResult;
    if (typeof body?.ok === "boolean") return body;
    return { ok: false, error: "upstream" };
  } catch {
    return { ok: false, error: "upstream" };
  }
}

export const KlaviyoEvents = {
  newsletterSignup: (input: NewsletterSignupInput) =>
    postNewsletter({
      email: input.email,
      consent: input.consent,
      honeypot: input.honeypot || "",
      startedAt: input.startedAt,
      source: input.source || "newsletter",
    }),
};

export function saveEmailLocally(email: string, source: string) {
  const list = JSON.parse(localStorage.getItem("mae-emails") || "[]");
  localStorage.setItem(
    "mae-emails",
    JSON.stringify([...list, { email, at: Date.now(), source }]),
  );
}
