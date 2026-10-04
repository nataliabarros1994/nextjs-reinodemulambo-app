"use client";
import { type ReactNode } from "react";
import { usePathname } from "next/navigation";

const SIGNOS = [
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

type Signo = (typeof SIGNOS)[number];
type Cor = "#C9A227" | "#E8DCC8";

type Spot = {
  signo: Signo;
  top: string;
  left?: string;
  right?: string;
  size: number;
  sizeMobile?: number;
  rot: number;
  cor: Cor;
  op: number;
  mobile?: boolean;
};

const desenhos: Record<Signo, ReactNode> = {
  aries: (
    <path d="M20 44C20 12 40 10 50 44C60 10 80 12 80 44M50 44v44" />
  ),
  touro: (
    <>
      <circle cx="50" cy="66" r="22" />
      <path d="M22 44C22 14 38 16 50 44C62 16 78 14 78 44" />
    </>
  ),
  gemeos: (
    <path d="M34 18v64M66 18v64M20 18h60M20 82h60" />
  ),
  cancer: (
    <>
      <path d="M28 32c16-18 40-6 24 16" />
      <circle cx="36" cy="58" r="11" />
      <path d="M72 68c-16 18-40 6-24-16" />
      <circle cx="64" cy="42" r="11" />
    </>
  ),
  leao: (
    <>
      <circle cx="40" cy="36" r="18" />
      <path d="M56 44c24 4 34 26 18 40-10 10-24 2-18-10" />
    </>
  ),
  virgem: (
    <path d="M22 14v52l16 20 14-20V14M52 66l14 20V14M66 70c10 22 32 14 26-10" />
  ),
  libra: (
    <path d="M16 76h68M16 56h68M30 56c0-22 40-22 40 0" />
  ),
  escorpiao: (
    <path d="M22 14v52l16 20 14-20V14M52 66l14 20V14M66 74l22-24M80 50h16M88 50l-8-10" />
  ),
  sagitario: (
    <path d="M24 76 76 24M56 24h20v20M34 46l22 22" />
  ),
  capricornio: (
    <path d="M22 38c10-24 32-22 34 8v36M56 48c22-12 36 8 24 36-6 14-20 8-16-6" />
  ),
  aquario: (
    <>
      <path d="M12 42 26 26 40 42 54 26 68 42 82 26 90 34" />
      <path d="M12 68 26 52 40 68 54 52 68 68 82 52 90 60" />
    </>
  ),
  peixes: (
    <path d="M34 12C16 32 16 68 34 88M66 12c18 20 18 56 0 76M16 50h68" />
  ),
};

function Glifo({ signo, cor }: { signo: Signo; cor: Cor }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke={cor}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {desenhos[signo]}
    </svg>
  );
}

const layouts: Record<string, Spot[]> = {
  home: [
    { signo: "peixes", top: "8%", left: "-110px", size: 300, sizeMobile: 176, rot: -18, cor: "#C9A227", op: 0.15, mobile: true },
    { signo: "leao", top: "4%", right: "-120px", size: 320, sizeMobile: 196, rot: 14, cor: "#E8DCC8", op: 0.13, mobile: true },
    { signo: "aquario", top: "58%", left: "3%", size: 168, rot: 8, cor: "#C9A227", op: 0.16 },
    { signo: "escorpiao", top: "46%", right: "-70px", size: 236, rot: -20, cor: "#E8DCC8", op: 0.12 },
    { signo: "virgem", top: "78%", left: "7%", size: 148, sizeMobile: 132, rot: 22, cor: "#C9A227", op: 0.14, mobile: true },
    { signo: "sagitario", top: "80%", left: "68%", size: 200, rot: -7, cor: "#E8DCC8", op: 0.11 },
  ],
  sobre: [
    { signo: "aries", top: "10%", left: "-100px", size: 280, sizeMobile: 168, rot: -16, cor: "#C9A227", op: 0.15, mobile: true },
    { signo: "libra", top: "6%", right: "-130px", size: 310, sizeMobile: 188, rot: 12, cor: "#E8DCC8", op: 0.13, mobile: true },
    { signo: "cancer", top: "52%", left: "4%", size: 172, rot: 9, cor: "#C9A227", op: 0.14 },
    { signo: "capricornio", top: "58%", right: "4%", size: 220, rot: -14, cor: "#E8DCC8", op: 0.12 },
    { signo: "gemeos", top: "78%", left: "10%", size: 156, sizeMobile: 140, rot: 20, cor: "#C9A227", op: 0.16, mobile: true },
    { signo: "touro", top: "82%", right: "12%", size: 190, rot: -8, cor: "#E8DCC8", op: 0.11 },
  ],
  servicos: [
    { signo: "touro", top: "8%", left: "-120px", size: 290, sizeMobile: 172, rot: -12, cor: "#C9A227", op: 0.15, mobile: true },
    { signo: "escorpiao", top: "5%", right: "-110px", size: 300, sizeMobile: 184, rot: 16, cor: "#E8DCC8", op: 0.13, mobile: true },
    { signo: "aquario", top: "48%", left: "2%", size: 180, rot: 7, cor: "#C9A227", op: 0.14 },
    { signo: "virgem", top: "54%", right: "-60px", size: 210, rot: -22, cor: "#E8DCC8", op: 0.12 },
    { signo: "sagitario", top: "80%", left: "8%", size: 160, sizeMobile: 128, rot: 18, cor: "#C9A227", op: 0.16, mobile: true },
    { signo: "leao", top: "76%", right: "8%", size: 240, rot: -6, cor: "#E8DCC8", op: 0.11 },
  ],
  leitura: [
    { signo: "libra", top: "7%", left: "-90px", size: 270, sizeMobile: 164, rot: 11, cor: "#C9A227", op: 0.15, mobile: true },
    { signo: "touro", top: "4%", right: "-140px", size: 320, sizeMobile: 192, rot: -15, cor: "#E8DCC8", op: 0.13, mobile: true },
    { signo: "cancer", top: "50%", left: "3%", size: 164, rot: 8, cor: "#C9A227", op: 0.14 },
    { signo: "capricornio", top: "46%", right: "-50px", size: 226, rot: -10, cor: "#E8DCC8", op: 0.12 },
    { signo: "gemeos", top: "78%", left: "6%", size: 150, sizeMobile: 126, rot: 21, cor: "#C9A227", op: 0.16, mobile: true },
    { signo: "peixes", top: "80%", right: "10%", size: 200, rot: -9, cor: "#E8DCC8", op: 0.11 },
    { signo: "aries", top: "36%", left: "-70px", size: 160, rot: -24, cor: "#C9A227", op: 0.12 },
  ],
  trabalhos: [
    { signo: "escorpiao", top: "9%", left: "-115px", size: 286, sizeMobile: 170, rot: -17, cor: "#C9A227", op: 0.15, mobile: true },
    { signo: "aquario", top: "6%", right: "-125px", size: 304, sizeMobile: 186, rot: 13, cor: "#E8DCC8", op: 0.13, mobile: true },
    { signo: "leao", top: "54%", left: "4%", size: 176, rot: 10, cor: "#C9A227", op: 0.14 },
    { signo: "virgem", top: "50%", right: "3%", size: 214, rot: -19, cor: "#E8DCC8", op: 0.12 },
    { signo: "libra", top: "80%", left: "12%", size: 158, sizeMobile: 134, rot: 15, cor: "#C9A227", op: 0.16, mobile: true },
  ],
  contato: [
    { signo: "aries", top: "8%", left: "-105px", size: 276, sizeMobile: 166, rot: -14, cor: "#C9A227", op: 0.15, mobile: true },
    { signo: "peixes", top: "5%", right: "-135px", size: 312, sizeMobile: 190, rot: 10, cor: "#E8DCC8", op: 0.13, mobile: true },
    { signo: "leao", top: "52%", left: "3%", size: 170, rot: 9, cor: "#C9A227", op: 0.14 },
    { signo: "sagitario", top: "48%", right: "-55px", size: 218, rot: -21, cor: "#E8DCC8", op: 0.12 },
    { signo: "cancer", top: "80%", left: "9%", size: 154, sizeMobile: 130, rot: 18, cor: "#C9A227", op: 0.16, mobile: true },
    { signo: "touro", top: "78%", right: "9%", size: 188, rot: -5, cor: "#E8DCC8", op: 0.11 },
  ],
  blog: [
    { signo: "gemeos", top: "8%", left: "-95px", size: 268, sizeMobile: 162, rot: 10, cor: "#C9A227", op: 0.15, mobile: true },
    { signo: "peixes", top: "4%", right: "-128px", size: 308, sizeMobile: 188, rot: -14, cor: "#E8DCC8", op: 0.13, mobile: true },
    { signo: "leao", top: "56%", left: "4%", size: 174, rot: 7, cor: "#C9A227", op: 0.14 },
    { signo: "capricornio", top: "50%", right: "5%", size: 208, rot: -11, cor: "#E8DCC8", op: 0.12 },
    { signo: "libra", top: "80%", left: "11%", size: 152, sizeMobile: 128, rot: 19, cor: "#C9A227", op: 0.16, mobile: true },
  ],
  glossario: [
    { signo: "virgem", top: "7%", left: "-108px", size: 274, sizeMobile: 168, rot: 8, cor: "#C9A227", op: 0.15, mobile: true },
    { signo: "cancer", top: "5%", right: "-118px", size: 296, sizeMobile: 182, rot: -13, cor: "#E8DCC8", op: 0.13, mobile: true },
    { signo: "aquario", top: "50%", left: "3%", size: 166, rot: 16, cor: "#C9A227", op: 0.14 },
    { signo: "libra", top: "54%", right: "-48px", size: 222, rot: -6, cor: "#E8DCC8", op: 0.12 },
    { signo: "aries", top: "78%", left: "8%", size: 150, sizeMobile: 126, rot: -22, cor: "#C9A227", op: 0.16, mobile: true },
    { signo: "sagitario", top: "80%", right: "10%", size: 194, rot: 11, cor: "#E8DCC8", op: 0.11 },
  ],
  obrigada: [
    { signo: "peixes", top: "10%", left: "-100px", size: 282, sizeMobile: 170, rot: -15, cor: "#C9A227", op: 0.15, mobile: true },
    { signo: "leao", top: "6%", right: "-122px", size: 306, sizeMobile: 186, rot: 12, cor: "#E8DCC8", op: 0.13, mobile: true },
    { signo: "aquario", top: "55%", left: "5%", size: 162, rot: 8, cor: "#C9A227", op: 0.14 },
    { signo: "libra", top: "52%", right: "4%", size: 204, rot: -18, cor: "#E8DCC8", op: 0.12 },
    { signo: "virgem", top: "80%", left: "14%", size: 146, sizeMobile: 124, rot: 21, cor: "#C9A227", op: 0.16, mobile: true },
  ],
  default: [
    { signo: "sagitario", top: "8%", left: "-112px", size: 278, sizeMobile: 168, rot: -16, cor: "#C9A227", op: 0.15, mobile: true },
    { signo: "cancer", top: "5%", right: "-126px", size: 302, sizeMobile: 184, rot: 11, cor: "#E8DCC8", op: 0.13, mobile: true },
    { signo: "aries", top: "54%", left: "4%", size: 170, rot: 9, cor: "#C9A227", op: 0.14 },
    { signo: "peixes", top: "50%", right: "5%", size: 216, rot: -12, cor: "#E8DCC8", op: 0.12 },
    { signo: "touro", top: "80%", left: "10%", size: 154, sizeMobile: 130, rot: 17, cor: "#C9A227", op: 0.16, mobile: true },
  ],
};

function layoutForPath(path: string): Spot[] {
  const limpo = path.replace(/\/$/, "") || "/";
  if (limpo === "/") return layouts.home;
  if (limpo.startsWith("/blog")) return layouts.blog;
  const chave = limpo.split("/").filter(Boolean)[0] ?? "default";
  return layouts[chave] ?? layouts.default;
}

/** Marca-d'água de glifos, parada, em todas as páginas. */
export function GlyphBackground() {
  const path = usePathname();
  const spots = layoutForPath(path);

  return (
    <div className="glifos-fundo" aria-hidden="true">
      {spots.map((s, i) => (
        <span
          key={`${s.signo}-${i}`}
          className={s.mobile ? "glifos-fundo-item is-mobile" : "glifos-fundo-item"}
          style={{
            top: s.top,
            left: s.left ?? "auto",
            right: s.right ?? "auto",
            width: s.size,
            height: s.size,
            opacity: s.op,
            transform: `rotate(${s.rot}deg)`,
            ["--size-m" as string]: `${s.sizeMobile ?? 140}px`,
          }}
        >
          <Glifo signo={s.signo} cor={s.cor} />
        </span>
      ))}
    </div>
  );
}
