"use client";
import { type ReactNode } from "react";

/** Os 12 glifos, só como traço — nunca como conteúdo de página. */
export const SIGNOS_ZODIACO = [
  "aries",
  "touro",
  "gemeos",
  "cancer",
  "leao",
  "virgem",
  "libra",
  "escorpiao",
  "sagitario",
  "capricornio",
  "aquario",
  "peixes",
] as const;

export type SignoGlifo = (typeof SIGNOS_ZODIACO)[number];

const traco = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Traços em viewBox 0 0 100 100. */
const desenhos: Record<SignoGlifo, ReactNode> = {
  aries: <path {...traco} d="M22 84C22 30 40 16 50 48C60 16 78 30 78 84" />,
  touro: (
    <>
      <circle {...traco} cx="50" cy="64" r="20" />
      <path {...traco} d="M22 32C32 10 42 16 50 40C58 16 68 10 78 32" />
    </>
  ),
  gemeos: <path {...traco} d="M36 12v76M64 12v76M24 12h52M24 88h52" />,
  cancer: (
    <>
      <path {...traco} d="M26 36c18-18 40-4 22 14M74 64C56 82 34 68 52 50" />
      <circle {...traco} cx="36" cy="58" r="9" />
      <circle {...traco} cx="64" cy="42" r="9" />
    </>
  ),
  leao: (
    <>
      <circle {...traco} cx="42" cy="42" r="18" />
      <path {...traco} d="M56 54c20 6 28 24 16 36" />
    </>
  ),
  virgem: <path {...traco} d="M22 14v60l16 16 16-16V14M54 74c10 16 30 10 30-10" />,
  libra: <path {...traco} d="M16 52h68M28 36h44M16 74h68" />,
  escorpiao: <path {...traco} d="M22 14v56l16 16 16-16V14M54 72l22-22M70 50h14" />,
  sagitario: <path {...traco} d="M24 76 76 24M52 24h24v24M32 44l28 28" />,
  capricornio: <path {...traco} d="M22 34c10-20 30-18 32 8v32M54 44c20-4 32 10 26 34" />,
  aquario: (
    <>
      <path {...traco} d="M14 42c12-16 24 16 36 0 12-16 24 16 36 0" />
      <path {...traco} d="M14 66c12-16 24 16 36 0 12-16 24 16 36 0" />
    </>
  ),
  peixes: (
    <>
      <path {...traco} d="M32 16C18 34 18 66 32 84M68 16c14 18 14 50 0 68M20 50h60" />
    </>
  ),
};

export function GlifoZodiaco({
  signo,
  className = "h-full w-full",
}: {
  signo: SignoGlifo;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      role="presentation"
    >
      {desenhos[signo]}
    </svg>
  );
}

/** Roda com os 12 glifos a cada 30° e dois anéis finos. */
export function RodaZodiacal({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1000 1000" fill="none" aria-hidden="true" role="presentation">
      <g stroke="currentColor" strokeWidth="1.3">
        <circle cx="500" cy="500" r="468" />
        <circle cx="500" cy="500" r="388" />
      </g>
      {SIGNOS_ZODIACO.map((signo, i) => {
        const angulo = ((i * 30 - 90) * Math.PI) / 180;
        const x = 500 + Math.cos(angulo) * 428;
        const y = 500 + Math.sin(angulo) * 428;
        return (
          <g key={signo} transform={`translate(${x} ${y}) rotate(${i * 30})`}>
            <g transform="translate(-36 -36) scale(0.72)">{desenhos[signo]}</g>
          </g>
        );
      })}
    </svg>
  );
}

export type GlifoSolto = {
  signo: SignoGlifo;
  x: string;
  y: string;
  size: number;
  rot: number;
  op: number;
  duracao: number;
  delay: number;
  mobile?: boolean;
};

export type LayoutZodiaco = {
  lado: "esquerda" | "direita";
  glifos: GlifoSolto[];
};

function posicaoRoda(lado: LayoutZodiaco["lado"]) {
  if (lado === "esquerda") return { left: "0%", transform: "translateX(-58%)" };
  return { left: "100%", transform: "translateX(-42%)" };
}

/** Uma roda por página, sangrando por uma borda. */
export const layoutsZodiaco: Record<string, LayoutZodiaco> = {
  home: {
    lado: "direita",
    glifos: [
      { signo: "peixes", x: "3%", y: "18vh", size: 120, rot: -16, op: 0.05, duracao: 11, delay: 0, mobile: true },
      { signo: "leao", x: "90%", y: "42vh", size: 86, rot: 12, op: 0.04, duracao: 13, delay: 1.6, mobile: true },
      { signo: "escorpiao", x: "4%", y: "88vh", size: 72, rot: 8, op: 0.035, duracao: 9, delay: 3.1 },
      { signo: "aquario", x: "91%", y: "130vh", size: 108, rot: -10, op: 0.045, duracao: 14, delay: 0.8, mobile: true },
      { signo: "virgem", x: "3%", y: "178vh", size: 64, rot: 20, op: 0.03, duracao: 10, delay: 2.4 },
      { signo: "sagitario", x: "89%", y: "230vh", size: 96, rot: -7, op: 0.04, duracao: 12, delay: 4.2 },
    ],
  },
  sobre: {
    lado: "esquerda",
    glifos: [
      { signo: "aries", x: "90%", y: "16vh", size: 110, rot: -12, op: 0.05, duracao: 12, delay: 0.4, mobile: true },
      { signo: "libra", x: "4%", y: "48vh", size: 78, rot: 14, op: 0.04, duracao: 9, delay: 2.1, mobile: true },
      { signo: "cancer", x: "91%", y: "96vh", size: 70, rot: 8, op: 0.035, duracao: 13, delay: 1.2 },
      { signo: "capricornio", x: "3%", y: "150vh", size: 100, rot: -9, op: 0.045, duracao: 11, delay: 3.3, mobile: true },
      { signo: "gemeos", x: "90%", y: "210vh", size: 66, rot: 18, op: 0.03, duracao: 8, delay: 0.7 },
    ],
  },
  servicos: {
    lado: "direita",
    glifos: [
      { signo: "touro", x: "3%", y: "20vh", size: 118, rot: -11, op: 0.05, duracao: 10, delay: 0.2, mobile: true },
      { signo: "escorpiao", x: "90%", y: "36vh", size: 82, rot: 9, op: 0.04, duracao: 14, delay: 1.8, mobile: true },
      { signo: "aquario", x: "4%", y: "92vh", size: 70, rot: 15, op: 0.035, duracao: 9, delay: 3 },
      { signo: "virgem", x: "91%", y: "148vh", size: 104, rot: -8, op: 0.045, duracao: 12, delay: 0.9, mobile: true },
      { signo: "sagitario", x: "3%", y: "204vh", size: 60, rot: 11, op: 0.03, duracao: 11, delay: 2.6 },
    ],
  },
  blog: {
    lado: "esquerda",
    glifos: [
      { signo: "gemeos", x: "90%", y: "18vh", size: 112, rot: 10, op: 0.05, duracao: 13, delay: 0.5, mobile: true },
      { signo: "peixes", x: "3%", y: "44vh", size: 80, rot: -14, op: 0.04, duracao: 9, delay: 2, mobile: true },
      { signo: "leao", x: "91%", y: "110vh", size: 68, rot: 7, op: 0.035, duracao: 11, delay: 1.4 },
      { signo: "capricornio", x: "4%", y: "168vh", size: 98, rot: -9, op: 0.045, duracao: 14, delay: 3.5, mobile: true },
    ],
  },
  glossario: {
    lado: "direita",
    glifos: [
      { signo: "virgem", x: "3%", y: "16vh", size: 106, rot: 8, op: 0.05, duracao: 12, delay: 0.3, mobile: true },
      { signo: "cancer", x: "90%", y: "40vh", size: 76, rot: -13, op: 0.04, duracao: 10, delay: 1.7, mobile: true },
      { signo: "aquario", x: "4%", y: "108vh", size: 64, rot: 16, op: 0.035, duracao: 8, delay: 2.8 },
      { signo: "libra", x: "91%", y: "170vh", size: 92, rot: -6, op: 0.045, duracao: 13, delay: 0.9, mobile: true },
    ],
  },
  contato: {
    lado: "esquerda",
    glifos: [
      { signo: "aries", x: "90%", y: "22vh", size: 114, rot: -10, op: 0.05, duracao: 11, delay: 0.4, mobile: true },
      { signo: "peixes", x: "3%", y: "50vh", size: 84, rot: 12, op: 0.04, duracao: 14, delay: 2.2, mobile: true },
      { signo: "leao", x: "91%", y: "96vh", size: 70, rot: -8, op: 0.035, duracao: 9, delay: 1.1 },
      { signo: "sagitario", x: "4%", y: "150vh", size: 100, rot: 9, op: 0.045, duracao: 12, delay: 3.4, mobile: true },
    ],
  },
  leitura: {
    lado: "direita",
    glifos: [
      { signo: "libra", x: "3%", y: "20vh", size: 116, rot: 11, op: 0.05, duracao: 10, delay: 0.6, mobile: true },
      { signo: "touro", x: "90%", y: "46vh", size: 88, rot: -15, op: 0.04, duracao: 13, delay: 1.9, mobile: true },
      { signo: "cancer", x: "4%", y: "102vh", size: 66, rot: 7, op: 0.035, duracao: 8, delay: 3.2 },
      { signo: "capricornio", x: "91%", y: "156vh", size: 102, rot: -9, op: 0.045, duracao: 12, delay: 0.8, mobile: true },
      { signo: "gemeos", x: "3%", y: "214vh", size: 60, rot: 18, op: 0.03, duracao: 11, delay: 2.5 },
    ],
  },
  default: {
    lado: "direita",
    glifos: [
      { signo: "peixes", x: "3%", y: "18vh", size: 108, rot: -10, op: 0.05, duracao: 12, delay: 0.3, mobile: true },
      { signo: "leao", x: "90%", y: "40vh", size: 80, rot: 12, op: 0.04, duracao: 10, delay: 1.8, mobile: true },
      { signo: "sagitario", x: "4%", y: "120vh", size: 68, rot: 8, op: 0.035, duracao: 14, delay: 2.7 },
      { signo: "libra", x: "91%", y: "180vh", size: 94, rot: -14, op: 0.045, duracao: 9, delay: 0.9, mobile: true },
    ],
  },
};

export function layoutForPath(path: string): LayoutZodiaco {
  const chave = path.replace(/^\//, "").split("/")[0] || "home";
  return layoutsZodiaco[chave] ?? layoutsZodiaco.default;
}

/**
 * Camada decorativa: uma roda sangrando a borda e glifos soltos nas margens.
 */
export function ZodiacOrnament({
  layout,
  animar = true,
}: {
  layout: LayoutZodiaco;
  animar?: boolean;
}) {
  const eixo = posicaoRoda(layout.lado);
  return (
    <div className="orn-zodiaco" aria-hidden="true" role="presentation">
      <div
        className="orn-roda-clip"
        style={{ left: eixo.left, transform: eixo.transform }}
      >
        <div className={animar ? "orn-roda-spin" : undefined}>
          <RodaZodiacal className="orn-roda" />
        </div>
      </div>

      {layout.glifos.map((g) => (
        <span
          key={`${g.signo}-${g.x}-${g.y}`}
          className={`orn-glifo ${g.mobile ? "" : "orn-desktop"} ${animar ? "orn-glifo-float" : ""}`}
          style={{
            left: g.x,
            top: g.y,
            width: g.size,
            height: g.size,
            opacity: g.op,
            ["--rot" as string]: `${g.rot}deg`,
            ["--float-dur" as string]: `${g.duracao}s`,
            ["--float-delay" as string]: `${g.delay}s`,
          }}
        >
          <GlifoZodiaco signo={g.signo} />
        </span>
      ))}
    </div>
  );
}

/** Fio dourado com um glifo no centro, entre seções. */
export function DivisoriaZodiaco({ indice }: { indice: number }) {
  const signo = SIGNOS_ZODIACO[indice % SIGNOS_ZODIACO.length];
  return (
    <div className="orn-divisoria" aria-hidden="true" role="presentation">
      <span className="orn-divisoria-fio" />
      <GlifoZodiaco signo={signo} className="orn-divisoria-glifo" />
      <span className="orn-divisoria-fio" />
    </div>
  );
}
