"use client";
import { CalendarDays, Clock, MessageCircle } from "lucide-react";
import { priceTable } from "@/data/services.js";
import { Button } from "@/components/Button";
import { pathToPay } from "@/utils/payment.js";
import { linkWhatsAppOferta } from "@/utils/whatsapp.js";

export function PriceTable() {
  return (
    <div className="preco-grade">
      {priceTable.map((item: (typeof priceTable)[number]) => (
        <article
          key={item.id}
          className={item.destaque ? "preco-card preco-card-vip" : "preco-card"}
        >
          {item.destaque ? <span className="preco-selo">{item.selo}</span> : null}
          <p className="preco-formato">{item.formato}</p>
          <h3 className="preco-titulo">{item.nome}</h3>
          <p className="preco-desc">{item.descricao}</p>
          <p className="preco-tempo">
            <Clock size={14} /> {item.duracao}
          </p>
          <p className="preco-valor">{item.valor}</p>
          <div className="preco-acoes">
            <Button href={pathToPay(item.id)}>
              <CalendarDays size={16} /> Pay e agendar
            </Button>
            <Button href={linkWhatsAppOferta(item.nome, item.valor)} external variant="contornado">
              <MessageCircle size={16} /> Tirar dúvidas no WhatsApp
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
