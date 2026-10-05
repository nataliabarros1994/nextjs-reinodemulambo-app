"use client";
import { type FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { SectionTitle } from "@/components/SectionTitle";

const COLORS = [
  { id: "branca", label: "Branca", hex: "#F5F1E8" },
  { id: "vermelha", label: "Vermelha", hex: "#C1121F" },
  { id: "roxa", label: "Roxa", hex: "#6B21A8" },
];

function weekKey() {
  const now = new Date();
  const onejan = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${week}`;
}

export function VirtualCandle() {
  const [cor, setCor] = useState("branca");
  const [intencao, setIntencao] = useState("");
  const [acesa, setAcesa] = useState(false);
  const [saved, setSaved] = useState("");
  const [savedCor, setSavedCor] = useState("branca");
  const [count, setCount] = useState(0);

  useEffect(() => {
    setAcesa(localStorage.getItem("mae-vela-acesa") === "1");
    setSaved(localStorage.getItem("mae-vela-intencao") ?? "");
    setSavedCor(localStorage.getItem("mae-vela-cor") ?? "branca");
    try {
      const raw = JSON.parse(localStorage.getItem("mae-velas-semana") || "{}");
      setCount(raw.week === weekKey() ? Number(raw.count || 0) : 0);
    } catch {
      setCount(0);
    }
  }, []);

  const hex = COLORS.find((c) => c.id === (acesa ? savedCor : cor))?.hex ?? "#F5F1E8";

  const acender = (event: FormEvent) => {
    event.preventDefault();
    const text = intencao.trim();
    if (!text) return;
    localStorage.setItem("mae-vela-acesa", "1");
    localStorage.setItem("mae-vela-intencao", text);
    localStorage.setItem("mae-vela-cor", cor);
    const raw = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("mae-velas-semana") || "{}") : {};
    const week = weekKey();
    const next = raw.week === week ? Number(raw.count || 0) + 1 : 1;
    localStorage.setItem("mae-velas-semana", JSON.stringify({ week, count: next }));
    setCount(next);
    setSaved(text);
    setSavedCor(cor);
    setAcesa(true);
  };

  return (
    <section className="py-24">
      <div className="container-wide grid items-center gap-12 md:grid-cols-2">
        <SectionTitle
          eyebrow="um gesto de presença"
          title={<>Acenda uma vela</>}
          lede="Escreva uma intenção, escolha a cor e acenda. A chama fica neste navegador, como um lembrete silencioso do que você pediu."
        />
        <Card>
          <div className="flex flex-col items-center">
            <div className="candle-wrap mb-6 h-32">
              {acesa ? (
                <div className="candle-body" style={{ background: hex }}>
                  <span className="flame" />
                  <span className="candle-wick" />
                </div>
              ) : (
                <div className="candle-body opacity-40" style={{ background: hex }}>
                  <span className="candle-wick" />
                </div>
              )}
            </div>
            {acesa ? (
              <div className="text-center">
                <p className="font-display text-xl italic">“{saved}”</p>
                <p className="mt-3 text-sm text-branco-lua/60">
                  {count} {count === 1 ? "vela acesa" : "velas acesas"} nesta semana neste espaço.
                </p>
              </div>
            ) : (
              <form className="w-full space-y-4" onSubmit={acender}>
                <label className="block text-xs tracking-widest uppercase text-branco-lua/50">
                  Sua intenção
                  <textarea
                    className="field-input mt-2 min-h-24"
                    value={intencao}
                    onChange={(e) => setIntencao(e.target.value)}
                    required
                    placeholder="O que você deseja cultivar?"
                  />
                </label>
                <div className="flex justify-center gap-3">
                  {COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCor(c.id)}
                      className={`h-9 w-9 rounded-full border ${cor === c.id ? "border-dourado scale-110" : "border-white/20"}`}
                      style={{ background: c.hex }}
                      aria-label={`Vela ${c.label}`}
                    />
                  ))}
                </div>
                <Button type="submit" className="w-full">
                  Acender
                </Button>
              </form>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}
