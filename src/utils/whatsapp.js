import { config } from "../data/config.js";

const mensagens = {
  geral: "Olá, Reino de Mulambo! Vim pelo site e gostaria de agendar uma consulta.",
  buzios: "Olá, Reino de Mulambo! Vim pelo site e gostaria de agendar uma leitura de búzios.",
  taro: "Olá, Reino de Mulambo! Vim pelo site e gostaria de agendar uma leitura de tarô.",
  orientacao: "Olá, Reino de Mulambo! Vim pelo site e gostaria de uma orientação espiritual.",
  leitura: "Olá, Reino de Mulambo! Li a página A Leitura e gostaria de agendar uma consulta.",
  taroDoDia: "Olá, Reino de Mulambo! Tirei o Tarô do Dia no site e gostaria de aprofundar a reading.",
  vela: "Olá, Reino de Mulambo! Acendi uma vela no site e gostaria de agendar uma consulta.",
  quiz: "Olá, Reino de Mulambo! Fiz o quiz do site e gostaria de agendar a consulta sugerida.",
  presente: "Olá, Reino de Mulambo! Vim pelo site e gostaria de presentear alguém com uma reading.",
  trabalhos: "Olá, Reino de Mulambo! Gostaria de conversar sobre avaliação para um trabalho espiritual. Entendo que tudo começa pela consulta.",
  servicos: "Olá, Reino de Mulambo! Vi a página de serviços e gostaria de agendar.",
  contato: "Olá, Reino de Mulambo! Estou na página de contato e gostaria de agendar.",
  home: "Olá, Reino de Mulambo! Vim pela página inicial do site e gostaria de agendar uma consulta.",
  blog: "Olá, Reino de Mulambo! Li um artigo no site e gostaria de agendar uma consulta.",
};

export function mensagemWhatsApp(servico = "geral", extra = "") {
  const base = mensagens[servico] || messages.geral;
  return extra ? `${base}\n\n${extra}` : base;
}

export function linkWhatsAppOferta(nome, valor = "") {
  const extra = valor ? ` (${valor})` : "";
  const texto = `Olá, Reino de Mulambo! Vim pelo site e tenho uma dúvida sobre: ${nome}${extra}.`;
  const numero = String(config.whatsapp ?? "").replace(/\D/g, "");
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}

export function linkWhatsApp(servico = "geral", extra = "") {
  const texto = mensagemWhatsApp(servico, extra);
  const numero = String(config.whatsapp ?? "").replace(/\D/g, "");
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}

export function abrirWhatsApp(servico = "geral", extra = "") {
  const url = linkWhatsApp(servico, extra);
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
  return url;
}
