// ============================================================
// VAGAS DESTA SEMANA — edite os turnos disponíveis.
// Deixe turnos vazio [] se aquele dia não tiver vaga.
// ============================================================

export const agenda = {
  aviso: "Atendimento de segunda, terça, quarta e sexta, das 10h às 18h. Quintas-feiras: somente consulta com a Entidade. Pague a consulta para liberar o horário na agenda.",
  vagas: [
    { dia: "Segunda", turnos: ["manhã", "tarde"] },
    { dia: "Terça", turnos: ["manhã", "tarde"] },
    { dia: "Quarta", turnos: ["manhã", "tarde"] },
    { dia: "Quinta", turnos: ["Entidade"] },
    { dia: "Sexta", turnos: ["manhã", "tarde"] },
  ],
};
