"use client";
import Link from "next/link";
import { agenda } from "@/data/agenda.js";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
export function WeeklySlots() {
  const agendaHref = "/servicos";

  return (
    <section className="py-20">
      <div className="container-wide">
        <h2 className="font-display text-3xl">Vagas desta semana</h2>
        <p className="mt-2 text-sm text-branco-lua/60">{agenda.aviso}</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-5">
          {agenda.vagas.map((dia: { dia: string; turnos: string[] }) => (
            <Link key={dia.dia} href={agendaHref} className="block no-underline">
              <Card className="h-full p-4 text-center transition hover:border-dourado/50">
                <p className="font-display">{dia.dia}</p>
                {dia.turnos.length ? (
                  <p className="mt-2 text-xs capitalize text-roxo-claro">{dia.turnos.join(" · ")}</p>
                ) : (
                  <p className="mt-2 text-xs text-branco-lua/40">sem vaga</p>
                )}
              </Card>
            </Link>
          ))}
        </div>
        <Button className="mt-8" href={agendaHref}>
          Agendar horário
        </Button>
      </div>
    </section>
  );
}
