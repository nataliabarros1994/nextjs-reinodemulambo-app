const STORAGE = "mae-natalia-pago";

function idLimpo(servicoId) {
  return String(servicoId || "").replace(/^\/+|\/+$/g, "");
}

/** Checkout interno. O Calendly só abre depois do pagamento. */
export function pathToPay(servicoId) {
  const id = idLimpo(servicoId);
  return id ? `/pagar?servico=${encodeURIComponent(id)}` : "/servicos";
}

/** Agenda liberada após o pagamento. */
export function confirmationPath(servicoId) {
  const id = idLimpo(servicoId);
  return id ? `/pago?servico=${encodeURIComponent(id)}` : "/servicos";
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
