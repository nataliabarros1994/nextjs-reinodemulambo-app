# AGENTS.MD — Reino de Mulambo

> Guia operacional para agentes de IA (OpenCode, Cursor, Claude, etc.).
> Leia este arquivo antes de mexer no projeto.

## O que é este projeto

Site público do **Reino de Mulambo** — Jogo de Búzios e Tarô online (pt-BR).
Domínio: `https://reinodemulambo.com`

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/postcss`)
- **Framer Motion** para animações
- **MDX** para o blog (`@next/mdx` + `remark-frontmatter` + `remark-mdx-frontmatter`)
- **pnpm** como gerenciador de pacotes
- Deploy: Cloudflare Workers via OpenNext (`opennextjs-cloudflare`)

## Comandos

```bash
pnpm install     # instala dependências
pnpm dev         # servidor de desenvolvimento (:: / 0.0.0.0:3000)
pnpm build       # build de produção Next.js
pnpm start       # serve o build de produção
pnpm typecheck   # checagem de tipos (tsc --noEmit)
pnpm run build:cf  # bundle OpenNext para Cloudflare
pnpm run deploy    # publica o Worker reino-de-mulambo
```

## Estrutura

```
app/                  ← App Router (server components + metadata por página)
  layout.tsx          ← HTML shell, metadata global, fontes, providers
  page.tsx            ← uma pasta por rota pública
  blog/[slug]/        ← artigo SSG com generateStaticParams/generateMetadata
src/
  views/              ← componentes "de página" (client components, "use client")
  components/         ← componentes de UI compartilhados
  data/               ← conteúdo e configuração (textos ficam em PT)
  utils/              ← utilitários (whatsapp, payment, calcom, analytics, klaviyo)
  lib/                ← artigos do blog (articles.ts + articles.meta.ts)
  content/blog/       ← arquivos .mdx dos artigos
  hooks/              ← hooks React
public/               ← assets estáticos
```

## Convenções (OBRIGATÓRIO)

1. **Conteúdo em português, código em inglês.**
   Textos visíveis, rotas/slugs e mensagens de conteúdo ficam em pt-BR.
   Pastas, arquivos, funções, variáveis, componentes e exports em inglês.
2. **SEO vive nos server components** (`app/**/page.tsx` → `export const metadata`).
   O componente `src/components/Seo.tsx` hoje só injeta JSON-LD — não edite
   `document.title`/meta tags manualmente.
3. **Rotas públicas continuam em pt-BR** (`/sobre`, `/servicos`, `/blog/...`) por
   motivos de SEO e links existentes. Não "traduza" as pastas de rota.
4. Componentes que usam hooks/browser APIs precisam de `"use client"` no topo.
   Evite acessar `window`/`localStorage` durante o render — use guard
   (`typeof window !== "undefined"`) ou `useEffect`, senão quebra o SSR.
5. Artigos novos: crie `src/content/blog/<slug>.mdx` com frontmatter e registre
   também em `src/lib/articles.meta.ts` (usado por metadata/sitemap no servidor).
6. Site single-language (pt-BR). Não adicionar i18n sem combinado com o dono.
7. Integrações externas (Cal.com, Mercado Pago, Meta Pixel, GA4) vivem em
   `src/data/config.js` e em componentes específicos (`CalComEmbed`, `MetaPixel`,
   `Analytics`). **Agenda = Cal.com. Pagamento = Mercado Pago. Não usar Calendly.**

## Não faça sem checar

- Não remova o `"use client"` de `src/views/*` nem dos componentes com hooks.
- Não importe MDX (`.mdx`/`@/lib/articles`) em server components — use
  `@/lib/articles.meta.ts` (importar MDX no servidor quebra o build com
  "createContext is not a function").
- Não commite segredos. Credenciais reais ficam fora do repo (ver harness em
  `~/BUSINESS/REINO-DE-MULAMBO/credentials`).

## Produção (fonte da verdade)

- Este repositório é a fonte do Worker `reino-de-mulambo` em `reinodemulambo.com`.
- Fluxo: pagar no Mercado Pago (Pix/cartão) → depois agendar no Cal.com (`reinodemulambo`).
- Baseline publicado: Worker `54211c14` (cookie consent + privacidade + SEO das seis consultas).
- Deploy seguro: `pnpm run build:cf` e depois
  `npx wrangler deploy --keep-vars --autoconfig false --name reino-de-mulambo`
  a partir **desta** pasta. Não publicar `reino-worker-39-s2` (grants/D1/Calendly).
- Não adicione `d1_databases` nem `CALENDLY_API_TOKEN` neste Worker.
- Preços (não alterar sem a Natalia): texto 60, áudio 80, ligação 150, vídeo 180, búzios 220, Maria Mulambo 400 (quinta).

## Contexto de negócio

- Marca atual: **Reino de Mulambo** (antigo "Mãe Natália" — e-mail
  `contato.maenatalia@gmail.com` opera as contas).
- WhatsApp: (22) 98845-5946
- E-mail: contato.maenatalia@gmail.com
- Instagram: @reino_de.mulambo (https://www.instagram.com/reino_de.mulambo/)
- Facebook página: @Reino.de.Mulambo (https://www.facebook.com/profile.php?id=61595012546513)
- Facebook perfil: Reino de Mulambo (https://www.facebook.com/profile.php?id=61595037025273)
- TikTok: @reino.de.mulambo8 (https://www.tiktok.com/@reino.de.mulambo8)
