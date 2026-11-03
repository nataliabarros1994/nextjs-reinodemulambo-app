"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import {
  CONSENT_OPEN_EVENT,
  acceptAllCookies,
  hasStoredConsent,
  openCookiePreferences,
  readConsent,
  rejectNonEssentialCookies,
  writeConsent,
} from "@/lib/cookie-consent";

type Panel = "banner" | "customize";

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<Panel>("banner");
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!hasStoredConsent()) {
      setOpen(true);
      setPanel("banner");
      setAnalytics(false);
      setAdvertising(false);
    }
    const onOpen = () => {
      const current = readConsent();
      setAnalytics(current?.analytics === true);
      setAdvertising(current?.advertising === true);
      setPanel("customize");
      setOpen(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
  }, []);

  if (!mounted || !open) return null;

  const closeAfterChoice = () => {
    setOpen(false);
    setPanel("banner");
  };

  return (
    <div
      className="cookie-consent"
      role="region"
      aria-label="Preferências de cookies"
      aria-live="polite"
    >
      <div className="cookie-consent-card">
        {panel === "banner" ? (
          <>
            <p className="cookie-consent-title">Cookies neste site</p>
            <p className="cookie-consent-copy">
              Usamos cookies e registros necessários para pagamento e agendamento. Cookies de
              métricas e de anúncios só entram com a sua autorização. Nenhuma dessas opções vem
              marcada. Leia a{" "}
              <Link href="/privacidade">Política de Privacidade</Link>.
            </p>
            <div className="cookie-consent-actions">
              <Button
                variant="vermelho"
                onClick={() => {
                  acceptAllCookies();
                  closeAfterChoice();
                }}
              >
                Aceitar
              </Button>
              <Button
                variant="contornado"
                onClick={() => {
                  rejectNonEssentialCookies();
                  closeAfterChoice();
                }}
              >
                Rejeitar
              </Button>
              <Button
                variant="roxo"
                onClick={() => {
                  setAnalytics(false);
                  setAdvertising(false);
                  setPanel("customize");
                }}
              >
                Personalizar
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="cookie-consent-title">Personalizar cookies</p>
            <p className="cookie-consent-copy">
              Escolha o que autoriza. Os cookies necessários continuam ativos para o site
              funcionar. Métricas e publicidade só entram se você marcar e salvar.
            </p>
            <ul className="cookie-consent-options">
              <li>
                <span className="cookie-consent-option-name">Necessários</span>
                <span className="cookie-consent-option-note">Sempre ativos</span>
                <p>
                  Pagamento, agendamento e preferências locais do aparelho. Não pedimos
                  autorização extra para usá-los.
                </p>
              </li>
              <li>
                <label className="cookie-consent-check">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(event) => setAnalytics(event.target.checked)}
                  />
                  <span>
                    <span className="cookie-consent-option-name">Métricas</span>
                    <p>Google Analytics 4, para entender quais páginas são visitadas.</p>
                  </span>
                </label>
              </li>
              <li>
                <label className="cookie-consent-check">
                  <input
                    type="checkbox"
                    checked={advertising}
                    onChange={(event) => setAdvertising(event.target.checked)}
                  />
                  <span>
                    <span className="cookie-consent-option-name">Publicidade</span>
                    <p>Pixel da Meta (Facebook), para medir visitas e apoiar anúncios.</p>
                  </span>
                </label>
              </li>
            </ul>
            <div className="cookie-consent-actions">
              <Button
                variant="vermelho"
                onClick={() => {
                  writeConsent({ analytics, advertising });
                  closeAfterChoice();
                }}
              >
                Salvar preferências
              </Button>
              <Button
                variant="contornado"
                onClick={() => {
                  if (hasStoredConsent()) closeAfterChoice();
                  else setPanel("banner");
                }}
              >
                Voltar
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function OpenCookiePreferences({ className }: { className?: string }) {
  return (
    <button type="button" className={className ? `cookie-prefs-link ${className}` : "cookie-prefs-link"} onClick={openCookiePreferences}>
      Cookies
    </button>
  );
}
