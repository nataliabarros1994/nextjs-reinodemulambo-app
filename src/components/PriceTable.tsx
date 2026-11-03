"use client";
import Link from "next/link";
import { CalendarDays, Clock, MessageCircle } from "lucide-react";
import { catalogPriceTable } from "@/data/services.js";
import { Button } from "@/components/Button";
import { pathToServicePage } from "@/lib/offers-schema";
import { pathToPay } from "@/utils/payment.js";
import { linkWhatsAppOferta } from "@/utils/whatsapp.js";

export function PriceTable() {
  return (
    <div className="preco-grade">
      {catalogPriceTable.map((item: (typeof catalogPriceTable)[number]) => (
        <article
          key={item.id}
          className={item.destaque ? "preco-card preco-card-vip" : "preco-card"}
        >
          {item.destaque ? <span className="preco-selo">{item.selo}</span> : null}
          <p className="preco-formato">{item.formato}</p>
          <h3 className="preco-titulo">
            <Link href={pathToServicePage(item.id)} className="hover:text-dourado">
              {item.nome}
            </Link>
          </h3>
          <p className="preco-desc">{item.descricao}</p>
          <p className="preco-tempo">
            <Clock size={14} /> {item.duracao}
            {item.disponibilidade ? ` · ${item.disponibilidade}` : ""}
          </p>
          <p className="preco-valor">{item.valor}</p>
          <div className="preco-acoes">
            <Button href={pathToPay(item.id)}>
              <CalendarDays size={16} /> Pagar e agendar
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
