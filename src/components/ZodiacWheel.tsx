"use client";
const simbolos = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

/** Roda decorativa do preloader e do hero — sem dados de signos. */
export function ZodiacWheel({ className = "h-64 w-64" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeOpacity="0.35" />
      <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeDasharray="3 6" />
      <circle cx="100" cy="100" r="18" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      {simbolos.map((simbolo, i) => {
        const angle = ((i * 30 - 90) * Math.PI) / 180;
        const x = 100 + Math.cos(angle) * 80;
        const y = 100 + Math.sin(angle) * 80;
        return (
          <text key={simbolo} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="11" fill="currentColor">
            {simbolo}
          </text>
        );
      })}
    </svg>
  );
}
