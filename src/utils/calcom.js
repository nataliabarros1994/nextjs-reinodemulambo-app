import { config } from "../data/config.js";
import { priceTable } from "../data/services.js";
import { pathToPay } from "./payment.js";

function slugLimpo(slug) {
  return String(slug || "").replace(/^\/+|\/+$/g, "");
}

/** URL pública do evento no Cal.com (agenda só depois do pagamento). */
export function linkCalcom(slug) {
  const usuario = config.calcomUsuario || "reinodemulambo";
  const caminho = slugLimpo(slug);
  const base = caminho
    ? `https://cal.com/${usuario}/${caminho}`
    : `https://cal.com/${usuario}`;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}embed=true&theme=dark&layout=month_view&lang=pt-BR`;
}

export function offerBySlugOrId(chave) {
  const valor = slugLimpo(chave);
  if (!valor) return undefined;
  return priceTable.find((item) => item.id === valor || item.calcomSlug === valor);
}

export function schedulePath(slugOuId) {
  const oferta = offerBySlugOrId(slugOuId);
  return oferta ? pathToPay(oferta.id) : "/agendar";
}
