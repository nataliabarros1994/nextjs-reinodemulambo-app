import { config } from "@/data/config.js";

/**
 * Injeta o JSON-LD estruturado da página.
 * Título, description, Open Graph e canonical agora vêm dos `metadata`
 * do Next.js (app/**), que são renderizados no servidor — melhor para SEO.
 */
export function Seo({
  schema,
}: {
  title?: string;
  description?: string;
  schema?: object;
  image?: string;
  type?: string;
}) {
  const jsonLd =
    schema ?? {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Consultas de Jogo de Búzios e Tarô online",
      description: config.seo.description,
      provider: {
        "@type": "Person",
        name: config.nome,
        email: config.email,
        telephone: `+${config.whatsapp}`,
        sameAs: [config.instagram],
      },
      areaServed: { "@type": "Country", name: "Brasil" },
      availableChannel: {
        "@type": "ServiceChannel",
        availableLanguage: "Portuguese",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Formatos de atendimento",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Consulta por texto" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Consulta por áudio" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Consulta por vídeo" } },
        ],
      },
    };
  return (
    <script
      type="application/ld+json"
      data-schema="mae-natalia"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
