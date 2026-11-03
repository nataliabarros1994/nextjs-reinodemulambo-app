import { catalogPriceTable } from "@/data/services.js";

export const SERVICE_LANDING_IDS = [
  "taro-texto",
  "taro-audio",
  "taro-ligacao",
  "taro-video",
  "buzios-tradicional",
  "maria-mulambo",
] as const;

export type ServiceLandingId = (typeof SERVICE_LANDING_IDS)[number];

export type ServiceLandingCopy = {
  seoTitle: string;
  seoDescription: string;
  h1: string;
  eyebrow: string;
  lead: string;
  howItWorks: string[];
  includes: string[];
  faqs: Array<{ pergunta: string; resposta: string }>;
  related: ServiceLandingId[];
  extraLinks: Array<{ href: string; label: string }>;
};

type CatalogOffer = {
  id: string;
  nome: string;
  formato: string;
  duracao: string;
  valor: string;
  amountCents: number;
  descricao: string;
  disponibilidade: string;
};

export function isServiceLandingId(id: string): id is ServiceLandingId {
  return (SERVICE_LANDING_IDS as readonly string[]).includes(id);
}

export const serviceLandings: Record<ServiceLandingId, ServiceLandingCopy> = {
  "taro-texto": {
    seoTitle: "Tarô por texto online | Consulta R$ 60 | Reino de Mulambo",
    seoDescription:
      "Consulta de tarô por mensagem com a Mãe Natália. 30 minutos, R$ 60. Pague no Mercado Pago e depois escolha o horário. Atendimento online para todo o Brasil.",
    h1: "Tarô por texto online",
    eyebrow: "consulta por mensagem",
    lead:
      "Uma leitura de tarô por escrito, para quem prefere ler com calma e guardar as palavras. A Mãe Natália tira as cartas e responde por texto, no horário agendado, com sigilo.",
    howItWorks: [
      "Você escolhe esta consulta, paga R$ 60 no Mercado Pago (Pix ou cartão) e só então abre a agenda.",
      "No horário marcado, a leitura acontece por mensagem: você traz a pergunta ou o que está pedindo direção.",
      "A resposta chega por texto, para reler depois. Não é tarô automático, aplicativo nem inteligência artificial.",
    ],
    includes: [
      "30 minutos de atendimento por texto",
      "Leitura feita por uma pessoa, com as cartas",
      "Foco em uma dúvida clara ou no que pede cuidado agora",
      "Disponível de segunda a quarta e sexta",
    ],
    faqs: [
      {
        pergunta: "Como funciona o tarô por texto?",
        resposta:
          "Depois do pagamento e do horário marcado, a conversa e a leitura acontecem por mensagem. Você escreve o que precisa; a resposta da tiragem também vem por escrito.",
      },
      {
        pergunta: "Quanto custa e quanto dura?",
        resposta:
          "A consulta de tarô por texto custa R$ 60 e dura 30 minutos. O valor aparece nesta página e na página de Serviços.",
      },
      {
        pergunta: "A leitura promete o que vai acontecer?",
        resposta:
          "Não. O tarô nomeia forças, dilemas e possibilidades. É uma escuta simbólica, não uma previsão fechada nem garantia de resultado.",
      },
      {
        pergunta: "Como pago e como marco o horário?",
        resposta:
          "O pagamento no Mercado Pago vem primeiro (Pix ou cartão). O horário no Cal.com só abre depois. O valor da consulta não é reembolsável.",
      },
    ],
    related: ["taro-audio", "taro-ligacao", "taro-video", "buzios-tradicional"],
    extraLinks: [
      { href: "/leitura", label: "Como funciona uma leitura" },
      { href: "/blog/como-fazer-uma-boa-pergunta-ao-oraculo", label: "Como fazer uma boa pergunta ao oráculo" },
    ],
  },
  "taro-audio": {
    seoTitle: "Tarô por áudio online | Consulta R$ 80 | Reino de Mulambo",
    seoDescription:
      "Consulta de tarô por áudio com a Mãe Natália. 30 minutos, R$ 80. Explicação gravada para ouvir depois. Pague e depois escolha o horário. Todo o Brasil.",
    h1: "Tarô por áudio online",
    eyebrow: "consulta em áudio",
    lead:
      "Uma leitura de tarô explicada em áudio, para ouvir com atenção e guardar. Serve quem prefere a voz à mensagem escrita, sem precisar de chamada ao vivo.",
    howItWorks: [
      "Você paga R$ 80 no Mercado Pago e, em seguida, escolhe o horário.",
      "No encontro, a tiragem é explicada em áudios: o que as cartas mostram e o que pede cuidado.",
      "Você pode ouvir de novo depois. Continua sendo uma leitura humana, não um áudio genérico nem um aplicativo.",
    ],
    includes: [
      "30 minutos de atendimento por áudio",
      "Explicação da tiragem para ouvir e guardar",
      "Espaço para a sua pergunta no horário marcado",
      "Disponível de segunda a quarta e sexta",
    ],
    faqs: [
      {
        pergunta: "Qual a diferença entre tarô por texto e por áudio?",
        resposta:
          "No texto, a resposta chega por escrito. No áudio, a explicação da tiragem vem na voz, com mais detalhe para quem prefere ouvir. Duração e fluxo de pagamento são os mesmos: 30 minutos, pague e depois agenda.",
      },
      {
        pergunta: "Quanto custa o tarô por áudio?",
        resposta: "R$ 80 por 30 minutos, conforme a tabela de Serviços.",
      },
      {
        pergunta: "Preciso estar ao vivo o tempo todo?",
        resposta:
          "O horário é reservado para o atendimento. Os áudios da leitura ficam para você ouvir de novo. Não é uma chamada de voz; para conversa ao vivo, existe a consulta por ligação.",
      },
      {
        pergunta: "Posso pedir reembolso?",
        resposta:
          "Não. O pagamento da consulta não é reembolsável. Pix é à vista. No cartão, juros da operadora ficam por conta de quem paga.",
      },
    ],
    related: ["taro-texto", "taro-ligacao", "taro-video"],
    extraLinks: [
      { href: "/leitura", label: "Como funciona uma leitura" },
      { href: "/servicos", label: "Ver todos os serviços" },
    ],
  },
  "taro-ligacao": {
    seoTitle: "Tarô por ligação | Consulta ao vivo R$ 150 | Reino de Mulambo",
    seoDescription:
      "Consulta de tarô por ligação com a Mãe Natália. 30 minutos ao vivo, R$ 150. Conversa de voz depois do pagamento. Atendimento online para todo o Brasil.",
    h1: "Tarô por ligação",
    eyebrow: "consulta ao vivo por voz",
    lead:
      "Uma leitura de tarô em chamada de voz, para quem precisa conversar no momento. A tiragem acontece ao vivo, com tempo para perguntas e escuta.",
    howItWorks: [
      "Você paga R$ 150 no Mercado Pago e escolhe o horário na agenda.",
      "No horário marcado, a consulta acontece por ligação: conversa de voz, cartas na hora, espaço para matizar a pergunta.",
      "Não substitui terapia, medicina ou aconselhamento jurídico. É uma leitura espiritual, com sigilo.",
    ],
    includes: [
      "30 minutos de chamada de voz ao vivo",
      "Tiragem acompanhada na conversa",
      "Tempo para esclarecer o que você trouxe",
      "Disponível de segunda a quarta e sexta",
    ],
    faqs: [
      {
        pergunta: "A ligação é por telefone ou por internet?",
        resposta:
          "O encontro é uma consulta de voz ao vivo, combinada no agendamento. Os detalhes do canal entram no horário marcado, depois do pagamento.",
      },
      {
        pergunta: "Quanto custa o tarô por ligação?",
        resposta: "R$ 150 por 30 minutos. O pagamento libera a agenda; o valor não é reembolsável.",
      },
      {
        pergunta: "E se eu preferir ver as cartas?",
        resposta:
          "Para acompanhar a tiragem em imagem, existe a consulta de tarô por vídeo, de 30 minutos, a R$ 180.",
      },
      {
        pergunta: "A consulta resolve o meu problema?",
        resposta:
          "Nenhuma leitura promete resultado. A ligação oferece presença e uma leitura das cartas no seu tempo. A decisão e o caminho continuam sendo seus.",
      },
    ],
    related: ["taro-video", "taro-audio", "taro-texto"],
    extraLinks: [
      { href: "/leitura", label: "Como funciona uma leitura" },
      { href: "/contato", label: "Dúvidas antes de pagar" },
    ],
  },
  "taro-video": {
    seoTitle: "Tarô por vídeo online | Consulta R$ 180 | Reino de Mulambo",
    seoDescription:
      "Consulta de tarô por vídeo com a Mãe Natália. 30 minutos ao vivo, R$ 180. Acompanhe a tiragem das cartas em chamada de vídeo. Pague e depois escolha o horário.",
    h1: "Tarô por vídeo online",
    eyebrow: "consulta ao vivo por vídeo",
    lead:
      "Uma leitura de tarô em chamada de vídeo, para ver as cartas no momento em que saem. Conversa ao vivo, com imagem e tempo de escuta.",
    howItWorks: [
      "Você paga R$ 180 no Mercado Pago (Pix ou cartão) e, depois, escolhe o horário.",
      "No encontro, a tiragem acontece em vídeo: você vê as cartas e conversa sobre o que elas mostram.",
      "É um atendimento reservado, não uma live pública nem um tarô de aplicativo.",
    ],
    includes: [
      "30 minutos de chamada de vídeo ao vivo",
      "Acompanhamento da tiragem em tempo real",
      "Conversa para situar a pergunta",
      "Disponível de segunda a quarta e sexta",
    ],
    faqs: [
      {
        pergunta: "Preciso ligar a câmera?",
        resposta:
          "A consulta é por vídeo para você acompanhar as cartas. Combinamos o essencial no horário marcado. O sigilo do que for dito permanece.",
      },
      {
        pergunta: "Quanto custa o tarô por vídeo?",
        resposta: "R$ 180 por 30 minutos, conforme a tabela pública de Serviços.",
      },
      {
        pergunta: "Qual a diferença para a ligação?",
        resposta:
          "Na ligação, a conversa é só por voz. No vídeo, você acompanha a tiragem com imagem. Ambas duram 30 minutos e seguem o fluxo pague-depois-agenda.",
      },
      {
        pergunta: "Isso substitui um tratamento?",
        resposta:
          "Não. A consulta tem caráter espiritual e religioso. Não substitui acompanhamento médico, psicológico ou jurídico.",
      },
    ],
    related: ["taro-ligacao", "taro-audio", "taro-texto", "buzios-tradicional"],
    extraLinks: [
      { href: "/leitura", label: "Como funciona uma leitura" },
      { href: "/blog/buzios-ou-taro-qual-escolher", label: "Búzios ou tarô: qual escolher" },
    ],
  },
  "buzios-tradicional": {
    seoTitle: "Jogo de búzios online | Consulta R$ 220 | Reino de Mulambo",
    seoDescription:
      "Jogo de búzios online com a Mãe Natália. 30 minutos, R$ 220. Oráculo de matriz africana, com tempo de escuta. Pague e depois escolha o horário. Todo o Brasil.",
    h1: "Jogo de búzios online",
    eyebrow: "oráculo de matriz africana",
    lead:
      "Uma consulta de jogo de búzios, online, com respeito aos fundamentos. As conchas apontam Odus — caminhos e o que pede cuidado agora. Não é adivinhação de palco nem aplicativo.",
    howItWorks: [
      "Você paga R$ 220 no Mercado Pago e só então escolhe o horário.",
      "No encontro de 30 minutos, o jogo é feito com escuta: o que as conchas mostram e o que cabe orientar com clareza.",
      "A leitura foca o seu caminho. Não abrimos fundamento ritual em espetáculo e não prometemos resultado.",
    ],
    includes: [
      "30 minutos de consulta de jogo de búzios",
      "Orientação oracular com tempo de escuta",
      "Atendimento 100% online para todo o Brasil",
      "Disponível de segunda a quarta e sexta",
    ],
    faqs: [
      {
        pergunta: "O que é o jogo de búzios nesta consulta?",
        resposta:
          "É um oráculo de matriz africana. As conchas são lançadas com respeito e revelam Odus — caminhos, ensinamentos e o que pede atenção. Não é sentença nem show.",
      },
      {
        pergunta: "Quanto custa o jogo de búzios?",
        resposta: "R$ 220 por 30 minutos. Pagamento primeiro, agenda depois. Sem reembolso.",
      },
      {
        pergunta: "Búzios ou tarô: qual escolher?",
        resposta:
          "O tarô trabalha com cartas e imagens. O jogo de búzios é oráculo de matriz africana, ligado aos Odus. Não há hierarquia: a pergunta e o momento indicam a linguagem. Há um texto no blog sobre essa escolha.",
      },
      {
        pergunta: "Preciso saber de religião para consultar?",
        resposta:
          "Não. Ninguém precisa chegar sabendo termos. A consulta explica o necessário com linguagem direta, sem expor o que não cabe em público.",
      },
    ],
    related: ["maria-mulambo", "taro-texto", "taro-video"],
    extraLinks: [
      { href: "/blog/o-que-e-jogo-de-buzios", label: "O que é o jogo de búzios" },
      { href: "/blog/buzios-ou-taro-qual-escolher", label: "Búzios ou tarô: qual escolher" },
      { href: "/glossario", label: "Glossário" },
    ],
  },
  "maria-mulambo": {
    seoTitle: "Consulta com Maria Mulambo | Quintas, 40 min, R$ 400 | Reino de Mulambo",
    seoDescription:
      "Consulta direta com Maria Mulambo. 40 minutos, R$ 400, somente às quintas-feiras. Atendimento espiritual reservado, online. Pague e depois escolha o horário.",
    h1: "Consulta com Maria Mulambo",
    eyebrow: "consulta com a Entidade",
    lead:
      "Um atendimento espiritual reservado, de 40 minutos, somente às quintas-feiras. A consulta é com a Entidade Maria Mulambo, com direcionamento direto e sigilo. Vagas e horários seguem essa disponibilidade.",
    howItWorks: [
      "Esta consulta acontece só às quintas-feiras. Dura 40 minutos e custa R$ 400.",
      "Você paga no Mercado Pago e, depois, escolhe um horário de quinta na agenda.",
      "É um encontro reservado, não um recado público nem uma consulta de tarô comum. Não prometemos resultado e não substituímos cuidado médico ou psicológico.",
    ],
    includes: [
      "40 minutos de consulta com a Entidade",
      "Somente quintas-feiras",
      "Atendimento online, com sigilo",
      "Pagamento primeiro; horário depois",
    ],
    faqs: [
      {
        pergunta: "Por que só às quintas-feiras?",
        resposta:
          "A disponibilidade desta consulta é exclusiva das quintas. Leituras de tarô e jogo de búzios ocupam segunda, terça, quarta e sexta.",
      },
      {
        pergunta: "Quanto custa e quanto dura?",
        resposta: "R$ 400 por 40 minutos. O valor e a duração estão na tabela de Serviços e nesta página.",
      },
      {
        pergunta: "É a mesma coisa que uma leitura de tarô?",
        resposta:
          "Não. Tarô e búzios são oráculos com tempo e preço próprios. Esta consulta é o atendimento espiritual com a Entidade, em horário reservado de quinta.",
      },
      {
        pergunta: "Há garantia de que um trabalho será feito?",
        resposta:
          "Não. Toda orientação é conversada com clareza. Não há promessa de resultado nem indicação genérica. Respeito, ética e a sua liberdade vêm primeiro.",
      },
    ],
    related: ["buzios-tradicional", "taro-video", "taro-ligacao"],
    extraLinks: [
      { href: "/sobre", label: "Sobre o Reino de Mulambo" },
      { href: "/leitura", label: "Como funciona uma leitura" },
    ],
  },
};

export function findServiceLanding(id: string) {
  if (!isServiceLandingId(id)) return null;
  const offer = (catalogPriceTable as CatalogOffer[]).find((item) => item.id === id);
  const copy = serviceLandings[id];
  if (!offer || !copy) return null;
  return { offer, copy };
}
