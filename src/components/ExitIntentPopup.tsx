"use client";
import { useEffect, useState } from "react";
import { X, Gift } from "lucide-react";
import { Button } from "@/components/Button";

const STORAGE_KEY = "mae-popup-desconto";

export function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;

    const showPopup = () => {
      setVisible(true);
      localStorage.setItem(STORAGE_KEY, "1");
    };

    // Exit intent: mouse sai da área visível (desktop)
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !localStorage.getItem(STORAGE_KEY)) {
        showPopup();
      }
    };

    // Fallback mobile: mostra após 30s se não fechou
    const timer = setTimeout(() => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        showPopup();
      }
    }, 30000);

    document.addEventListener("mouseleave", onMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      clearTimeout(timer);
    };
  }, []);

  const close = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "1");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Salva no localStorage (integração com Klaviyo via API)
    const list = JSON.parse(localStorage.getItem("mae-emails") || "[]");
    localStorage.setItem("mae-emails", JSON.stringify([...list, { email, at: Date.now(), source: "popup-desconto" }]));
    setDone(true);
    setTimeout(close, 2000);
  };

  if (!visible) return null;

  return (
    <div className="modal-backdrop" onClick={close} role="dialog" aria-modal="true" aria-label="Popup de desconto">
      <div className="modal-card text-center" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={close}
          className="absolute top-4 right-4 text-branco-lua/50 hover:text-branco-lua transition"
          aria-label="Fechar popup"
        >
          <X size={20} />
        </button>

        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-dourado/15">
          <Gift size={28} className="text-dourado" />
        </div>

        <h2 className="font-display text-2xl md:text-3xl">Espere! Um presente antes de sair</h2>
        <p className="mt-3 text-sm leading-6 text-branco-lua/70">
          Cadastre seu e-mail e receba <strong className="text-dourado">10% de desconto</strong> na sua primeira consulta de tarô ou búzios.
        </p>

        {done ? (
          <p className="mt-6 rounded-xl border border-dourado/30 bg-dourado/10 px-4 py-3 text-sm text-dourado">
            ✓ Seu e-mail foi guardado! O código de desconto será enviado em breve.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu melhor e-mail"
              className="field-input flex-1"
              aria-label="Seu e-mail"
            />
            <Button type="submit" variant="vermelho">
              Quero 10% off
            </Button>
          </form>
        )}

        <p className="mt-4 text-xs text-branco-lua/40">
          Sem spam. Só uma mensagem por semana, com conteúdo que respeita seu tempo.
        </p>
      </div>
    </div>
  );
}
