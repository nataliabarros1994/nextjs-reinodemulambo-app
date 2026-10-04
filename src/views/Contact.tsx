"use client";
import { useEffect } from "react";
import { CalendarDays, MessageCircle, Video } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { config } from "@/data/config.js";
import { priceTable } from "@/data/services.js";
import { EmailLink } from "@/components/EmailLink";
import { InstagramLink } from "@/components/InstagramLink";
import { Button } from "@/components/Button";
import { Seo } from "@/components/Seo";
import { offerBySlugOrId } from "@/utils/calendly.js";
import { pathToPay, confirmationPath, hasPayment } from "@/utils/payment.js";

function paramsDaAgenda(search: string) {
  return new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
}

export function Contact() {
  const searchParams = useSearchParams();
  const q = searchParams.toString();
  const search = q ? `?${q}` : "";
  const router = useRouter();
  
  const params = paramsDaAgenda(search);
  const evento = params.get("evento") || params.get("servico") || "";
  const servico = offerBySlugOrId(evento);

  useEffect(() => {
    if (!servico) return;
    if (hasPayment(servico.id)) {
      router.push(confirmationPath(servico.id));
      return;
    }
    router.push(pathToPay(servico.id));
  }, [servico]);

  return (
    <>
      <Seo
        title="Agendar consulta — Reino de Mulambo | Tarô e búzios online"
        description="Pague a consulta para liberar a agenda. O horário só é escolhido depois da confirmação do pagamento."
      />
      <section className="page-hero">
        <div className="container-wide">
          <span className="eyebrow">contato</span>
          <h1 className="font-display mt-4 text-5xl md:text-7xl">Pague primeiro. Depois escolha o horário.</h1>
        </div>
      </section>
      <section className="pb-20">
        <div className="container-wide">
          <div className="mb-10 max-w-3xl">
            <p className="leading-7 text-branco-lua/70">
              A agenda fica bloqueada até o pagamento. Escolha o serviço, pague e só então marque o dia e o turno.
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
                  Pay e agendar
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
