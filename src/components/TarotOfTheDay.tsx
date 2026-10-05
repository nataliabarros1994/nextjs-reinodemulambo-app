"use client";
import { useEffect, useState } from "react";
import { arcanosMaiores } from "@/data/tarot.js";
import { Button } from "@/components/Button";
import { SectionTitle } from "@/components/SectionTitle";
import { linkWhatsApp } from "@/utils/whatsapp.js";

const KEY = "mae-taro-dia";
const PLACEHOLDER = arcanosMaiores[0];

function todayKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function TarotOfTheDay() {
  const [flipped, setFlipped] = useState(false);
  const [already, setAlready] = useState(false);
  const [carta, setCarta] = useState(PLACEHOLDER);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(KEY) || "null");
      if (stored && stored.date === todayKey()) {
        setCarta(arcanosMaiores.find((c: { id: number }) => c.id === stored.id) ?? PLACEHOLDER);
        setFlipped(true);
        setAlready(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const virar = () => {
    if (already || flipped) return;
    const pick = arcanosMaiores[Math.floor(Math.random() * arcanosMaiores.length)];
    setCarta(pick);
    setFlipped(true);
    setAlready(true);
    localStorage.setItem(KEY, JSON.stringify({ date: todayKey(), id: pick.id }));
  };

  return (
    <section className="bg-roxo-profundo/40 py-24">
      <div className="container-wide grid items-center gap-12 md:grid-cols-2">
        <SectionTitle
          eyebrow="um recado por dia"
          title={<>Tarô do Dia</>}
          lede="Uma carta dos 22 Arcanos Maiores. Clique para virar. Só uma por dia — a escassez também é um cuidado."
        />
        <div className="flex flex-col items-center gap-6">
          <div className="tarot-scene">
            <button
              className={`tarot-card-3d ${flipped ? "is-flipped" : ""}`}
              onClick={virar}
              aria-label={flipped ? carta.nome : "Virar a carta do dia"}
            >
              <div className="tarot-face tarot-back">
                <span className="font-display text-4xl text-dourado">MN</span>
                <span className="mt-3 text-xs tracking-[0.2em] uppercase text-branco-lua/60">virar a carta</span>
              </div>
              <div className="tarot-face tarot-front">
                <span className="eyebrow">{carta.palavra}</span>
                <h3 className="font-display mt-3 text-2xl">{carta.nome}</h3>
                <p className="mt-4 text-sm leading-6 text-branco-lua/75">{carta.mensagem}</p>
              </div>
            </button>
          </div>
          {flipped ? (
            <Button href={linkWhatsApp("taroDoDia")} external variant="contornado">
              Quero aprofundar esta leitura
            </Button>
          ) : (
            <p className="text-sm text-branco-lua/55">Clique na carta para revelar.</p>
          )}
          {already && flipped ? (
            <p className="text-xs text-branco-lua/45">Você já tirou sua carta hoje. Volte amanhã.</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
