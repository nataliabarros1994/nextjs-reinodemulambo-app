"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const GA_ID = "G-YEXTQ4NY3E";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function Analytics() {
  const location = usePathname();

  useEffect(() => {
    // Inicializa o GA4
    if (!document.getElementById("ga4-script")) {
      const script = document.createElement("script");
      script.id = "ga4-script";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function (...args: unknown[]) {
        window.dataLayer!.push(args);
      };
      window.gtag("js", new Date());
      window.gtag("config", GA_ID, {
        send_page_view: false, // Manual page view tracking
      });
    }

    // Track page view em cada rota
    if (window.gtag) {
      window.gtag("event", "page_view", {
        page_path: location,
        page_title: document.title,
      });
    }
  }, [location]);

  return null;
}

// Eventos personalizados
export function trackEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", event, params);
  }
}

// Eventos pré-definidos
export const AnalyticsEvents = {
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
};
