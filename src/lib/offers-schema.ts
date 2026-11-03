import { config } from "@/data/config.js";
import { catalogPriceTable } from "@/data/services.js";

export const SITE_URL = "https://reinodemulambo.com";

type CatalogOffer = {
  id: string;
  nome: string;
  amountCents: number;
  descricao?: string;
};

export function priceBRL(amountCents: number): string {
  return (amountCents / 100).toFixed(2);
}

export function pathToServicePage(id: string): string {
  return `/servicos/${id}`;
}

export function providerJsonLd() {
  return {
    "@type": "Person",
    name: config.nome,
    email: config.email,
    telephone: `+${config.whatsapp}`,
    sameAs: [
      config.instagram,
      config.facebookPage,
      config.facebookProfile,
      config.tiktok,
    ],
  };
}

export function offerCatalogJsonLd() {
  return {
    "@type": "OfferCatalog",
    name: "Consultas de tarô, jogo de búzios e entidade",
    itemListElement: (catalogPriceTable as CatalogOffer[]).map((item) => ({
      "@type": "Offer",
      name: item.nome,
      price: priceBRL(item.amountCents),
      priceCurrency: "BRL",
      url: `${SITE_URL}${pathToServicePage(item.id)}`,
      itemOffered: {
        "@type": "Service",
        name: item.nome,
        url: `${SITE_URL}${pathToServicePage(item.id)}`,
      },
    })),
  };
}

export function servicesPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Consultas de Jogo de Búzios e Tarô online",
    description: config.seo.description,
    url: `${SITE_URL}/servicos`,
    provider: providerJsonLd(),
    areaServed: { "@type": "Country", name: "Brasil" },
    availableChannel: {
      "@type": "ServiceChannel",
      availableLanguage: "Portuguese",
    },
    hasOfferCatalog: offerCatalogJsonLd(),
  };
}

export function serviceLandingJsonLd({
  id,
  nome,
  description,
  amountCents,
  faqs,
}: {
  id: string;
  nome: string;
  description: string;
  amountCents: number;
  faqs: Array<{ pergunta: string; resposta: string }>;
}) {
  const url = `${SITE_URL}${pathToServicePage(id)}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: nome,
        description,
        url,
        provider: providerJsonLd(),
        areaServed: { "@type": "Country", name: "Brasil" },
        availableChannel: {
          "@type": "ServiceChannel",
          availableLanguage: "Portuguese",
        },
        offers: {
          "@type": "Offer",
          price: priceBRL(amountCents),
          priceCurrency: "BRL",
          url,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.pergunta,
          acceptedAnswer: { "@type": "Answer", text: item.resposta },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Início",
            item: `${SITE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Serviços",
            item: `${SITE_URL}/servicos`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: nome,
            item: url,
          },
        ],
      },
    ],
  };
}
