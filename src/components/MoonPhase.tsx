"use client";
import { useMemo } from "react";
import { getLunarPhase } from "@/utils/moon.js";

export function MoonPhase({ compact = false }: { compact?: boolean }) {
  const fase = useMemo(() => getLunarPhase(), []);
  return (
    <div className={compact ? "flex items-center gap-5" : "flex flex-col items-center text-center"}>
      <svg width={compact ? 88 : 160} height={compact ? 88 : 160} viewBox="0 0 100 100" aria-label={`Fase atual: ${fase.nome}`}>
        <defs>
          <radialGradient id="lua-cheia" cx="38%" cy="32%" r="70%">
            <stop offset="0%" stopColor="#fff8e8" />
            <stop offset="55%" stopColor="#f0e2c4" />
            <stop offset="100%" stopColor="#c9a227" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="40" fill="#1a1024" stroke="#C9A227" strokeWidth="1.5" />
        {fase.key === "full" && <circle cx="50" cy="50" r="40" fill="url(#lua-cheia)" />}
        {fase.key === "new" && <circle cx="50" cy="50" r="40" fill="#120918" />}
        {fase.key === "first-quarter" && (
          <path d="M50 10 A40 40 0 0 1 50 90 Z" fill="#F5F1E8" />
        )}
        {fase.key === "last-quarter" && (
          <path d="M50 10 A40 40 0 0 0 50 90 Z" fill="#F5F1E8" />
        )}
        {(fase.key === "waxing-crescent" || fase.key === "waning-crescent") && (
          <>
            <circle cx="50" cy="50" r="40" fill="#F5F1E8" />
            <circle cx={fase.key === "waxing-crescent" ? 38 : 62} cy="50" r="36" fill="#120918" />
          </>
        )}
        {(fase.key === "waxing-gibbous" || fase.key === "waning-gibbous") && (
          <>
            <circle cx="50" cy="50" r="40" fill="#F5F1E8" />
            <circle cx={fase.key === "waxing-gibbous" ? 68 : 32} cy="50" r="34" fill="#120918" opacity="0.85" />
          </>
        )}
      </svg>
      <div>
        <p className="eyebrow">{fase.nome}</p>
        <p className={`font-display ${compact ? "text-xl" : "mt-2 text-3xl"}`}>{fase.convite}</p>
        {!compact ? <p className="mt-3 max-w-md text-sm leading-7 text-branco-lua/70">{fase.mensagem}</p> : null}
      </div>
    </div>
  );
}
