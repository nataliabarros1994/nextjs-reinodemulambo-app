"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const PIXEL_ID = "1599887461602291";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function MetaPixel() {
  const location = usePathname();

  useEffect(() => {
    // Inicializa o Pixel
    if (!document.getElementById("meta-pixel")) {
      const script = document.createElement("script");
      script.id = "meta-pixel";
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${PIXEL_ID}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);
    }

    // Track page view em cada rota
    if (window.fbq) {
      window.fbq("track", "PageView", { path: location });
    }
  }, [location]);

  return null;
}

// Eventos de conversão
export function trackMetaEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.fbq) return;
  const standard = new Set([
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
  if (standard.has(event)) {
    window.fbq("track", event, data);
  } else {
    window.fbq("trackCustom", event, data);
  }
}

// Eventos pré-definidos
export const MetaEvents = {
  ViewContent: () => trackMetaEvent("ViewContent"),
  AddToCart: (value: number, currency: string = "BRL") =>
    trackMetaEvent("AddToCart", { value, currency }),
  InitiateCheckout: (value: number, currency: string = "BRL") =>
    trackMetaEvent("InitiateCheckout", { value, currency }),
  Purchase: (value: number, currency: string = "BRL", transactionId?: string) =>
    trackMetaEvent("Purchase", { value, currency, transaction_id: transactionId }),
  Lead: () => trackMetaEvent("Lead"),
  CompleteRegistration: () => trackMetaEvent("CompleteRegistration"),
  Contact: () => trackMetaEvent("Contact"),
  Schedule: () => trackMetaEvent("Schedule"),
};
