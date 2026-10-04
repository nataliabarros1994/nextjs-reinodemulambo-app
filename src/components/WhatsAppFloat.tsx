"use client";
import { MessageCircle } from "lucide-react";
import { linkWhatsApp } from "@/utils/whatsapp.js";

export function WhatsAppFloat() {
  return (
    <a
      className="wa-float"
      href={linkWhatsApp("geral")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com o Reino de Mulambo no WhatsApp"
    >
      <MessageCircle size={26} />
    </a>
  );
}
