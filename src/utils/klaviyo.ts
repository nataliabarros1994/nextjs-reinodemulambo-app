// ============================================================
// KLAVIYO — Integração preparada
// ============================================================
// Para ativar:
// 1. Crie uma conta em https://klaviyo.com
// 2. Crie uma lista (ex: "Newsletter Reino de Mulambo")
// 3. Copie a Public API Key (começa com "pk_")
// 4. Adicione como variável de ambiente: KLAVIYO_PUBLIC_KEY
// 5. Descomente as chamadas de API abaixo
// ============================================================

const KLAVIYO_PUBLIC_KEY = "pk_RnViaz_66d6e14a2829d9a58ad3d615f72526d213";
const KLAVIYO_LIST_ID = "Yz7AcS"; // Lista "New Subscribers"

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

// Adicionar contato à lista
export async function klaviyoSubscribe(profile: KlaviyoProfile): Promise<boolean> {
  if (!KLAVIYO_PUBLIC_KEY || !KLAVIYO_LIST_ID) {
    console.warn("[Klaviyo] Credenciais não configuradas. Salvando localmente.");
    return false;
  }

  try {
    const response = await fetch(
      `https://a.klaviyo.com/api/v2/list/${KLAVIYO_LIST_ID}/subscribe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Klaviyo-API-Key ${KLAVIYO_PUBLIC_KEY}`,
        },
        body: JSON.stringify({
          profiles: [
            {
              email: profile.email,
              first_name: profile.first_name || "",
              properties: {
                $source: "site",
                ...profile.properties,
              },
            },
          ],
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error("[Klaviyo] Erro ao assinar:", error);
    return false;
  }
}

// Rastrear evento
export async function klaviyoTrackEvent(event: KlaviyoEvent): Promise<boolean> {
  if (!KLAVIYO_PUBLIC_KEY) {
    console.warn("[Klaviyo] Credenciais não configuradas.");
    return false;
  }

  try {
    const response = await fetch("https://a.klaviyo.com/api/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Klaviyo-API-Key ${KLAVIYO_PUBLIC_KEY}`,
        },
        body: JSON.stringify({
          token: KLAVIYO_PUBLIC_KEY,
          customer_properties: event.customer_properties,
          event_name: event.event,
          properties: event.properties,
        }),
      });

    return response.ok;
  } catch (error) {
    console.error("[Klaviyo] Erro ao rastrear evento:", error);
    return false;
  }
}

// Eventos pré-definidos
export const KlaviyoEvents = {
  // Newsletter
  newsletterSignup: (email: string) =>
    klaviyoSubscribe({ email, properties: { $source: "newsletter" } }),

  // Popup de desconto
  discountSignup: (email: string) =>
    klaviyoSubscribe({ email, properties: { $source: "popup-desconto", discount: "10%" } }),

  // Compra
  purchase: (email: string, value: number, serviceName: string) =>
    klaviyoTrackEvent({
      event: "Comprou",
      customer_properties: { email },
      properties: { value, service: serviceName },
    }),

  // Lead
  lead: (email: string, source: string) =>
    klaviyoTrackEvent({
      event: "Lead",
      customer_properties: { email },
      properties: { source },
    }),
};

// Fallback: salva localmente quando Klaviyo não está configurado
export function saveEmailLocally(email: string, source: string) {
  const list = JSON.parse(localStorage.getItem("mae-emails") || "[]");
  localStorage.setItem(
    "mae-emails",
    JSON.stringify([...list, { email, at: Date.now(), source }])
  );
}
