declare module "*.mdx" {
  import type { ComponentType } from "react";
  
  interface Frontmatter {
    titulo: string;
    categoria: string;
    resumo: string;
    tempoLeitura: string;
    data: string;
    dataIso: string;
    seoTitle: string;
    seoDescription: string;
    [key: string]: unknown;
  }

  export const frontmatter: Frontmatter;
  const Component: ComponentType;
  export default Component;
}
