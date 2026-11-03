# Reino de Mulambo

Site Next.js 15 do [reinodemulambo.com](https://reinodemulambo.com): jogo de búzios e tarô online.

**Pagamento:** Mercado Pago Checkout Pro (Pix ou cartão), primeiro.  
**Agenda:** Cal.com (`reinodemulambo`), só depois do pagamento.  
**Não usamos Calendly.**

Este repositório é a fonte do Worker Cloudflare `reino-de-mulambo`. O que está no `main` deve poder ser publicado sem surpresa.

## Como rodar

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm typecheck
pnpm test          # catálogo, Mercado Pago, Cal.com, newsletter, cookies — sem cobrança real
```

Credenciais ficam em `.env.local` (veja `.env.example`). Não commite `.env*`.

## O que editar no dia a dia

| O quê | Onde |
|---|---|
| Telefone, redes, horários, flags | `src/data/config.js` |
| Serviços e preços | `src/data/services.js` |
| FAQ, sobre, leitura, blog | `src/data/` e `src/content/blog/` |

Preços públicos (BRL): texto 60, áudio 80, ligação 150, vídeo 180, búzios 220, Maria Mulambo 400 (só quinta). Não alterar sem a Natalia.

## Publicar

```bash
pnpm run build:cf
npx wrangler deploy --keep-vars --autoconfig false --name reino-de-mulambo
```

`--keep-vars` preserva secrets já no Worker (`MERCADOPAGO_ACCESS_TOKEN`, `CALCOM_WEBHOOK_SECRET`, Klaviyo, Resend). Não publique a pasta `reino-worker-39-s2`.
