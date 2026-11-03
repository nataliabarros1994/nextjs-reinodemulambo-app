// ============================================================
// ANALYTICS — Utilitários de rastreamento
// ============================================================

import {
  hasAdvertisingConsent,
  hasAnalyticsConsent,
  sanitizeAnalyticsParams,
} from "@/lib/cookie-consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackGAEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.gtag) return;
  if (!hasAnalyticsConsent()) return;
  window.gtag("event", event, sanitizeAnalyticsParams(params));
}

const META_STANDARD = new Set([
  "PageView",
  "ViewContent",
  "Search",
  "AddToCart",
  "AddToWishlist",
  "InitiateCheckout",
  "AddPaymentInfo",
  "Purchase",
  "Lead",
  "CompleteRegistration",
  "Contact",
  "CustomizeProduct",
  "Donate",
  "FindLocation",
  "Schedule",
  "StartTrial",
  "SubmitApplication",
  "Subscribe",
]);

const META_ALIASES: Record<string, string> = {
  begin_checkout: "InitiateCheckout",
  purchase: "Purchase",
  sign_up: "CompleteRegistration",
  lead: "Lead",
  contact: "Contact",
  view_article: "ViewContent",
  view_service: "ViewContent",
  click_whatsapp: "Contact",
  share: "Share",
};

export function trackMetaEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.fbq) return;
  if (!hasAdvertisingConsent()) return;
  const mapped = META_ALIASES[event] || event;
  const clean = sanitizeAnalyticsParams(params);
  if (META_STANDARD.has(mapped)) {
    window.fbq("track", mapped, clean);
  } else {
    window.fbq("trackCustom", mapped, clean);
  }
}

export function trackEvent(event: string, params?: Record<string, unknown>) {
  trackGAEvent(event, params);
  trackMetaEvent(event, params);
}

export const Events = {
  beginCheckout: (value: number, currency: string = "BRL") =>
    trackEvent("begin_checkout", { value, currency }),
  purchase: (value: number, currency: string = "BRL") =>
    trackEvent("purchase", { value, currency }),
  signUp: (method: string = "email") => trackEvent("sign_up", { method }),
  lead: (source: string) => trackEvent("lead", { source }),
  contact: (method: string) => trackEvent("contact", { method }),
  viewArticle: (slug: string, title: string) =>
    trackEvent("view_article", { slug, title }),
  shareArticle: (slug: string, method: string) =>
    trackEvent("share", { content_type: "article", item_id: slug, method }),
  viewService: (serviceId: string, serviceName: string) =>
    trackEvent("view_service", { service_id: serviceId, service_name: serviceName }),
  clickWhatsApp: (source: string) => trackEvent("click_whatsapp", { source }),
  clickPrice: (serviceId: string, price: number) =>
    trackEvent("click_price", { service_id: serviceId, price }),
  popupShown: () => trackEvent("popup_shown"),
  popupConverted: () => trackEvent("popup_converted"),
  popupClosed: () => trackEvent("popup_closed"),
};
