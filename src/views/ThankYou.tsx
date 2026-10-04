"use client";
import { config } from "@/data/config.js";
import { Button } from "@/components/Button";
import { Seo } from "@/components/Seo";

export function ThankYou() {
  return (
    <>
      <Seo title="ThankYou — Reino de Mulambo" description="Recebemos seu pedido. Nas próximas horas, a conversa continua no WhatsApp." />
      <section className="flex min-h-[70vh] items-center py-24">
        <div className="container-wide max-w-2xl text-center">
          <p className="eyebrow">pedido enviado</p>
          <h1 className="font-display mt-4 text-5xl">ThankYou. Sua mensagem já está a caminho.</h1>
          <p className="mt-6 leading-7 text-branco-lua/70">
            Nas próximas horas, olho o WhatsApp e retorno com os horários possíveis. Se a janela não abriu, volte à página de
            contato e toque em enviar outra vez. Enquanto isso, se quiser, acompanhe os recados no Instagram.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button href={config.instagram} external variant="roxo">
              Seguir no Instagram
            </Button>
            <Button href="/" variant="contornado">
              Voltar à home
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
