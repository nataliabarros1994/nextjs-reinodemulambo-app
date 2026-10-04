import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@/index.css";
import { Providers } from "@/components/Providers";
import { SpaceBackground } from "@/components/SpaceBackground";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

const SITE_URL = "https://reinodemulambo.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Reino de Mulambo — Jogo de Búzios e Tarô Online",
    template: "%s",
  },
  description:
    "Jogo de búzios online e tarô online para todo o Brasil. Consultas por texto, áudio ou vídeo, com sigilo, respeito e escuta.",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: SITE_URL,
    locale: "pt_BR",
    siteName: "Reino de Mulambo",
    title: "Reino de Mulambo — Jogo de Búzios e Tarô Online",
    description:
      "Consultas de Jogo de Búzios e Tarô online para todo o Brasil, por texto, áudio ou vídeo. Sigilo, respeito e escuta.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Reino de Mulambo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reino de Mulambo — Jogo de Búzios e Tarô Online",
    description:
      "Jogo de búzios online e tarô online para todo o Brasil. Consultas por texto, áudio ou vídeo.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
  manifest: "/manifest.webmanifest",
  other: {
    "ai-content":
      "Este site oferece consultas de jogo de búzios e tarô online para todo o Brasil. Atendimento por texto, áudio ou vídeo, com sigilo e respeito à tradição afro-brasileira.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Inter:ital,wght@0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://calendly.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
      </head>
      <body>
        <Providers>
          <SpaceBackground />
          <div className="site-shell">
            <Navbar />
            <main className="site-main">{children}</main>
            <Footer />
            <WhatsAppFloat />
          </div>
        </Providers>
      </body>
    </html>
  );
}
