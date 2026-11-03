// ============================================================
// SERVIÇOS — edite nomes, textos e, se quiser, o array precos.
// Os preços SÓ aparecem no site se config.MOSTRAR_PRECOS = true.
// Works espirituais nunca exibem valor.
// ============================================================

/** Formatos de atendimento — só estes três, em todo o site. */
export const serviceFormats = ["Texto", "Áudio", "Vídeo"];

/** Períodos sugeridos no formulário. Sem “ainda não sei”. */
export const consultationHours = ["Manhã", "Tarde", "Noite"];

export const services = [
  {
    id: "buzios",
    calcomSlug: "30min-buzios",
    nome: "Jogo de Búzios",
    resumo: "Oráculo de matriz africana para escutar caminhos, fundamentos e o que pede cuidado agora.",
    icone: "shell",
    duracao: "Encontro com tempo de escuta — duração combinada na conversa",
    formatos: ["Texto", "Áudio", "Vídeo"],
    oQueE:
      "O Jogo de Búzios é um oráculo de tradição afro-brasileira. As conchas são lançadas com respeito aos fundamentos e revelam Odus — caminhos, ensinamentos e possibilidades. Não é sentença: é uma escuta cuidadosa para iluminar o que está pedindo atenção.",
    oQueConsulta: [
      "Caminhos e decisões",
      "Amor e relações, sempre a partir da sua energia",
      "Trabalho, vocação e abertura de portas",
      "Família, proteção e firmeza espiritual",
      "O que pede cuidado no seu Orí (sua cabeça, seu destino pessoal)",
    ],
  },
  {
    id: "taro",
    calcomSlug: "30min-taro-texto",
    nome: "Leitura de Tarô",
    resumo: "Cartas como linguagem simbólica para clareza, escolhas e o momento que você está vivendo.",
    icone: "cards",
    duracao: "De uma tiragem objetiva a uma leitura ampla — combinamos o formato",
    formatos: ["Texto", "Áudio", "Vídeo"],
    oQueE:
      "O Tarô trabalha com imagens arquetípicas. Cada carta é um espelho: nomeia forças, dilemas e possibilidades. A leitura não adivinha o futuro como destino fechado — ela ajuda você a se ouvir com mais honestidade.",
    tiragens: [
      {
        nome: "Três Cartas",
        descricao: "Passado, presente e o que se abre à frente. Indicada para uma pergunta clara e objetiva.",
      },
      {
        nome: "Tiragem do Amor",
        descricao: "Olha o vínculo, o que cada parte traz e o que pede cuidado. Sempre a partir da sua posição na história.",
      },
      {
        nome: "Cruz Celta",
        descricao: "Leitura ampla: contexto, obstáculos, influências e o caminho possível. Para quem precisa de panorama.",
      },
      {
        nome: "Tiragem do Ano",
        descricao: "Doze casas para acompanhar o ciclo. Um mapa de reflexão, não um calendário de certezas.",
      },
    ],
  },
  {
    id: "orientacao",
    nome: "Orientação Espiritual",
    resumo: "Conversa de escuta e direção, com ou sem oráculo, para momentos de dúvida, luto ou recomeço.",
    icone: "moon",
    duracao: "Tempo reservado, sem pressa",
    formatos: ["Texto", "Áudio", "Vídeo"],
    oQueE:
      "Nem sempre o que se precisa é uma tiragem. Às vezes é um espaço para falar, nomear o que dói e receber orientação com fundamento, sem julgamento. A orientação pode incluir sugestões de cuidado — banhos, defumações, orações — sempre como convite, nunca como imposição.",
    oQueConsulta: [
      "Momentos de transição e recomeço",
      "Cansaço espiritual e necessidade de firmeza",
      "Dúvidas sobre o próprio caminho",
      "Como se preparar para uma consulta oracular",
    ],
  },
];

/**
 * Pagamento (Mercado Pago) acontece ANTES da agenda (Cal.com).
 * `calcomSlug` precisa bater com o evento público em cal.com/reinodemulambo.
 */
export const priceTable = [
  {
    id: "taro-texto",
    nome: "Leitura de Tarô por Mensagem (Texto)",
    formato: "Texto",
    duracao: "30 minutos",
    valor: "R$ 60,00",
    amountCents: 6000,
    descricao: "Tiragem focada em dúvidas pontuais com respostas objetivas gravadas por texto.",
    disponibilidade: "Segunda, terça, quarta e sexta",
    calcomSlug: "30min-taro-texto",
    destaque: false,
  },
  {
    id: "taro-audio",
    nome: "Leitura de Tarô por Áudio",
    formato: "Áudio",
    duracao: "30 minutos",
    valor: "R$ 80,00",
    amountCents: 8000,
    descricao: "Explicação detalhada em áudios para você ouvir e guardar quando quiser.",
    disponibilidade: "Segunda, terça, quarta e sexta",
    calcomSlug: "30min-taro-audio",
    destaque: false,
  },
  {
    id: "taro-ligacao",
    nome: "Leitura por Ligação (Voz)",
    formato: "Voz",
    duracao: "30 minutos",
    valor: "R$ 150,00",
    amountCents: 15000,
    descricao: "Atendimento por chamada de voz ao vivo para uma conversa fluida e orientativa.",
    disponibilidade: "Segunda, terça, quarta e sexta",
    calcomSlug: "30min-ligacao",
    destaque: false,
  },
  {
    id: "taro-video",
    nome: "Leitura de Tarô por Vídeo",
    formato: "Vídeo",
    duracao: "30 minutos",
    valor: "R$ 180,00",
    amountCents: 18000,
    descricao: "Chamada de vídeo ao vivo para acompanhar a tiragem das cartas em tempo real.",
    disponibilidade: "Segunda, terça, quarta e sexta",
    calcomSlug: "30min-taro-video",
    destaque: false,
  },
  {
    id: "buzios-tradicional",
    nome: "Jogo de Búzios Tradicional",
    formato: "Oráculo",
    duracao: "30 minutos",
    valor: "R$ 220,00",
    amountCents: 22000,
    descricao: "Orientação oracular profunda através dos Odús e forças dos Orixás.",
    disponibilidade: "Segunda, terça, quarta e sexta",
    calcomSlug: "30min-buzios",
    destaque: false,
  },
  {
    id: "maria-mulambo",
    nome: "Consulta Direta com Maria Mulambo",
    formato: "Entidade",
    duracao: "40 minutos",
    valor: "R$ 400,00",
    amountCents: 40000,
    descricao: "Atendimento espiritual reservado e direcionamento direto com a Entidade. Somente às quintas-feiras.",
    disponibilidade: "Somente quintas-feiras",
    calcomSlug: "40min-maria-mulambo",
    destaque: true,
    selo: "Consulta com a Entidade",
  },
];

/** Ofertas visíveis no site. Itens com `interno: true` ficam de fora. */
export const catalogPriceTable = priceTable.filter((item) => !item.interno);

export const precos = catalogPriceTable.map((item) => ({
  servicoId: item.id,
  formato: item.formato,
  valor: item.valor,
}));
