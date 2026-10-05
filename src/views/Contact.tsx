"use client";
import { CalendarDays, MessageCircle, Video } from "lucide-react";
import { config } from "@/data/config.js";
import { priceTable } from "@/data/services.js";
import { EmailLink } from "@/components/EmailLink";
import { InstagramLink } from "@/components/InstagramLink";
import { Button } from "@/components/Button";
import { Seo } from "@/components/Seo";
import { pathToPay } from "@/utils/payment.js";

export function Contact() {
  return (
    <>
      <Seo
        title="Agendar consulta — Reino de Mulambo | Tarô e búzios online"
        description="Escolha o encontro e confirme o horário no Calendly. O pagamento é feito na agenda, via Stripe."
      />
      <section className="page-hero">
        <div className="container-wide">
          <span className="eyebrow">contato</span>
          <h1 className="font-display mt-4">Agenda e pagamento no mesmo passo.</h1>
        </div>
      </section>
      <section className="pb-20">
        <div className="container-wide">
          <div className="mb-10 max-w-xl">
            <p className="leading-7 text-branco-lua/70">
              Escolha o serviço, confirme o horário no Calendly e pague ali mesmo, pelo Stripe. O WhatsApp fica só para dúvidas.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <p className="flex items-center gap-3">
                <MessageCircle size={16} className="text-dourado" /> {config.whatsappDisplay}
              </p>
              <EmailLink className="flex items-center gap-3 hover:text-dourado" iconSize={16} iconClassName="text-dourado" />
              <InstagramLink className="flex items-center gap-3" iconSize={16} iconClassName="text-dourado" />
              <p className="flex items-center gap-3">
                <Video size={16} className="text-dourado" /> {config.endereco}
              </p>
              <p className="flex items-center gap-3">
                <CalendarDays size={16} className="text-dourado" /> {config.horarios}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {priceTable.map((item: (typeof priceTable)[number]) => (
              <article key={item.id} className="rounded-2xl border border-dourado/20 p-5">
                <p className="text-xs uppercase tracking-widest text-dourado">{item.formato}</p>
                <h2 className="font-display mt-2 text-2xl">{item.nome}</h2>
                <p className="mt-2 text-sm text-branco-lua/60">{item.duracao}</p>
                <p className="mt-3 text-xl text-dourado">{item.valor}</p>
                <Button className="mt-5" href={pathToPay(item.id)}>
                  Agendar
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
