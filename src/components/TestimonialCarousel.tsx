"use client";
import { useState } from "react";
import { testimonials } from "@/data/testimonials.js";
import { Card } from "@/components/Card";

export function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const item = testimonials[index];
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Card>
        <p className="font-display text-2xl leading-snug italic md:text-3xl">“{item.texto}”</p>
        <p className="mt-6 text-sm tracking-widest text-dourado uppercase">
          {item.nome} · {item.cidade} · {item.data}
        </p>
        <p className="mt-2 text-[11px] text-branco-lua/40">Depoimento de exemplo — substituir por relatos reais autorizados.</p>
      </Card>
      <div className="mt-6 flex justify-center gap-2">
        {testimonials.map((_: unknown, i: number) => (
          <button
            key={i}
            aria-label={`Depoimento ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2.5 w-2.5 rounded-full border border-dourado ${i === index ? "bg-dourado" : "bg-transparent"}`}
          />
        ))}
      </div>
    </div>
  );
}
