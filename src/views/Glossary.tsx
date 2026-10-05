"use client";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { glossaryCategories, glossary } from "@/data/glossary.js";
import { Button } from "@/components/Button";
import { Seo } from "@/components/Seo";
import { linkWhatsApp } from "@/utils/whatsapp.js";

type Verbete = {
  id: string;
  termo: string;
  categoria: string;
  definicao: string;
};

const verbetes = glossary as Verbete[];

/** Remove acentos para a busca não depender de maiúscula nem de til. */
function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function Glossary() {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todos");
  const [abertos, setAbertos] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    setAbertos((atual) => ({ ...atual, [hash]: true }));
    window.requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ block: "start" });
    });
  }, []);

  const filtrados = useMemo(() => {
    const q = normalizar(busca);
    return verbetes.filter((item) => {
      const daCategoria = categoria === "Todos" || item.categoria === categoria;
      if (!daCategoria) return false;
      if (!q) return true;
      return normalizar(`${item.termo} ${item.definicao}`).includes(q);
    });
  }, [busca, categoria]);

  const schema = useMemo(() => {
    const origem = "https://reinodemulambo.com";
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "DefinedTermSet",
          name: "Glossário de Búzios e Tarô — Reino de Mulambo",
          description: "Termos de búzios, tarô e práticas espirituais em linguagem simples.",
          hasDefinedTerm: verbetes.map((item) => ({
            "@type": "DefinedTerm",
            name: item.termo,
            description: item.definicao,
            inDefinedTermSet: "Glossário de Búzios e Tarô — Reino de Mulambo",
            url: `${origem}/glossario#${item.id}`,
          })),
        },
        {
          "@type": "FAQPage",
          mainEntity: verbetes.map((item) => ({
            "@type": "Question",
            name: `O que significa ${item.termo}?`,
            acceptedAnswer: { "@type": "Answer", text: item.definicao },
          })),
        },
      ],
    };
  }, []);

  const alternar = (id: string) => {
    setAbertos((atual) => ({ ...atual, [id]: !atual[id] }));
  };

  return (
    <>
      <Seo
        title="Glossário de Búzios e Tarô — Reino de Mulambo"
        description="Glossário de termos de búzios, tarô e práticas espirituais, em linguagem simples. Ninguém precisa saber nada para ser atendida."
        schema={schema}
      />
      <section className="page-hero">
        <div className="container-wide">
          <span className="eyebrow">Glossário</span>
          <h1 className="font-display mt-4 max-w-3xl text-[2.15rem] leading-tight sm:text-5xl md:text-7xl">
            As palavras que uso aqui
          </h1>
          <p className="mt-6 max-w-2xl leading-7 text-branco-lua/75">
            Muita gente chega sem conhecer os termos — e está tudo bem. Ninguém precisa saber nada para ser atendida.
            Este glossário é só um mapa leve, para a conversa ficar mais próxima.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-wide">
          <label className="block max-w-xl text-xs tracking-widest uppercase text-branco-lua/50">
            Buscar um termo
            <input
              className="field-input mt-2"
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Digite uma palavra — búzios, odu, tiragem…"
              aria-label="Buscar no glossário"
            />
          </label>

          <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Filtrar por categoria">
            {glossaryCategories.map((nome: string) => {
              const ativa = categoria === nome;
              return (
                <button
                  key={nome}
                  type="button"
                  role="tab"
                  aria-selected={ativa}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    ativa
                      ? "border-dourado bg-roxo-mistico text-branco-lua"
                      : "border-dourado/25 text-branco-lua/70 hover:border-roxo-claro"
                  }`}
                  onClick={() => setCategoria(nome)}
                >
                  {nome}
                </button>
              );
            })}
          </div>

          <div className="mt-10 grid gap-3 md:grid-cols-2">
            {filtrados.map((item) => {
              const aberto = Boolean(abertos[item.id]);
              const painelId = `verbete-painel-${item.id}`;
              return (
                <article key={item.id} id={item.id} className="mn-card scroll-mt-28 p-0">
                  <h2 className="m-0">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                      aria-expanded={aberto}
                      aria-controls={painelId}
                      onClick={() => alternar(item.id)}
                    >
                      <span>
                        <span className="font-display block text-2xl text-branco-lua">{item.termo}</span>
                        <span className="mt-1 block text-xs tracking-widest text-dourado uppercase">{item.categoria}</span>
                      </span>
                      <ChevronDown
                        size={20}
                        className="shrink-0 text-dourado transition-transform"
                        style={{ transform: aberto ? "rotate(180deg)" : undefined }}
                        aria-hidden="true"
                      />
                    </button>
                  </h2>
                  <div id={painelId} hidden={!aberto}>
                    <div className="border-t border-dourado/15 px-5 pt-4 pb-5">
                      <p className="text-sm leading-7 text-branco-lua/75">{item.definicao}</p>
                      <Button className="mt-4" href={linkWhatsApp("geral")} external variant="contornado">
                        Quero uma leitura
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {filtrados.length === 0 ? (
            <p className="mt-10 text-branco-lua/60">Nenhum verbete encontrado. Tente outra palavra ou me pergunte no WhatsApp.</p>
          ) : null}

          <div className="mt-20 rounded-2xl border border-dourado/25 bg-preto-carvao px-6 py-10 text-center">
            <h2 className="font-display text-3xl">Não encontrou a palavra que procurava? Me pergunte.</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-branco-lua/65">
              Toda consulta é online, por texto, áudio ou vídeo. A conversa começa sem exigência de vocabulário.
            </p>
            <Button className="mt-6" href={linkWhatsApp("geral")} external>
              Falar no WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
