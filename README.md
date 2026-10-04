# Site Reino de Mulambo

Site profissional de Jogo de Búzios, Tarô e orientação espiritual. Tudo o que você precisa editar no dia a dia está na pasta `src/data/`.

## Como rodar

```bash
pnpm --filter @workspace/mae-natalia run dev
```

O projeto usa React + Vite + Tailwind. Não há backend: os formulários abrem o WhatsApp.

## Trocar telefone e redes

Abra `src/data/config.js`:

- `whatsapp` — só números, com DDI. Ex.: `5522981507669`
- `whatsappDisplay` — como aparece na tela
- `email`, `instagram`, `cidade` (texto do atendimento online), `horarios`
- `MOSTRAR_PRECOS` — `false` esconde qualquer valor das **leituras**
- `TRABALHOS_ATIVOS` — `false` esconde o menu e redireciona `/trabalhos` para a Home. Mude para `true` quando quiser publicar a página.

## Ativar a página de Trabalhos Espirituais

1. Em `src/data/config.js`, mude `TRABALHOS_ATIVOS` para `true`.
2. Revise os textos em `src/data/trabalhos.js`.
3. **Nenhum valor deve ser colocado nessa página.** A frase de preço permanece: valores só após a consulta.

## Mostrar preços das leituras (búzios e tarô)

1. Preencha o array `precos` em `src/data/servicos.js`.
2. Mude `MOSTRAR_PRECOS` para `true` em `src/data/config.js`.
3. Trabalhos espirituais continuam **sempre** sem valor divulgado.

## Trocar textos

| O que mudar | Arquivo |
|---|---|
| Contato, flags, SEO | `src/data/config.js` |
| Serviços e (opcional) preços | `src/data/servicos.js` |
| A Leitura | `src/data/leitura.js` |
| Depoimentos | `src/data/depoimentos.js` |
| FAQ | `src/data/faq.js` |
| Sobre, ética, preparação | `src/data/sobre.js` |
| Trabalhos espirituais | `src/data/trabalhos.js` |
| Blog | `src/data/blog.js` |
| Glossário | `src/data/glossario.js` |
| Vagas da semana | `src/data/agenda.js` |
| Tarô do Dia | `src/data/tarot.js` |
| Mensagens da jogada de búzios | `src/data/mensagens.js` |

## Trocar a foto

Substitua `attached_assets/natalia-retrato.png` pela foto real, mantendo o mesmo nome, ou altere o import em `src/pages/Home.tsx` e `src/pages/Sobre.tsx`.

## WhatsApp inteligente

A função `abrirWhatsApp(servico)` em `src/utils/whatsapp.js` monta uma mensagem diferente conforme a origem (búzios, tarô, leitura, presente, quiz…).

## Checklist antes de publicar

- [ ] Número de WhatsApp real em `config.js`
- [ ] Fotos reais no lugar do retrato atual, se quiser atualizar
- [ ] Textos do “Sobre” revisados com a sua voz
- [ ] Nenhum valor visível (a menos que `MOSTRAR_PRECOS` esteja `true` e só nas leituras)
- [ ] Testado no celular
- [ ] Domínio apontando para o site (ex.: `reinodemulambo.com.br`)
- [ ] Atualizar URLs de `public/sitemap.xml` e `public/robots.txt` para o domínio final
