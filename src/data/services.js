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
    calendlySlug: "30min-buzios",
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
    calendlySlug: "30min-taro-texto",
    nome: "Reading de Tarô",
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
        descricao: "Reading ampla: contexto, obstáculos, influências e o caminho possível. Para quem precisa de panorama.",
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
 * Pagamento (Stripe) acontece ANTES da agenda (Calendly).
 * Crie no Calendly um evento com o mesmo slug de `calendlySlug`.
 */
export const priceTable = [
  {
    id: "taro-texto",
    nome: "Reading de Tarô por Mensagem (Texto)",
    formato: "Texto",
    duracao: "30 minutos",
    valor: "R$ 60,00",
    descricao: "Tiragem focada em dúvidas pontuais com respostas objetivas gravadas por texto.",
    calendlySlug: "30min-taro-texto",
    stripePaymentUrl: "https://buy.stripe.com/test_8x25kF5Xse1pfn48PXfYY00",
    stripePaymentLinkId: "plink_1UG0OAQVZOoqzm8wLLRfe5R4",
    destaque: false,
  },
  {
    id: "taro-audio",
    nome: "Reading de Tarô por Áudio",
    formato: "Áudio",
    duracao: "30 minutos",
    valor: "R$ 80,00",
    descricao: "Explicação detalhada em áudios para você ouvir e guardar quando quiser.",
    calendlySlug: "30min-taro-audio",
    stripePaymentUrl: "https://buy.stripe.com/test_8x29AV0D86yX1wefelfYY01",
    stripePaymentLinkId: "plink_1UG0OBQVZOoqzm8wDHbyJs8N",
    destaque: false,
  },
  {
    id: "taro-ligacao",
    nome: "Reading por Ligação (Voz)",
    formato: "Voz",
    duracao: "30 minutos",
    valor: "R$ 150,00",
    descricao: "Atendimento por chamada de voz ao vivo para uma conversa fluida e orientativa.",
    calendlySlug: "30min-ligacao",
    stripePaymentUrl: "https://buy.stripe.com/test_eVq8wRadI3mL2Ai0jrfYY02",
    stripePaymentLinkId: "plink_1UG0ODQVZOoqzm8w57z7sdLw",
    destaque: false,
  },
  {
    id: "taro-video",
    nome: "Reading de Tarô por Vídeo",
    formato: "Vídeo",
    duracao: "30 minutos",
    valor: "R$ 180,00",
    descricao: "Chamada de vídeo ao vivo para acompanhar a tiragem das cartas em tempo real.",
    calendlySlug: "30min-taro-video",
    stripePaymentUrl: "https://buy.stripe.com/test_00w9AV4Tof5ta2K2rzfYY03",
    stripePaymentLinkId: "plink_1UG0OEQVZOoqzm8wPVwlGFMa",
    destaque: false,
  },
  {
    id: "buzios-tradicional",
    nome: "Jogo de Búzios Tradicional",
    formato: "Oráculo",
    duracao: "30 minutos",
    valor: "R$ 220,00",
    descricao: "Orientação oracular profunda através dos Odús e forças dos Orixás.",
    calendlySlug: "30min-buzios",
    stripePaymentUrl: "https://buy.stripe.com/test_14A8wR0D85uTa2K0jrfYY04",
    stripePaymentLinkId: "plink_1UG0OGQVZOoqzm8w9T3fjUf9",
    destaque: false,
  },
  {
    id: "maria-mulambo",
    nome: "Consulta Direta com Maria Mulambo",
    formato: "VIP",
    duracao: "45 min a 1 hora",
    valor: "R$ 400,00",
    descricao: "Atendimento espiritual reservado e direcionamento direto com a Entidade.",
    calendlySlug: "60min-maria-mulambo",
    stripePaymentUrl: "https://buy.stripe.com/test_5kQbJ3gC68H52AigipfYY05",
    stripePaymentLinkId: "plink_1UG0OIQVZOoqzm8wfwD84xgd",
    destaque: true,
    selo: "Atendimento VIP",
  },
];

export const precos = priceTable.map((item) => ({
  servicoId: item.id,
  formato: item.formato,
  valor: item.valor,
}));
