"use client";
import { MessageCircle } from "lucide-react";
import { config } from "@/data/config.js";
import { linkWhatsApp } from "@/utils/whatsapp.js";
import { Button } from "@/components/Button";

export function SessionPrice({
  origem = "geral",
  destaque = false,
}: {
  origem?: string;
  destaque?: boolean;
}) {
  return (
    <div
      className={
        destaque
          ? "rounded-2xl border border-dourado/40 bg-preto-carvao p-6 text-center"
          : "text-center"
      }
    >
      <p className="font-display text-xl text-branco-lua">
        Valores informados somente mediante consulta
      </p>
      {config.MOSTRAR_PRECOS ? null : (
        <p className="mt-2 text-sm text-branco-lua/60">
          Cada leitura é combinada no WhatsApp, com clareza e sem surpresa.
        </p>
      )}
      <Button className="mt-5" href={linkWhatsApp(origem)} external>
        <MessageCircle size={16} /> Falar no WhatsApp
      </Button>
    </div>
  );
}
