"use client";
import { CalendarDays, MessageCircle, Video } from "lucide-react";
import { config } from "@/data/config.js";
import { catalogPriceTable } from "@/data/services.js";
import { EmailLink } from "@/components/EmailLink";
import { SocialLinks } from "@/components/SocialLinks";
import { Button } from "@/components/Button";
import { Seo } from "@/components/Seo";
import { pathToPay } from "@/utils/payment.js";

export function Contact() {
  return (
    <>
      <Seo
        title="Agendar consulta — Reino de Mulambo | Tarô e búzios online"
        description="Escolha o encontro, pague e depois confirme o horário. O pagamento libera a agenda."
      />
      <section className="page-hero">
        <div className="container-wide">
          <span className="eyebrow">contato</span>
          <h1 className="font-display mt-4">Pague primeiro, depois escolha o horário.</h1>
        </div>
      </section>
      <section className="pb-20">
        <div className="container-wide">
          <div className="mb-10 max-w-xl">
            <p className="leading-7 text-branco-lua/70">
              Escolha o serviço, pague no Mercado Pago e só então a agenda abre. O WhatsApp fica para dúvidas.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <p className="flex items-center gap-3">
                <MessageCircle size={16} className="text-dourado" /> {config.whatsappDisplay}
              </p>
              <EmailLink className="flex min-h-11 items-center gap-3 hover:text-dourado" iconSize={16} iconClassName="text-dourado" />
              <div className="flex basis-full flex-wrap gap-x-6 gap-y-3">
                <SocialLinks className="flex min-h-11 items-center gap-3" iconSize={16} iconClassName="text-dourado" />
              </div>
              <p className="flex items-center gap-3">
                <Video size={16} className="text-dourado" /> {config.endereco}
              </p>
              <p className="flex items-center gap-3">
                <CalendarDays size={16} className="text-dourado" /> {config.horarios}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {catalogPriceTable.map((item: (typeof catalogPriceTable)[number]) => (
              <article key={item.id} className="rounded-2xl border border-dourado/20 p-5">
                <p className="text-xs uppercase tracking-widest text-dourado">{item.formato}</p>
                <h2 className="font-display mt-2 text-2xl">{item.nome}</h2>
                <p className="mt-2 text-sm text-branco-lua/60">{item.duracao}</p>
                <p className="mt-3 text-xl text-dourado">{item.valor}</p>
                <Button className="mt-5 w-full" href={pathToPay(item.id)}>
                  Pagar e agendar
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
