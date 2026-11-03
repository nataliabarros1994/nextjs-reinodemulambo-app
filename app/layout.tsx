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
    "Consulta de tarô online e jogo de búzios com a Mãe Natália. Taróloga e oráculo afro-brasileiro por texto, áudio, WhatsApp, ligação ou vídeo. Sigilo, para todo o Brasil.",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: SITE_URL,
    locale: "pt_BR",
    siteName: "Reino de Mulambo",
    title: "Reino de Mulambo — Jogo de Búzios e Tarô Online",
    description:
      "Consulta de tarô online e jogo de búzios para todo o Brasil. Texto, áudio, WhatsApp, ligação ou vídeo. Sigilo e respeito.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Reino de Mulambo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reino de Mulambo — Jogo de Búzios e Tarô Online",
    description:
      "Consulta de tarô online e jogo de búzios para todo o Brasil. Texto, áudio, WhatsApp, ligação ou vídeo.",
    images: ["/og-image.png"],
  },
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
  viewportFit: "cover",
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
        <link rel="preconnect" href="https://cal.com" />
        <link rel="preconnect" href="https://app.cal.com" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(function(r){r.forEach(function(x){x.unregister()})});}if(window.caches){caches.keys().then(function(k){k.forEach(function(n){caches.delete(n)})})}",
          }}
        />
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
