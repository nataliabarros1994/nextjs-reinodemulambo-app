const STORAGE = "mae-natalia-pago";

const SERVICE_ALIASES = {
  buzios: "buzios-tradicional",
  taro: "taro-texto",
};

function idLimpo(servicoId) {
  return String(servicoId || "").replace(/^\/+|\/+$/g, "");
}

export function resolveServiceId(servicoId) {
  const id = idLimpo(servicoId);
  return SERVICE_ALIASES[id] || id;
}

/** Agenda no Calendly (pagamento Stripe na confirmação do horário). */
export function pathToPay(servicoId) {
  const id = resolveServiceId(servicoId);
  return id ? `/agendar?servico=${encodeURIComponent(id)}` : "/agendar";
}

/** Mesmo destino: a agenda já cobra via Stripe. */
export function confirmationPath(servicoId) {
  return pathToPay(servicoId);
}

export function markPaid(servicoId) {
  if (typeof window === "undefined" || !servicoId) return;
  const atual = lerPagos();
  atual[servicoId] = Date.now();
  sessionStorage.setItem(STORAGE, JSON.stringify(atual));
}

export function hasPayment(servicoId) {
  if (!servicoId) return false;
  return Boolean(lerPagos()[servicoId]);
}

function lerPagos() {
  if (typeof window === "undefined") return {};
  try {
    const bruto = sessionStorage.getItem(STORAGE);
    return bruto ? JSON.parse(bruto) : {};
  } catch {
    return {};
  }
}
