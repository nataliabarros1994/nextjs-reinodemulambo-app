import { config } from "../data/config.js";

const STORAGE = "mae-natalia-pago";
const UNLOCK_MS = 24 * 60 * 60 * 1000;

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

/** Página de pagamento do serviço. Agenda só abre depois do Mercado Pago. */
export function pathToPay(servicoId) {
  const id = resolveServiceId(servicoId);
  return id ? `/pagar/${encodeURIComponent(id)}` : "/agendar";
}

/** Agenda do Cal.com, depois do pagamento confirmado. */
export function confirmationPath(servicoId, sessionId) {
  const id = resolveServiceId(servicoId);
  const base = id ? `/agendar?servico=${encodeURIComponent(id)}` : "/agendar";
  if (!sessionId) return base;
  return `${base}&session_id=${encodeURIComponent(sessionId)}`;
}

export function markPaid(servicoId, sessionId) {
  if (typeof window === "undefined" || !servicoId) return;
  const atual = lerPagos();
  atual[servicoId] = { at: Date.now(), sessionId: sessionId || null };
  sessionStorage.setItem(STORAGE, JSON.stringify(atual));
}

export function hasPayment(servicoId) {
  if (!servicoId) return false;
  const registro = lerPagos()[servicoId];
  if (!registro) return false;
  const at = typeof registro === "number" ? registro : registro.at;
  return Boolean(at) && Date.now() - at < UNLOCK_MS;
}

export function paymentsAreLive() {
  return Boolean(config.paymentsLive);
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
