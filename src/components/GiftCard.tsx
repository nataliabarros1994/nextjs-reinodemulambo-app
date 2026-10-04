"use client";
import { Gift } from "lucide-react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { linkWhatsApp } from "@/utils/whatsapp.js";

export function GiftCard() {
  return (
    <Card className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-4">
        <Gift className="text-dourado" />
        <div>
          <h3 className="font-display text-2xl">Presenteie alguém com uma leitura</h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-branco-lua/65">
            Um vale para quem você ama — búzios ou tarô, no tempo dela. Combinamos tudo com discrição.
          </p>
        </div>
      </div>
      <Button href={linkWhatsApp("presente")} external>
        Quero presentear
      </Button>
    </Card>
  );
}
