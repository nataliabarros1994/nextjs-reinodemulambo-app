import type { Metadata } from "next";

export const openGraphBase = {
  type: "website" as const,
  locale: "pt_BR",
  siteName: "Reino de Mulambo",
  title: "Reino de Mulambo — Jogo de Búzios e Tarô Online",
  description:
    "Consulta de tarô online e jogo de búzios para todo o Brasil. Texto, áudio, WhatsApp, ligação ou vídeo. Sigilo e respeito.",
  images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Reino de Mulambo" }],
} satisfies NonNullable<Metadata["openGraph"]>;

export function pageOpenGraph(
  path: string,
  extras?: { title?: string; description?: string; type?: "website" | "article" },
): NonNullable<Metadata["openGraph"]> {
  return {
    ...openGraphBase,
    url: path,
    ...(extras?.type ? { type: extras.type } : {}),
    ...(extras?.title ? { title: extras.title } : {}),
    ...(extras?.description ? { description: extras.description } : {}),
  };
}
