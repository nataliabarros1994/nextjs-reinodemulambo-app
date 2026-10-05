"use client";
import { useEffect, useState } from "react";
import { ritualDates, dailyRulers } from "@/data/calendar.js";
import { Card } from "@/components/Card";
import { MoonPhase } from "@/components/MoonPhase";
import { SectionTitle } from "@/components/SectionTitle";

type Ruler = (typeof dailyRulers)[0];

function formatIsoDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

export function SpiritualCalendar() {
  const [regente, setRegente] = useState<Ruler | null>(null);
  const proximas = ritualDates.slice(0, 3);

  useEffect(() => {
    setRegente(dailyRulers[new Date().getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6]);
  }, []);

  return (
    <section className="py-24">
      <div className="container-wide">
        <SectionTitle
          eyebrow="céu de hoje"
          title={<>Calendário espiritual</>}
          lede="A lua e o dia da semana como convite — nunca como prescrição."
        />
        <Card className="mt-10">
          <div className="grid gap-10 md:grid-cols-[auto_1fr]">
            <MoonPhase compact />
            <div>
              <p className="eyebrow">
                {regente ? `${regente.dia} · ${regente.regente}` : "hoje"}
              </p>
              <p className="mt-3 leading-7 text-branco-lua/75">
                {regente?.pratica ?? "A lua e o dia da semana como convite — nunca como prescrição."}
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {proximas.map((item: { data: string; nome: string; nota: string }) => (
                  <li key={item.data} className="border-t border-dourado/15 pt-3">
                    <strong className="text-dourado">
                      {formatIsoDate(item.data)} — {item.nome}
                    </strong>
                    <p className="text-branco-lua/60">{item.nota}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
