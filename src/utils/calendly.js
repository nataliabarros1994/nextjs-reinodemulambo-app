import { config } from "../data/config.js";
import { priceTable } from "../data/services.js";
import { pathToPay } from "./payment.js";

const tema =
  "hide_gdpr_banner=1&background_color=0a0a0a&text_color=f5f1e8&primary_color=c9a227";

function slugLimpo(slug) {
  return String(slug || "").replace(/^\/+|\/+$/g, "");
}

/** URL do evento no Calendly, com o tema do site (só para o embed pós-pagamento). */
export function linkCalendly(slug) {
  const usuario = config.calendlyUsuario || "contato-maenatalia";
  const caminho = slugLimpo(slug);
  const base = caminho
    ? `https://calendly.com/${usuario}/${caminho}`
    : `https://calendly.com/${usuario}`;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}${tema}`;
}

export function offerBySlugOrId(chave) {
  const valor = slugLimpo(chave);
  if (!valor) return undefined;
  return priceTable.find((item) => item.id === valor || item.calendlySlug === valor);
}

/** Botões de agendar abrem o Calendly do serviço. */
export function schedulePath(slugOuId) {
  const oferta = offerBySlugOrId(slugOuId);
  return oferta ? pathToPay(oferta.id) : "/agendar";
}
