"use client";
/**
 * Página A Leitura — /leitura
 * Textos em src/data/reading.js.
 */
import { reading } from "@/data/reading.js";
import { Button } from "@/components/Button";
import { DivisoriaZodiaco } from "@/components/ZodiacOrnament";
import { Seo } from "@/components/Seo";
import { linkWhatsApp } from "@/utils/whatsapp.js";

export function Reading() {
  const origem = "https://reinodemulambo.com";
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: reading.faq.map((item: { pergunta: string; resposta: string }) => ({
      "@type": "Question",
      name: item.pergunta,
      acceptedAnswer: { "@type": "Answer", text: item.resposta },
    })),
    url: `${origem}/leitura`,
    inLanguage: "pt-BR",
  };

  return (
    <>
      <Seo title={reading.seo.title} description={reading.seo.description} schema={schema} />

      <section className="page-hero">
        <div className="container-wide">
          <span className="eyebrow">{reading.eyebrow}</span>
          <h1 className="font-display mt-4 max-w-3xl text-[2.15rem] leading-tight sm:text-5xl md:text-7xl">
            {reading.titulo}
          </h1>
          <p className="mt-6 max-w-2xl text-[1.0625rem] leading-[1.7] text-branco-lua/75">{reading.apoio}</p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-wide">
          <h2 className="font-display text-3xl md:text-4xl">{reading.oraculos.titulo}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <article className="mn-card">
              <p className="eyebrow">oráculo</p>
              <h3 className="font-display mt-3 text-2xl">{reading.oraculos.buzios.titulo}</h3>
              <p className="mt-4 text-[1.0625rem] leading-[1.7] text-branco-lua/75">{reading.oraculos.buzios.texto}</p>
            </article>
            <article className="mn-card">
              <p className="eyebrow">oráculo</p>
              <h3 className="font-display mt-3 text-2xl">{reading.oraculos.taro.titulo}</h3>
              <p className="mt-4 text-[1.0625rem] leading-[1.7] text-branco-lua/75">{reading.oraculos.taro.texto}</p>
            </article>
          </div>
          <p className="mt-8 max-w-2xl text-[1.0625rem] leading-[1.7] text-branco-lua/80">{reading.oraculos.fecho}</p>
        </div>
      </section>

      <DivisoriaZodiaco indice={4} />

      <section className="py-16 md:py-20">
        <div className="container-wide">
          <h2 className="font-display text-3xl md:text-4xl">{reading.responde.titulo}</h2>
          <p className="mt-4 max-w-2xl text-[1.0625rem] leading-[1.7] text-branco-lua/75">{reading.responde.intro}</p>
          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {reading.responde.itens.map((item: string) => (
              <li
                key={item}
                className="rounded-2xl border border-dourado/20 bg-preto-carvao px-5 py-4 text-[1.0625rem] leading-[1.7] text-branco-lua/80"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <DivisoriaZodiaco indice={5} />

      <section className="py-16 md:py-20">
        <div className="container-wide">
          <div className="leitura-recusas">
            <p className="eyebrow">ética</p>
            <h2 className="font-display mt-3 text-3xl md:text-4xl">{reading.naoResponde.titulo}</h2>
            <p className="mt-4 max-w-2xl text-[1.0625rem] leading-[1.7] text-branco-lua/80">{reading.naoResponde.intro}</p>
            <div className="mt-10 space-y-6">
              {reading.naoResponde.itens.map((item: { titulo: string; texto: string }) => (
                <article key={item.titulo} className="border-l-2 border-vermelho-vivo/80 pl-5">
                  <h3 className="font-display text-xl text-branco-lua">{item.titulo}</h3>
                  <p className="mt-2 text-[1.0625rem] leading-[1.7] text-branco-lua/75">{item.texto}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-wide">
          <h2 className="font-display text-3xl md:text-4xl">{reading.pergunta.titulo}</h2>
          <p className="mt-4 max-w-2xl text-[1.0625rem] leading-[1.7] text-branco-lua/75">{reading.pergunta.intro}</p>
          <div className="mt-8 space-y-4">
            {reading.pergunta.exemplos.map((ex: { emVezDe: string; pergunte: string }) => (
              <article key={ex.emVezDe} className="mn-card">
                <p className="text-sm tracking-wide text-branco-lua/50 uppercase">Em vez de</p>
                <p className="mt-1 text-[1.0625rem] leading-[1.7] text-branco-lua/70">“{ex.emVezDe}”</p>
                <p className="mt-4 text-sm tracking-wide text-dourado uppercase">Pergunte</p>
                <p className="mt-1 text-[1.0625rem] leading-[1.7] text-branco-lua">{ex.pergunte}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <DivisoriaZodiaco indice={6} />

      <section className="py-16 md:py-20">
        <div className="container-wide">
          <h2 className="font-display text-3xl md:text-4xl">{reading.passos.titulo}</h2>
          <p className="mt-4 max-w-2xl text-[1.0625rem] leading-[1.7] text-branco-lua/75">{reading.passos.intro}</p>
          <ol className="mt-10 grid gap-5 md:grid-cols-2">
            {reading.passos.itens.map((passo: { n: string; titulo: string; texto: string }) => (
              <li key={passo.n} className="mn-card">
                <span className="text-dourado">{passo.n}</span>
                <h3 className="font-display mt-3 text-2xl">{passo.titulo}</h3>
                <p className="mt-2 text-[1.0625rem] leading-[1.7] text-branco-lua/70">{passo.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-wide">
          <h2 className="font-display text-3xl md:text-4xl">{reading.preparar.titulo}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {reading.preparar.itens.map((item: { titulo: string; texto: string }) => (
              <article key={item.titulo} className="mn-card">
                <h3 className="font-display text-2xl">{item.titulo}</h3>
                <p className="mt-3 text-[1.0625rem] leading-[1.7] text-branco-lua/70">{item.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-roxo-profundo/40 py-16 md:py-20">
        <div className="container-wide max-w-3xl text-center">
          <h2 className="font-display text-3xl md:text-4xl">{reading.fecho.titulo}</h2>
          <p className="mx-auto mt-4 max-w-xl text-[1.0625rem] leading-[1.7] text-branco-lua/75">{reading.fecho.texto}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href={linkWhatsApp("leitura")} external>
              Falar no WhatsApp
            </Button>
            <Button href="/servicos" variant="contornado">
              Ver a tabela de valores
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
