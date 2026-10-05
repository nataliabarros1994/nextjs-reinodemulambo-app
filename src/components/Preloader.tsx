"use client";
import { useEffect, useState } from "react";
import { ZodiacWheel } from "@/components/ZodiacWheel";

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const skip = new URLSearchParams(window.location.search).has("skipLoader");
    if (skip || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      setGone(true);
      return;
    }
    const t1 = window.setTimeout(() => setVisible(false), 1500);
    const t2 = window.setTimeout(() => setGone(true), 2100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (gone) return null;
  return (
    <div className={visible ? "preloader" : "preloader preloader-hide"} aria-hidden="true">
      <div className="flex flex-col items-center gap-8 px-6 text-center">
        <ZodiacWheel className="h-36 w-36 zodiac-spin text-dourado/80" />
        <p className="font-display max-w-sm text-lg text-branco-lua/85">
          Respire fundo. Você está entrando em um espaço de escuta.
        </p>
      </div>
    </div>
  );
}
