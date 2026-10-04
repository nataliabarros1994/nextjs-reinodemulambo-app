// ============================================================
// ANALYTICS — Utilitários de rastreamento
// ============================================================

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// Google Analytics 4
export function trackGAEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", event, params);
  }
}

// Meta Pixel
export function trackMetaEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", event, params);
  }
}

// Eventos unificados (GA + Meta)
export function trackEvent(event: string, params?: Record<string, unknown>) {
  trackGAEvent(event, params);
  trackMetaEvent(event, params);
}

// Eventos pré-definidos
export const Events = {
  // Conversão
  beginCheckout: (value: number, currency: string = "BRL") =>
    trackEvent("begin_checkout", { value, currency }),
  purchase: (value: number, currency: string = "BRL", transactionId?: string) =>
    trackEvent("purchase", { value, currency, transaction_id: transactionId }),

  // Engajamento
  signUp: (method: string = "email") =>
    trackEvent("sign_up", { method }),
  lead: (source: string) =>
    trackEvent("lead", { source }),
  contact: (method: string) =>
    trackEvent("contact", { method }),

  // Conteúdo
  viewArticle: (slug: string, title: string) =>
    trackEvent("view_article", { slug, title }),
  shareArticle: (slug: string, method: string) =>
    trackEvent("share", { content_type: "article", item_id: slug, method }),

  // Serviços
  viewService: (serviceId: string, serviceName: string) =>
    trackEvent("view_service", { service_id: serviceId, service_name: serviceName }),
  clickWhatsApp: (source: string) =>
    trackEvent("click_whatsapp", { source }),
  clickPrice: (serviceId: string, price: number) =>
    trackEvent("click_price", { service_id: serviceId, price }),

  // Popup
  popupShown: () =>
    trackEvent("popup_shown"),
  popupConverted: () =>
    trackEvent("popup_converted"),
  popupClosed: () =>
    trackEvent("popup_closed"),
};
