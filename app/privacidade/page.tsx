import type { Metadata } from "next";
import Link from "next/link";
import { OpenCookiePreferences } from "@/components/CookieConsent";
import { config } from "@/data/config.js";
import { pageOpenGraph } from "@/lib/open-graph";

const title = "Política de Privacidade | Reino de Mulambo";
const description =
  "Como o Reino de Mulambo trata dados de contato, pagamentos, agendamentos, e-mails e cookies, com respeito, discrição e em linha com a LGPD.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacidade" },
  openGraph: pageOpenGraph("/privacidade", { title, description }),
};

export default function Page() {
  return (
    <article>
      <section className="page-hero">
        <div className="container-wide">
          <span className="eyebrow">respeito, confiança e discrição</span>
          <h1 className="font-display mt-4 max-w-3xl text-[2.15rem] leading-tight sm:text-5xl">
            Política de Privacidade
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-dourado/90">
            Sua confiança é muito importante para nós. No Reino de Mulambo, entendemos que uma consulta
            espiritual pode envolver questões pessoais, sentimentos e momentos delicados. Por isso,
            tratamos sua privacidade com respeito, cuidado e discrição.
          </p>
        </div>
      </section>
      <section className="pb-24">
        <div className="container-wide max-w-3xl space-y-8 text-sm leading-7 text-branco-lua/75">
          <p>
            Queremos que você se sinta à vontade para conhecer nossos serviços e realizar suas consultas,
            sabendo como suas informações são utilizadas.
          </p>
          <p>
            Controladora: {config.nome}. Contato: {config.email}. {config.cidade}.
          </p>

          <section>
            <h2 className="font-display mb-2 text-2xl text-branco-lua">1. Quais informações utilizamos?</h2>
            <p>
              Podemos utilizar informações que você fornece ao entrar em contato, contratar uma consulta ou
              solicitar um agendamento, como nome, e-mail, dados necessários à reserva e informações
              compartilhadas voluntariamente durante o atendimento.
            </p>
            <p className="mt-3">
              No site, isso inclui o e-mail informado para receber o link da agenda, o e-mail do cadastro
              opcional de mensagens, e o que você envia por WhatsApp ou pelo e-mail de contato. No
              pagamento e no agendamento, os prestadores também tratam os dados exigidos para concluir a
              operação, como valor, serviço contratado e horário escolhido.
            </p>
            <p className="mt-3">
              Solicitamos apenas os dados necessários para prestar nossos serviços, manter a comunicação e
              cumprir obrigações legais.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-2 text-2xl text-branco-lua">2. Como utilizamos seus dados?</h2>
            <p>Suas informações são utilizadas para:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Organizar pagamentos e agendamentos.</li>
              <li>Enviar informações e confirmações sobre suas consultas.</li>
              <li>Responder dúvidas e solicitações.</li>
              <li>Prestar o atendimento contratado.</li>
              <li>Manter a segurança e o funcionamento do site.</li>
              <li>Enviar comunicações opcionais, quando houver a autorização necessária.</li>
              <li>Compreender, de forma agregada, como as páginas do site são visitadas.</li>
            </ul>
            <p className="mt-3">Não comercializamos listas de informações pessoais de nossos clientes.</p>
          </section>

          <section>
            <h2 className="font-display mb-2 text-2xl text-branco-lua">3. Discrição nas consultas</h2>
            <p>
              Respeitamos a natureza pessoal dos assuntos compartilhados durante os atendimentos.
            </p>
            <p className="mt-3">
              As informações fornecidas nas consultas são tratadas com discrição e não são utilizadas para
              exposição pública ou divulgação de histórias pessoais sem autorização.
            </p>
            <p className="mt-3">
              O acesso às informações deve ser limitado ao necessário para a prestação do atendimento e o
              cumprimento das obrigações aplicáveis.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-2 text-2xl text-branco-lua">4. Pagamentos e agendamentos</h2>
            <p>
              Utilizamos serviços externos para processar pagamentos e organizar agendamentos. Esses
              prestadores podem tratar as informações necessárias para executar suas funções, conforme
              suas próprias políticas de privacidade e a legislação aplicável.
            </p>
            <p className="mt-3">
              O pagamento das consultas é feito pelo Mercado Pago (Pix ou cartão). O e-mail informado no
              checkout é usado para confirmar o pagamento e enviar o acesso à agenda.
            </p>
            <p className="mt-3">
              A marcação de horário usa o Cal.com. Nome, e-mail e o horário escolhido são tratados para
              registrar e confirmar a reserva.
            </p>
            <p className="mt-3">
              As mensagens de pagamento, agendamento e atendimento são enviadas por e-mail por meio da
              Resend. O e-mail do pagamento também pode ser registrado na Klaviyo para comunicações
              ligadas àquela compra e à agenda. Uma cópia de aviso pode ser enviada ao e-mail de contato
              do Reino de Mulambo.
            </p>
            <p className="mt-3">
              Depois do pagamento aprovado, o site pode guardar um registro temporário neste aparelho,
              só para reconhecer o direito de abrir a agenda no seu navegador. Esse registro não é
              usado para anúncios.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-2 text-2xl text-branco-lua">5. Segurança das informações</h2>
            <p>
              Adotamos medidas técnicas e organizacionais destinadas a proteger os dados pessoais contra
              acessos não autorizados, uso indevido e divulgação inadequada.
            </p>
            <p className="mt-3">
              Embora nenhum serviço digital possa garantir segurança absoluta, buscamos manter práticas de
              proteção compatíveis com as atividades realizadas.
            </p>
            <p className="mt-3">
              O site é publicado na Cloudflare. Fontes tipográficas são carregadas do Google Fonts. Se
              você nos chama pelo WhatsApp, a conversa ocorre no serviço da Meta.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-2 text-2xl text-branco-lua">6. Comunicações por e-mail</h2>
            <p>
              Você poderá receber mensagens relacionadas às consultas contratadas, como informações sobre
              pagamento, agendamento e atendimento.
            </p>
            <p className="mt-3">
              Mensagens promocionais e conteúdos opcionais são tratados separadamente das comunicações
              necessárias à prestação do serviço.
            </p>
            <p className="mt-3">
              Se você se inscrever em “Uma mensagem por lua nova”, pedimos o e-mail e o aceite do
              checkbox. A finalidade é enviar mensagens espirituais e comunicações do Reino de Mulambo.
              O cadastro só se completa depois que você confirma o endereço no e-mail que enviamos. Sem
              essa confirmação, o endereço não entra na lista de envio. A gestão dessa lista fica a cargo
              da Klaviyo. Cada mensagem opcional traz um caminho de descadastro.
            </p>
            <p className="mt-3">
              Pagar uma consulta não coloca o e-mail automaticamente nessa lista de mensagens da lua nova.
              Caso participe da lista, poderá solicitar o cancelamento dos envios promocionais pelo
              próprio e-mail ou escrevendo para {config.email}.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-2 text-2xl text-branco-lua">7. Cookies e visitas ao site</h2>
            <p>
              Usamos cookies e registros semelhantes para o site funcionar. Cookies de métricas e de
              anúncios só entram quando você autoriza.
            </p>
            <p className="mt-3">
              Os registros necessários servem para pagamento e agendamento. Entre eles estão o registro
              temporário de pagamento neste aparelho e preferências locais, como o som ambiente. Esses
              itens não são usados para anúncios e continuam ativos mesmo se você recusar métricas e
              publicidade.
            </p>
            <p className="mt-3">
              Os cookies de métricas, quando autorizados, carregam o Google Analytics 4. Ele ajuda a
              entender, de forma agregada, quais páginas são visitadas. Sem essa autorização, o Google
              Analytics não é carregado.
            </p>
            <p className="mt-3">
              Os cookies de publicidade, quando autorizados, carregam o pixel da Meta (Facebook). Ele
              mede visitas e pode apoiar anúncios. Sem essa autorização, o pixel não é carregado. Não
              há, neste código, tags de conversão do Google Ads nem pixel do TikTok.
            </p>
            <p className="mt-3">
              Na primeira visita, um aviso oferece Aceitar, Rejeitar ou Personalizar. Nenhuma opção de
              métricas ou publicidade vem marcada. Aceitar autoriza métricas e publicidade. Rejeitar
              impede o carregamento do Google Analytics e do pixel da Meta. Personalizar permite ligar
              ou desligar cada categoria antes de salvar.
            </p>
            <p className="mt-3">
              Depois, você pode mudar ou revogar a escolha pelo link Cookies no rodapé ou pelo botão
              abaixo. A escolha fica salva neste navegador.
            </p>
            <p className="mt-3">
              <OpenCookiePreferences className="text-dourado underline underline-offset-2" />
            </p>
            <p className="mt-3">
              Não enviamos para o Google Analytics nem para o pixel da Meta o conteúdo das consultas
              espirituais, informações sobre crenças religiosas, identificadores privados de pagamento
              nem outros dados pessoais sensíveis que estejam sob nosso controle nos eventos que
              dispararmos.
            </p>
            <p className="mt-3">
              Ferramentas externas que podem participar do tratamento: Cloudflare (hospedagem), Google
              Fonts (tipografia do site), Mercado Pago (pagamento), Cal.com (agenda), Resend (e-mail
              transacional) e Klaviyo (comunicações ligadas à compra e, se você se inscrever, à lista
              da lua nova). Se você nos chama pelo WhatsApp, a conversa ocorre no serviço da Meta.
              Google Analytics e o pixel da Meta só entram com a autorização descrita acima.
            </p>
            <p className="mt-3">
              O navegador também pode guardar, só neste aparelho, preferências locais de elementos do
              site. Esses registros não são cadastro de newsletter.
            </p>
            <p className="mt-3">
              Você também pode bloquear cookies nas configurações do navegador. Isso pode afetar
              métricas e alguns recursos de anúncio das plataformas.
            </p>
          </section>

          <section>
            <h2 className="font-display mb-2 text-2xl text-branco-lua">8. Seus direitos</h2>
            <p>Respeitamos seus direitos previstos na Lei Geral de Proteção de Dados Pessoais (LGPD).</p>
            <p className="mt-3">
              Você pode solicitar informações sobre o tratamento dos seus dados, acesso, correção, exclusão
              quando aplicável e revogação do consentimento.
            </p>
            <p className="mt-3">
              Para entrar em contato, escreva para{" "}
              <a className="text-dourado underline underline-offset-2" href={`mailto:${config.email}`}>
                {config.email}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display mb-2 text-2xl text-branco-lua">9. Nosso compromisso</h2>
            <p>
              No Reino de Mulambo, cada pessoa merece ser atendida com respeito, seriedade e discrição.
            </p>
            <p className="mt-3">
              Nossa intenção é oferecer um ambiente acolhedor, onde sua privacidade seja valorizada em
              todas as etapas do atendimento.
            </p>
            <p className="mt-3">Reino de Mulambo — Sua confiança merece respeito.</p>
          </section>

          <p>
            <Link href="/" className="text-dourado underline underline-offset-2">
              Voltar ao início
            </Link>
          </p>
        </div>
      </section>
    </article>
  );
}
