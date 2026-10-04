const SYNODIC = 29.53058867;
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0);

const fases = [
  { ate: 1.84566, nome: "Lua Nova", key: "new", convite: "tempo de plantar intenções", mensagem: "Lua Nova: tempo de plantar intenções. O que você quer ver nascer neste ciclo?" },
  { ate: 5.53699, nome: "Lua Crescente", key: "waxing-crescent", convite: "dar o primeiro passo", mensagem: "Lua Crescente: a semente já está na terra. Um gesto pequeno hoje alimenta o ciclo." },
  { ate: 9.22832, nome: "Quarto Crescente", key: "first-quarter", convite: "avançar com foco", mensagem: "Quarto Crescente: hora de escolher um lado e seguir. A dúvida também se dissolve na ação." },
  { ate: 12.91966, nome: "Gibosa Crescente", key: "waxing-gibbous", convite: "nutrir e desenvolver", mensagem: "Gibosa Crescente: continue o que começou. O fruto pede constância, não pressa." },
  { ate: 16.61099, nome: "Lua Cheia", key: "full", convite: "reconhecer e celebrar", mensagem: "Lua Cheia: tempo de reconhecer o que já está visível. Celebre e solte o excesso." },
  { ate: 20.30232, nome: "Gibosa Minguante", key: "waning-gibbous", convite: "avaliar e compartilhar", mensagem: "Gibosa Minguante: compartilhe o que aprendeu. A luz que sobra ainda aquece." },
  { ate: 23.99366, nome: "Quarto Minguante", key: "last-quarter", convite: "fechar ciclos", mensagem: "Quarto Minguante: feche portas com gentileza. Nem tudo precisa ir com você." },
  { ate: 27.68499, nome: "Lua Minguante", key: "waning-crescent", convite: "descanso e recolhimento", mensagem: "Lua Minguante: recolha-se. O descanso também é ritual." },
  { ate: 29.53059, nome: "Lua Nova", key: "new", convite: "tempo de plantar intenções", mensagem: "Lua Nova: tempo de plantar intenções. O que você quer ver nascer neste ciclo?" },
];

export function getLunarPhase(date = new Date()) {
  const days = (date.getTime() - KNOWN_NEW_MOON) / 86400000;
  const age = ((days % SYNODIC) + SYNODIC) % SYNODIC;
  const fase = fases.find((item) => age < item.ate) ?? fases[0];
  return { ...fase, age, illumination: (1 - Math.cos((age / SYNODIC) * 2 * Math.PI)) / 2 };
}
