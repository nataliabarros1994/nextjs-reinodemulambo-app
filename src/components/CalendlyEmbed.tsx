"use client";
import { useEffect, useRef } from "react";

type CalendlyApi = {
  initInlineWidget: (opts: { url: string; parentElement: HTMLElement }) => void;
};

declare global {
  interface Window {
    Calendly?: CalendlyApi;
  }
}

const SCRIPT = "https://assets.calendly.com/assets/external/widget.js";

function carregarScript(): Promise<void> {
  const jaTem = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT}"]`);
  if (window.Calendly?.initInlineWidget) return Promise.resolve();
  if (jaTem) {
    return new Promise((resolve) => {
      jaTem.addEventListener("load", () => resolve(), { once: true });
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Não foi possível carregar o Calendly."));
    document.body.appendChild(script);
  });
}

export function CalendlyEmbed({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ativo = true;

    const onMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || data.event !== "calendly.event_scheduled") return;
      boxRef.current?.classList.add("is-confirmado");
    };
    window.addEventListener("message", onMessage);

    carregarScript()
      .then(() => {
        if (!ativo || !ref.current || !window.Calendly?.initInlineWidget) return;
        ref.current.innerHTML = "";
        window.Calendly.initInlineWidget({
          url,
          parentElement: ref.current,
        });
      })
      .catch(() => {
        /* o link abaixo no JSX cobre o caso de o script não carregar */
      });

    return () => {
      ativo = false;
      window.removeEventListener("message", onMessage);
      if (el) el.innerHTML = "";
    };
  }, [url]);

  return (
    <div>
      <div className="calendly-box" ref={boxRef}>
        <div
          ref={ref}
          className="calendly-inline-widget"
          data-url={url}
          style={{ minWidth: 320, height: "100%" }}
        />
      </div>
      <p className="mt-4 text-center text-sm text-branco-lua/55">
        <a href={url} target="_blank" rel="noreferrer" className="underline decoration-dourado/40 underline-offset-4 hover:text-dourado">
          Se a agenda não carregar, abra o Calendly numa nova aba
        </a>
      </p>
    </div>
  );
}
