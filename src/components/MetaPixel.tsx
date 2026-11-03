"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  CONSENT_CHANGE_EVENT,
  clearAdvertisingCookies,
  hasAdvertisingConsent,
  readConsent,
  sanitizeAnalyticsParams,
  sanitizeAnalyticsPath,
  urlHasSensitiveData,
} from "@/lib/cookie-consent";

const PIXEL_ID = "1599887461602291";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function loadPixel() {
  if (typeof window === "undefined" || document.getElementById("meta-pixel")) {
    return;
  }
  const script = document.createElement("script");
  script.id = "meta-pixel";
  script.text = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('set', 'autoConfig', false, '${PIXEL_ID}');
    fbq('init', '${PIXEL_ID}');
  `;
  document.head.appendChild(script);
}

function unloadPixel() {
  if (typeof document !== "undefined") {
    document.getElementById("meta-pixel")?.remove();
    document
      .querySelectorAll('script[src*="connect.facebook.net"]')
      .forEach((node) => node.remove());
  }
  if (typeof window !== "undefined") {
    window.fbq = undefined;
    window._fbq = undefined;
  }
  clearAdvertisingCookies();
}

export function MetaPixel() {
  const location = usePathname();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const apply = () => {
      const consent = readConsent();
      const ok = hasAdvertisingConsent(consent);
      const sensitive =
        typeof window !== "undefined" && urlHasSensitiveData(window.location.href);
      if (ok && !sensitive) {
        loadPixel();
        setAllowed(true);
        return;
      }
      unloadPixel();
      setAllowed(false);
    };
    apply();
    window.addEventListener(CONSENT_CHANGE_EVENT, apply);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, apply);
  }, [location]);

  useEffect(() => {
    if (!allowed || !window.fbq) return;
    if (urlHasSensitiveData(window.location.href)) return;
    window.fbq("track", "PageView", { content_name: sanitizeAnalyticsPath(location) });
  }, [location, allowed]);

  return null;
}

export function trackMetaEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.fbq) return;
  if (!hasAdvertisingConsent()) return;
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
  const clean = sanitizeAnalyticsParams(data);
  if (standard.has(event)) {
    window.fbq("track", event, clean);
  } else {
    window.fbq("trackCustom", event, clean);
  }
}

export const MetaEvents = {
  ViewContent: () => trackMetaEvent("ViewContent"),
  AddToCart: (value: number, currency: string = "BRL") =>
    trackMetaEvent("AddToCart", { value, currency }),
  InitiateCheckout: (value: number, currency: string = "BRL") =>
    trackMetaEvent("InitiateCheckout", { value, currency }),
  Purchase: (value: number, currency: string = "BRL") =>
    trackMetaEvent("Purchase", { value, currency }),
  Lead: () => trackMetaEvent("Lead"),
  CompleteRegistration: () => trackMetaEvent("CompleteRegistration"),
  Contact: () => trackMetaEvent("Contact"),
  Schedule: () => trackMetaEvent("Schedule"),
};
