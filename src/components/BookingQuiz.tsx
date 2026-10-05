"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { serviceFormats, services, priceTable } from "@/data/services.js";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { pathToPay } from "@/utils/payment.js";

const themes = [
  { id: "amor", label: "Amor e relacionamentos", servico: "taro" },
  { id: "trabalho", label: "Trabalho e dinheiro", servico: "taro" },
  { id: "saude", label: "Saúde e energia", servico: "orientacao" },
  { id: "familia", label: "Família", servico: "buzios" },
  { id: "caminhos", label: "Caminhos e decisões", servico: "buzios" },
  { id: "outro", label: "Outro", servico: "orientacao" },
];

export function BookingQuiz() {
  const [step, setStep] = useState(0);
  const [theme, setTheme] = useState("");
  const [modo, setModo] = useState("");
  const [periodo, setPeriodo] = useState("");
  const themeItem = themes.find((t) => t.id === theme) ?? themes[0];
  const servico = services.find((s: { id: string }) => s.id === themeItem.servico) ?? services[0];

  const slugQuiz =
    servico.id === "buzios"
      ? "30min-buzios"
      : servico.id === "taro"
        ? modo === "Áudio"
          ? "30min-taro-audio"
          : modo === "Vídeo"
            ? "30min-taro-video"
            : "30min-taro-texto"
        : "";
  const ofertaQuiz = priceTable.find((t: { calendlySlug: string }) => t.calendlySlug === slugQuiz);
  const hrefQuiz = ofertaQuiz ? pathToPay(ofertaQuiz.id) : "/contato";

  return (
    <section className="py-24">
      <div className="container-wide">
        <Card className="relative mx-auto max-w-2xl overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-white/10">
            <div className="h-full bg-dourado transition-all" style={{ width: `${(step / 4) * 100}%` }} />
          </div>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="eyebrow">descubra a consulta</p>
                <h2 className="font-display mt-3 text-3xl">Qual consulta é ideal para você?</h2>
                <p className="mt-3 mb-6 text-branco-lua/65">Três perguntas rápidas. No final, uma sugestão e o link da agenda.</p>
                <Button onClick={() => setStep(1)}>Começar</Button>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div key="1" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <p className="text-xs tracking-widest uppercase text-branco-lua/45">1 de 3</p>
                <h2 className="font-display mt-2 mb-5 text-2xl">O que te trouxe até aqui?</h2>
                <div className="grid gap-2">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      className="rounded-xl border border-dourado/20 px-4 py-3 text-left hover:border-roxo-claro"
                      onClick={() => {
                        setTheme(t.id);
                        setStep(2);
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <p className="text-xs tracking-widest uppercase text-branco-lua/45">2 de 3</p>
                <h2 className="font-display mt-2 mb-5 text-2xl">Como prefere ser atendida?</h2>
                {serviceFormats.map((m: string) => (
                  <button
                    key={m}
                    className="mb-2 block w-full rounded-xl border border-dourado/20 px-4 py-3 text-left"
                    onClick={() => {
                      setModo(m);
                      setStep(3);
                    }}
                  >
                    {m}
                  </button>
                ))}
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="3" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <p className="text-xs tracking-widest uppercase text-branco-lua/45">3 de 3</p>
                <h2 className="font-display mt-2 mb-5 text-2xl">Qual o melhor momento?</h2>
                {["manhã", "tarde", "noite"].map((p) => (
                  <button
                    key={p}
                    className="mb-2 block w-full rounded-xl border border-dourado/20 px-4 py-3 text-left capitalize"
                    onClick={() => {
                      setPeriodo(p);
                      setStep(4);
                    }}
                  >
                    {p}
                  </button>
                ))}
              </motion.div>
            )}
            {step === 4 && (
              <motion.div key="4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="eyebrow">uma direção inicial</p>
                <h2 className="font-display mt-2 text-3xl">{servico.nome}</h2>
                <p className="mt-3 text-branco-lua/70">{servico.resumo}</p>
                <p className="mt-2 text-sm text-branco-lua/55">
                  Formato {modo}, preferência de {periodo}.
                </p>
                <Button className="mt-6" href={hrefQuiz}>
                  Agendar {servico.nome}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </section>
  );
}
