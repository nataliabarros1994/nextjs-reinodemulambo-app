"use client";
import { type FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/Button";
import { KlaviyoEvents, saveEmailLocally } from "@/utils/klaviyo";
import { Events } from "@/utils/analytics";

const KEY = "mae-newsletter";

export function NewsletterForm() {
  const [done, setDone] = useState(() => typeof window !== "undefined" && Boolean(localStorage.getItem(KEY)));
  const [email, setEmail] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) return;

    // Salva localmente
    const list = JSON.parse(localStorage.getItem(KEY) || "[]");
    localStorage.setItem(KEY, JSON.stringify([...list, { email: cleanEmail, at: Date.now() }]));

    // Tenta enviar para Klaviyo
    KlaviyoEvents.newsletterSignup(cleanEmail);
    saveEmailLocally(cleanEmail, "newsletter");

    // Track evento
    Events.signUp("email");
    Events.lead("newsletter");

    setDone(true);
  };

  if (done) {
    return <p className="text-sm text-branco-lua/75">Seu e-mail foi guardado neste navegador. Em breve, a mensagem da semana chega até você.</p>;
  }

  return (
    <form className="flex w-full max-w-md gap-2" onSubmit={submit}>
      <input
        className="field-input flex-1"
        type="email"
        name="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="seu melhor e-mail"
        aria-label="Seu e-mail"
      />
      <Button type="submit" variant="roxo" aria-label="Guardar e-mail">
        <Send size={16} />
      </Button>
    </form>
  );
}
