import type { Metadata } from "next";
import { ThankYou } from "@/views/ThankYou";

export const metadata: Metadata = {
  title: "Obrigada — Reino de Mulambo",
  description:
    "Recebemos seu pedido. Nas próximas horas, a conversa continua no WhatsApp.",
};

export default function Page() {
  return <ThankYou />;
}
