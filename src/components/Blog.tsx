"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { config } from "@/data/config.js";
import { Button } from "@/components/Button";
import { Seo } from "@/components/Seo";
import { linkWhatsApp } from "@/utils/whatsapp.js";
import { Events } from "@/utils/analytics";

import { articles, articleList } from "@/lib/articles";

export function Blog() {
  return (
    <>
      <Seo
        title="Blog — Palavra e caminho | Reino de Mulambo"
        description="Escritos sobre búzios, tarô, autoconhecimento e espiritualidade no dia a dia. Consultas online por texto, áudio ou vídeo."
        image="/og-image.png"
      />
      <section className="page-hero">
        <div className="container-wide">
          <span className="eyebrow">Escritos</span>
          <h1 className="font-display mt-4 max-w-3xl text-[2.15rem] leading-tight sm:text-5xl md:text-7xl">
            Palavra e caminho
          </h1>
          <p className="mt-6 max-w-2xl text-[1.0625rem] leading-[1.7] text-branco-lua/75">
            Textos para chegar mais perto do oráculo sem pressa e sem espetáculo.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-wide">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articleList.map((artigo) => (
              <article key={artigo.slug}>
                <Link href={`/blog/${artigo.slug}`} className="blog-card-link mn-card block h-full overflow-hidden p-0">
                  <div className="p-5">
                    <p className="eyebrow">{artigo.categoria}</p>
                    <h2 className="font-display mt-2 text-2xl leading-snug">{artigo.titulo}</h2>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-branco-lua/65">{artigo.resumo}</p>
                    <p className="mt-4 text-xs tracking-wide text-branco-lua/50">
                      {artigo.tempoLeitura} · {artigo.data}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function BlogPost() {
  const params = useParams<{ slug: string }>();
  const artigo = articles[params.slug ?? ""];

  useEffect(() => {
    if (artigo) {
      Events.viewArticle(params.slug!, artigo.titulo);
    }
  }, [artigo, params.slug]);

  if (!artigo) {
    return (
      <section className="py-24 text-center">
        <Seo
          title="Artigo não encontrado | Reino de Mulambo"
          description="Este escrito não está no blog."
        />
        <h1 className="font-display text-4xl">Artigo não encontrado</h1>
        <Button className="mt-6" href="/blog" variant="contornado">
          Voltar ao blog
        </Button>
      </section>
    );
  }

  const { Content } = artigo;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: artigo.titulo,
    description: artigo.seoDescription,
    datePublished: artigo.dataIso,
    dateModified: artigo.dataIso,
    inLanguage: "pt-BR",
    articleSection: artigo.categoria,
    author: { "@type": "Person", name: config.nome, sameAs: [config.instagram] },
    publisher: { "@type": "Person", name: config.nome, sameAs: [config.instagram] },
  };

  return (
    <>
      <Seo
        title={artigo.seoTitle}
        description={artigo.seoDescription}
        type="article"
        schema={schema}
      />
      <article className="py-12 md:py-20">
        <div className="artigo-coluna">
          <p className="eyebrow">{artigo.categoria}</p>
          <h1 className="font-display mt-4 text-[2.15rem] leading-tight sm:text-5xl md:text-6xl">{artigo.titulo}</h1>
          <p className="mt-5 text-sm text-branco-lua/55">
            {artigo.data} · {artigo.tempoLeitura} de leitura
          </p>
          <div className="mt-10">
            <div className="artigo-leitura">
              <Content />
            </div>
          </div>

          <div className="mt-8">
            <Button
              href={linkWhatsApp("blog", `Acabei de ler o artigo "${artigo.titulo}" e gostaria de uma reading.`)}
              external
              variant="contornado"
            >
              Compartilhar no WhatsApp
            </Button>
          </div>

          <aside className="mt-14 rounded-2xl border border-dourado/25 bg-preto-carvao px-6 py-10 text-center">
            <h2 className="font-display text-3xl md:text-4xl">Quer uma leitura sobre o seu momento?</h2>
            <p className="mx-auto mt-3 max-w-lg text-[1.0625rem] leading-[1.7] text-branco-lua/65">
              A conversa é online, por texto, áudio ou vídeo.
            </p>
            <Button
              className="mt-6"
              href={linkWhatsApp("blog", `Li o artigo "${artigo.titulo}" e quero agendar.`)}
              external
            >
              Falar no WhatsApp
            </Button>
          </aside>
        </div>
      </article>
    </>
  );
}
