// ============================================================
// KLAVIYO — o browser só fala com /api/newsletter (sem CORS).
// A chave privada fica no servidor: KLAVIYO_PRIVATE_KEY.
// ============================================================

interface KlaviyoProfile {
  email: string;
  first_name?: string;
  properties?: Record<string, unknown>;
}

interface KlaviyoEvent {
  event: string;
  customer_properties: { email: string };
  properties?: Record<string, unknown>;
}

async function postNewsletter(payload: Record<string, unknown>): Promise<boolean> {
  try {
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function klaviyoSubscribe(profile: KlaviyoProfile): Promise<boolean> {
  return postNewsletter({
    email: profile.email,
    first_name: profile.first_name,
    source: profile.properties?.$source,
  });
}

export async function klaviyoTrackEvent(event: KlaviyoEvent): Promise<boolean> {
  return postNewsletter({
    email: event.customer_properties.email,
    event: event.event,
    properties: event.properties,
  });
}

export const KlaviyoEvents = {
  newsletterSignup: (email: string) =>
    klaviyoSubscribe({ email, properties: { $source: "newsletter" } }),

  discountSignup: (email: string) =>
    klaviyoSubscribe({ email, properties: { $source: "popup-desconto", discount: "10%" } }),

  purchase: (email: string, value: number, serviceName: string) =>
    klaviyoTrackEvent({
      event: "Comprou",
      customer_properties: { email },
      properties: { value, service: serviceName },
    }),

  lead: (email: string, source: string) =>
    klaviyoTrackEvent({
      event: "Lead",
      customer_properties: { email },
      properties: { source },
    }),
};

export function saveEmailLocally(email: string, source: string) {
  const list = JSON.parse(localStorage.getItem("mae-emails") || "[]");
  localStorage.setItem(
    "mae-emails",
    JSON.stringify([...list, { email, at: Date.now(), source }])
  );
}
