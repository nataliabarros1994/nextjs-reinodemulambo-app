"use client";
const panoBuzios = "/pano-buzios.jpg";
import { useState } from "react";

import { reflectionMessages } from "@/data/messages.js";
import { Button } from "@/components/Button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { pathToPay } from "@/utils/payment.js";

const STORAGE = "mae-buzios-plays";

export function CowrieCast() {
  const reduced = useReducedMotion();
  const [plays, setPlays] = useState(() => typeof window !== "undefined" ? Number(sessionStorage.getItem(STORAGE) || 0) : 0);
  const [playing, setPlaying] = useState(false);
  const [result, setResult] = useState(false);
  const [message, setMessage] = useState("");

  const play = () => {
    if (playing) return;
    setPlaying(true);
    setResult(false);
    const msg = reflectionMessages[Math.floor(Math.random() * reflectionMessages.length)];
    setMessage(msg);
    window.setTimeout(() => {
      setResult(true);
      setPlaying(false);
      const next = plays + 1;
      setPlays(next);
      sessionStorage.setItem(STORAGE, String(next));
    }, reduced ? 80 : 1200);
  };

  return (
    <section className="py-24">
      <div className="container-wide text-center">
        <p className="eyebrow">um instante de escuta</p>
        <h2 className="font-display mx-auto mt-3 max-w-xl text-3xl md:text-4xl">
          Faça sua pergunta em silêncio e jogue os búzios
        </h2>
        <div className={`buzios-stage mt-10 ${playing && !reduced ? "is-luz" : ""}`}>
          <div className="buzios-cloth">
            <img
              className="buzios-cloth-photo"
              src={panoBuzios}
              alt="Pano de leitura de búzios"
              width={800}
              height={800}
              onError={(e) => {
                e.currentTarget.src = "/pano-buzios.jpg";
              }}
            />
            <div className="buzios-cloth-overlay" aria-hidden="true" />
            <div className="buzios-ring" aria-hidden="true" />
            <div className="buzios-luz" aria-hidden="true" />
          </div>
        </div>
        <div className="mt-8 min-h-36">
          {!result && !playing ? <Button onClick={play}>Jogar os búzios</Button> : null}
          {result ? (
            <div className="buzios-msg mx-auto max-w-lg">
              <p className="font-display text-2xl italic">“{message}”</p>
              <p className="mt-4 text-xs tracking-wide text-branco-lua/50 uppercase">
                Esta é uma mensagem de reflexão. Para uma leitura verdadeira, agende sua consulta.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                {plays < 3 ? (
                  <Button variant="contornado" onClick={() => setResult(false)}>
                    Jogar novamente
                  </Button>
                ) : (
                  <Button href={pathToPay("buzios-tradicional")}>
                    Pay e agendar
                  </Button>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
