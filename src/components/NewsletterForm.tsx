"use client";
import { type FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { Button } from "@/components/Button";
import { KlaviyoEvents } from "@/utils/klaviyo";

type FormStatus = "idle" | "submitting" | "pending" | "error";

const MESSAGES = {
  pending:
    "Cadastro pendente. Enviamos um e-mail de confirmação. Confira a caixa de entrada e o spam. Você só entra na lista depois de clicar no botão de confirmação.",
  invalid_email: "Digite um e-mail válido.",
  consent_required: "Para continuar, marque o consentimento.",
  rate_limited: "Aguarde um momento e tente de novo.",
  generic: "Não foi possível concluir o cadastro agora. Tente de novo em instantes.",
};

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");
  const startedAt = useMemo(() => Date.now(), []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setStatus("error");
      setError(MESSAGES.invalid_email);
      return;
    }
    if (!consent) {
      setStatus("error");
      setError(MESSAGES.consent_required);
      return;
    }

    setStatus("submitting");
    setError("");

    const result = await KlaviyoEvents.newsletterSignup({
      email: cleanEmail,
      consent: true,
      honeypot,
      startedAt,
    });

    if (result.ok && result.status === "pending") {
      setStatus("pending");
      return;
    }

    setStatus("error");
    if (result.error === "invalid_email") setError(MESSAGES.invalid_email);
    else if (result.error === "consent_required") setError(MESSAGES.consent_required);
    else if (result.error === "rate_limited") setError(MESSAGES.rate_limited);
    else setError(MESSAGES.generic);
  };

  if (status === "pending") {
    return (
      <p className="max-w-md text-sm leading-6 text-branco-lua/75" role="status">
        {MESSAGES.pending}
      </p>
    );
  }

  return (
    <form
      className="flex w-full max-w-md flex-col gap-3"
      onSubmit={submit}
      noValidate
      aria-busy={status === "submitting" ? true : undefined}
    >
      <div className="flex w-full gap-2">
        <input
          className="field-input flex-1"
          type="email"
          name="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu melhor e-mail"
          aria-label="Seu e-mail"
          aria-invalid={status === "error" && !email.trim() ? true : undefined}
          disabled={status === "submitting"}
        />
        <Button
          type="submit"
          variant="roxo"
          aria-label="Enviar cadastro"
          disabled={status === "submitting"}
        >
          <Send size={16} />
        </Button>
      </div>
      <label className="newsletter-consent">
        <input
          type="checkbox"
          name="consent"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          disabled={status === "submitting"}
        />
        <span>
          Aceito receber mensagens espirituais e comunicações do Reino de Mulambo. Li a{" "}
          <Link href="/privacidade">Política de Privacidade</Link>.
        </span>
      </label>
      <div className="hp-field" aria-hidden="true">
        <label>
          Website
          <input
            type="text"
            name="hp_website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>
      </div>
      {status === "error" && error ? (
        <p className="field-erro" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
