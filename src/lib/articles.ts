import * as oQueEBuzios from "@/content/blog/o-que-e-jogo-de-buzios.mdx";
import * as boaPergunta from "@/content/blog/como-fazer-uma-boa-pergunta-ao-oraculo.mdx";
import * as buziosOuTaro from "@/content/blog/buzios-ou-taro-qual-escolher.mdx";

export type Artigo = {
  titulo: string;
  categoria: string;
  resumo: string;
  tempoLeitura: string;
  data: string;
  dataIso: string;
  seoTitle: string;
  seoDescription: string;
  Content: React.ComponentType;
};

export const articles: Record<string, Artigo> = {
  "o-que-e-jogo-de-buzios": {
    titulo: oQueEBuzios.frontmatter.titulo,
    categoria: oQueEBuzios.frontmatter.categoria,
    resumo: oQueEBuzios.frontmatter.resumo,
    tempoLeitura: oQueEBuzios.frontmatter.tempoLeitura,
    data: oQueEBuzios.frontmatter.data,
    dataIso: oQueEBuzios.frontmatter.dataIso,
    seoTitle: oQueEBuzios.frontmatter.seoTitle,
    seoDescription: oQueEBuzios.frontmatter.seoDescription,
    Content: oQueEBuzios.default,
  },
  "como-fazer-uma-boa-pergunta-ao-oraculo": {
    titulo: boaPergunta.frontmatter.titulo,
    categoria: boaPergunta.frontmatter.categoria,
    resumo: boaPergunta.frontmatter.resumo,
    tempoLeitura: boaPergunta.frontmatter.tempoLeitura,
    data: boaPergunta.frontmatter.data,
    dataIso: boaPergunta.frontmatter.dataIso,
    seoTitle: boaPergunta.frontmatter.seoTitle,
    seoDescription: boaPergunta.frontmatter.seoDescription,
    Content: boaPergunta.default,
  },
  "buzios-ou-taro-qual-escolher": {
    titulo: buziosOuTaro.frontmatter.titulo,
    categoria: buziosOuTaro.frontmatter.categoria,
    resumo: buziosOuTaro.frontmatter.resumo,
    tempoLeitura: buziosOuTaro.frontmatter.tempoLeitura,
    data: buziosOuTaro.frontmatter.data,
    dataIso: buziosOuTaro.frontmatter.dataIso,
    seoTitle: buziosOuTaro.frontmatter.seoTitle,
    seoDescription: buziosOuTaro.frontmatter.seoDescription,
    Content: buziosOuTaro.default,
  },
};

export const articleList = Object.entries(articles)
  .map(([slug, a]) => ({ slug, ...a }))
  .sort((a, b) => (a.dataIso < b.dataIso ? 1 : -1));
