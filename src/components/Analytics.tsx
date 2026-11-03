"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  CONSENT_CHANGE_EVENT,
  clearAnalyticsCookies,
  hasAnalyticsConsent,
  readConsent,
  sanitizeAnalyticsParams,
  sanitizeAnalyticsPath,
  sanitizePageLocation,
  urlHasSensitiveData,
} from "@/lib/cookie-consent";

const GA_ID = "G-YEXTQ4NY3E";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function loadGa() {
  if (typeof window === "undefined") return;
  if (document.getElementById("ga4-script") && window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  if (!document.getElementById("ga4-script")) {
    const script = document.createElement("script");
    script.id = "ga4-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, {
      send_page_view: false,
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
  }
}

function unloadGa() {
  if (typeof document !== "undefined") {
    document.getElementById("ga4-script")?.remove();
    document
      .querySelectorAll('script[src*="googletagmanager.com"],script[src*="google-analytics.com"]')
      .forEach((node) => node.remove());
  }
  if (typeof window !== "undefined") {
    window.gtag = undefined;
    window.dataLayer = [];
  }
  clearAnalyticsCookies();
}

export function Analytics() {
  const location = usePathname();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const apply = () => {
      const consent = readConsent();
      const ok = hasAnalyticsConsent(consent);
      const sensitive =
        typeof window !== "undefined" && urlHasSensitiveData(window.location.href);
      if (ok && !sensitive) {
        loadGa();
        setAllowed(true);
        return;
      }
      unloadGa();
      setAllowed(false);
    };
    apply();
    window.addEventListener(CONSENT_CHANGE_EVENT, apply);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, apply);
  }, [location]);

  useEffect(() => {
    if (!allowed || !window.gtag) return;
    if (urlHasSensitiveData(window.location.href)) return;
    const path = sanitizeAnalyticsPath(location);
    window.gtag("event", "page_view", {
      page_path: path,
      page_title: document.title,
      page_location: sanitizePageLocation(`${window.location.origin}${path}`, window.location.origin),
    });
  }, [location, allowed]);

  return null;
}

export function trackEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.gtag) return;
  if (!hasAnalyticsConsent()) return;
  window.gtag("event", event, sanitizeAnalyticsParams(params));
}

export const AnalyticsEvents = {
  beginCheckout: (value: number, currency: string = "BRL") =>
    trackEvent("begin_checkout", { value, currency }),
  purchase: (value: number, currency: string = "BRL") =>
    trackEvent("purchase", { value, currency }),
  signUp: (method: string = "email") => trackEvent("sign_up", { method }),
  lead: (source: string) => trackEvent("lead", { source }),
  contact: (method: string) => trackEvent("contact", { method }),
  viewArticle: (slug: string, title: string) => trackEvent("view_article", { slug, title }),
  shareArticle: (slug: string, method: string) =>
    trackEvent("share", { content_type: "article", item_id: slug, method }),
  viewService: (serviceId: string, serviceName: string) =>
    trackEvent("view_service", { service_id: serviceId, service_name: serviceName }),
  clickWhatsApp: (source: string) => trackEvent("click_whatsapp", { source }),
  clickPrice: (serviceId: string, price: number) =>
    trackEvent("click_price", { service_id: serviceId, price }),
};
