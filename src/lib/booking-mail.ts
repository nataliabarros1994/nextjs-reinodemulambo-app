import { config } from "@/data/config.js";
import { priceTable } from "@/data/services.js";
import type { PriceOffer } from "@/lib/mercadopago";

const KLAVIYO_API = "https://a.klaviyo.com";
const KLAVIYO_REVISION = "2025-10-15";
const SITE_ORIGIN = "https://reinodemulambo.com";
const HOST_TZ = "America/Sao_Paulo";
const CLIENT_REPLY_TO = "contato.maenatalia@gmail.com";

type KlaviyoJson = {
  data?: {
    id?: string;
    type?: string;
    attributes?: Record<string, unknown>;
    relationships?: Record<string, { data?: { id?: string } | { id?: string }[] }>;
  };
  errors?: {
    status?: number;
    code?: string;
    detail?: string;
    meta?: { duplicate_profile_id?: string };
  }[];
};

export type AppointmentMailInput = {
  uid: string;
  trigger: "created" | "rescheduled" | "cancelled";
  offerName: string;
  offerPrice?: string;
  durationLabel: string;
  startIso: string;
  endIso: string;
  timeZone?: string;
  clientName: string;
  clientEmail: string;
  location?: string;
  notes?: string;
};

export function bookingAccessUrl(offerId: string, paymentId: string) {
  return `${SITE_ORIGIN}/agendar?servico=${encodeURIComponent(offerId)}&payment_id=${encodeURIComponent(paymentId)}`;
}

export function isDeliverableEmail(value: string): boolean {
  const email = value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
  if (email.includes("*")) return false;
  if (/^x+@/.test(email)) return false;
  return true;
}

export function payerEmailFromPayment(payment: Record<string, unknown>): string {
  const payer = (payment.payer || {}) as Record<string, unknown>;
  const extra = (payment.additional_info || {}) as Record<string, unknown>;
  const extraPayer = (extra.payer || {}) as Record<string, unknown>;
  const metadata = (payment.metadata || {}) as Record<string, unknown>;
  const candidates = [
    payer.email,
    extraPayer.email,
    metadata.payerEmail,
    metadata.payer_email,
  ];
  for (const candidate of candidates) {
    const email = String(candidate || "").trim().toLowerCase();
    if (isDeliverableEmail(email)) return email;
  }
  return "";
}

export function hostNotifyEmail(): string {
  const fromEnv = String(process.env.HOST_NOTIFY_EMAIL || "").trim().toLowerCase();
  if (isDeliverableEmail(fromEnv)) return fromEnv;
  const fromConfig = String(config.email || "").trim().toLowerCase();
  if (isDeliverableEmail(fromConfig)) return fromConfig;
  return CLIENT_REPLY_TO;
}

export function offerFromCalcomSlug(slug: string): PriceOffer | undefined {
  const valor = String(slug || "").replace(/^\/+|\/+$/g, "");
  if (!valor) return undefined;
  return priceTable.find((item: PriceOffer) => item.id === valor || item.calcomSlug === valor);
}

function klaviyoKey() {
  return process.env.KLAVIYO_PRIVATE_KEY || "";
}

async function klaviyo(method: string, path: string, body?: unknown): Promise<{ status: number; json: KlaviyoJson }> {
  const response = await fetch(`${KLAVIYO_API}${path}`, {
    method,
    headers: {
      Authorization: `Klaviyo-API-Key ${klaviyoKey()}`,
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      revision: KLAVIYO_REVISION,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  let json: KlaviyoJson = {};
  if (text) {
    try {
      json = JSON.parse(text) as KlaviyoJson;
    } catch {
      json = { errors: [{ detail: text.slice(0, 400) }] };
    }
  }
  return { status: response.status, json };
}

function duplicateProfileId(json: KlaviyoJson): string {
  return String(json.errors?.[0]?.meta?.duplicate_profile_id || "");
}

async function ensureProfile(email: string): Promise<string> {
  const created = await klaviyo("POST", "/api/profiles/", {
    data: { type: "profile", attributes: { email } },
  });
  if (created.status === 201 && created.json.data?.id) return created.json.data.id;
  const duplicate = duplicateProfileId(created.json);
  if (duplicate) return duplicate;
  throw new Error(`klaviyo_profile_${created.status}`);
}

async function subscribePayer(email: string) {
  const listId = process.env.KLAVIYO_LIST_ID || "";
  await klaviyo("POST", "/api/profile-subscription-bulk-create-jobs/", {
    data: {
      type: "profile-subscription-bulk-create-job",
      attributes: {
        custom_source: "pagamento",
        profiles: {
          data: [
            {
              type: "profile",
              attributes: {
                email,
                subscriptions: { email: { marketing: { consent: "SUBSCRIBED" } } },
              },
            },
          ],
        },
      },
      ...(listId
        ? { relationships: { list: { data: { type: "list", id: listId } } } }
        : {}),
    },
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function capitalizePt(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatHora(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).formatToParts(date);
  const hour = Number(parts.find((part) => part.type === "hour")?.value || "0");
  const minute = parts.find((part) => part.type === "minute")?.value || "00";
  return minute === "00" ? `${hour}h` : `${hour}h${minute}`;
}

export function formatAppointmentWhen(input: {
  startIso: string;
  endIso: string;
  timeZone?: string;
  durationLabel?: string;
}): { dia: string; horario: string; duracao: string; resumo: string } {
  const timeZone = input.timeZone || HOST_TZ;
  const start = new Date(input.startIso);
  const end = new Date(input.endIso);
  const dia = capitalizePt(
    new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone,
    }).format(start),
  );
  const horario = `${formatHora(start, timeZone)} às ${formatHora(end, timeZone)}`;
  const minutes = Math.max(1, Math.round((end.getTime() - start.getTime()) / 60000));
  const duracao = input.durationLabel || (minutes === 1 ? "1 minuto" : `${minutes} minutos`);
  return {
    dia,
    horario,
    duracao,
    resumo: `${dia}, ${horario} (horário de Brasília), ${duracao}`,
  };
}

function emailChrome(title: string, innerHtml: string) {
  return `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8"></head>
<body style="margin:0;background:#0b0b0b;color:#f5f0e6;font-family:Georgia,serif;padding:24px">
<div style="max-width:560px;margin:auto;background:#141414;padding:32px 28px;border:1px solid #c9a227">
<p style="color:#c9a227;letter-spacing:.28em;text-transform:uppercase;font-size:11px;margin:0 0 18px">Reino de Mulambo</p>
<h1 style="font-size:22px;font-weight:400;line-height:1.3;margin:0 0 18px">${escapeHtml(title)}</h1>
${innerHtml}
<p style="font-size:13px;color:#cfc6b4;margin:28px 0 0">Dúvidas: responda este e-mail ou chame no WhatsApp ${escapeHtml(config.whatsappDisplay)}.</p>
</div>
</body></html>`;
}

function detailRow(label: string, value: string) {
  if (!value) return "";
  return `<tr>
    <td style="padding:8px 12px 8px 0;color:#cfc6b4;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td>
    <td style="padding:8px 0;color:#f5f0e6">${value}</td>
  </tr>`;
}

function detailsTable(rows: Array<[string, string]>) {
  const body = rows
    .filter(([, value]) => Boolean(value))
    .map(([label, value]) => detailRow(label, value))
    .join("");
  if (!body) return "";
  return `<table width="100%" style="border-collapse:collapse;margin:8px 0 20px">${body}</table>`;
}

function ctaButton(href: string, label: string) {
  return `<p style="margin:28px 0 12px"><a href="${escapeHtml(href)}" style="display:inline-block;background:#c9a227;color:#111;text-decoration:none;padding:12px 20px;font-weight:700">${escapeHtml(label)}</a></p>
<p style="font-size:13px;color:#cfc6b4">Se o botão não abrir, copie este endereço:<br>${escapeHtml(href)}</p>`;
}

function clientPaymentHtml(input: { offer: PriceOffer; link: string }) {
  return emailChrome(
    "Pagamento confirmado. Escolha o horário.",
    `<p>Recebemos o pagamento de <strong>${escapeHtml(input.offer.nome)} (${escapeHtml(input.offer.valor)})</strong>.</p>
<p>Abra o link abaixo para marcar o dia e o horário da consulta. O horário só fica reservado depois que você confirma na agenda.</p>
${ctaButton(input.link, "Escolher horário")}`,
  );
}

function hostPaymentHtml(input: { offer: PriceOffer; link: string; email: string }) {
  return emailChrome(
    "Pagamento aprovado",
    `<p>O cliente <strong>${escapeHtml(input.email)}</strong> pagou <strong>${escapeHtml(input.offer.nome)} (${escapeHtml(input.offer.valor)})</strong>.</p>
<p>O e-mail com o link da agenda já foi enviado para o cliente.</p>
${detailsTable([
  ["Cliente", escapeHtml(input.email)],
  ["Serviço", escapeHtml(input.offer.nome)],
  ["Valor", escapeHtml(input.offer.valor)],
  ["Duração", escapeHtml(input.offer.duracao)],
])}
${ctaButton(input.link, "Abrir agenda do cliente")}`,
  );
}

function locationHtml(location: string) {
  if (!location) return "";
  if (/^https?:\/\//i.test(location)) {
    return `<a href="${escapeHtml(location)}" style="color:#c9a227">${escapeHtml(location)}</a>`;
  }
  return escapeHtml(location);
}

function appointmentCopy(input: AppointmentMailInput, audience: "client" | "host") {
  const when = formatAppointmentWhen({
    startIso: input.startIso,
    endIso: input.endIso,
    timeZone: input.timeZone,
    durationLabel: input.durationLabel,
  });
  const titles = {
    created: {
      client: "Consulta agendada",
      host: "Nova consulta na agenda",
    },
    rescheduled: {
      client: "Consulta remarcada",
      host: "Consulta remarcada",
    },
    cancelled: {
      client: "Consulta cancelada",
      host: "Consulta cancelada",
    },
  } as const;
  const intros = {
    created: {
      client: `Sua consulta de <strong>${escapeHtml(input.offerName)}</strong> está confirmada.`,
      host: `O cliente <strong>${escapeHtml(input.clientName || input.clientEmail)}</strong> agendou <strong>${escapeHtml(input.offerName)}</strong>.`,
    },
    rescheduled: {
      client: `Sua consulta de <strong>${escapeHtml(input.offerName)}</strong> foi remarcada.`,
      host: `A consulta de <strong>${escapeHtml(input.clientName || input.clientEmail)}</strong> foi remarcada.`,
    },
    cancelled: {
      client: `Sua consulta de <strong>${escapeHtml(input.offerName)}</strong> foi cancelada.`,
      host: `A consulta de <strong>${escapeHtml(input.clientName || input.clientEmail)}</strong> foi cancelada.`,
    },
  } as const;
  const subjects = {
    created: {
      client: `Consulta agendada — ${when.dia}, ${when.horario} | Reino de Mulambo`,
      host: `Nova consulta — ${input.clientName || input.clientEmail} | Reino de Mulambo`,
    },
    rescheduled: {
      client: `Consulta remarcada — ${when.dia}, ${when.horario} | Reino de Mulambo`,
      host: `Consulta remarcada — ${input.clientName || input.clientEmail} | Reino de Mulambo`,
    },
    cancelled: {
      client: `Consulta cancelada | Reino de Mulambo`,
      host: `Consulta cancelada — ${input.clientName || input.clientEmail} | Reino de Mulambo`,
    },
  } as const;
  const html = emailChrome(
    titles[input.trigger][audience],
    `<p>${intros[input.trigger][audience]}</p>
${detailsTable([
  ["Serviço", escapeHtml(input.offerName)],
  ["Dia", escapeHtml(when.dia)],
  ["Horário", escapeHtml(`${when.horario} (horário de Brasília)`)],
  ["Duração", escapeHtml(when.duracao)],
  audience === "host" ? ["Cliente", escapeHtml(`${input.clientName} · ${input.clientEmail}`.trim())] : ["", ""],
  input.offerPrice ? ["Valor", escapeHtml(input.offerPrice)] : ["", ""],
  ["Onde", locationHtml(input.location || "")],
  input.notes ? ["Observações", escapeHtml(input.notes)] : ["", ""],
])}
${input.location && /^https?:\/\//i.test(input.location) && input.trigger !== "cancelled" ? ctaButton(input.location, "Entrar na sala") : ""}`,
  );
  const textLines = [
    titles[input.trigger][audience],
    `${input.offerName}${input.offerPrice ? ` (${input.offerPrice})` : ""}`,
    `Dia: ${when.dia}`,
    `Horário: ${when.horario} (horário de Brasília)`,
    `Duração: ${when.duracao}`,
    audience === "host" ? `Cliente: ${input.clientName} <${input.clientEmail}>` : "",
    input.location ? `Onde: ${input.location}` : "",
    input.notes ? `Observações: ${input.notes}` : "",
  ].filter(Boolean);
  return {
    subject: subjects[input.trigger][audience],
    html,
    text: textLines.join("\n"),
  };
}

function resendKey() {
  return process.env.RESEND_API_KEY || "";
}

function resendFrom() {
  return process.env.RESEND_FROM_EMAIL || "Reino de Mulambo <contato@reinodemulambo.com>";
}

async function sendResendEmail(input: {
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  idempotencyKey: string;
}): Promise<{ ok: boolean; reason?: string }> {
  const key = resendKey();
  if (!key) return { ok: false, reason: "missing_resend" };
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "Idempotency-Key": input.idempotencyKey,
    },
    body: JSON.stringify({
      from: resendFrom(),
      to: [input.to],
      reply_to: input.replyTo || CLIENT_REPLY_TO,
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  });
  if (response.status >= 300) {
    const detail = (await response.text()).slice(0, 400);
    throw new Error(`resend_${response.status}:${detail}`);
  }
  return { ok: true };
}

async function rememberPayer(email: string) {
  if (!klaviyoKey()) return;
  await ensureProfile(email);
  await subscribePayer(email);
}

async function trackKlaviyoPayment(input: {
  email: string;
  offer: PriceOffer;
  paymentId: string;
  link: string;
}): Promise<void> {
  if (!klaviyoKey()) return;
  await ensureProfile(input.email);
  await subscribePayer(input.email);
  const event = await klaviyo("POST", "/api/events/", {
    data: {
      type: "event",
      attributes: {
        unique_id: `pagamento-${input.paymentId}`,
        metric: {
          data: { type: "metric", attributes: { name: "Pagamento Confirmado" } },
        },
        profile: { data: { type: "profile", attributes: { email: input.email } } },
        properties: {
          booking_url: input.link,
          offer_name: input.offer.nome,
          offer_price: input.offer.valor,
          payment_id: input.paymentId,
        },
      },
    },
  });
  if (event.status >= 300) throw new Error(`klaviyo_event_${event.status}`);
}

export async function sendBookingAccessEmail(input: {
  email: string;
  offer: PriceOffer;
  paymentId: string;
}): Promise<{ ok: boolean; reason?: string }> {
  const email = input.email.trim().toLowerCase();
  if (!isDeliverableEmail(email)) return { ok: false, reason: "missing_email" };

  const link = bookingAccessUrl(input.offer.id, input.paymentId);
  const host = hostNotifyEmail();
  let instant: { ok: boolean; reason?: string } = { ok: false, reason: "missing_resend" };
  try {
    instant = await sendResendEmail({
      to: email,
      replyTo: CLIENT_REPLY_TO,
      subject: "Pagamento confirmado — escolha o horário | Reino de Mulambo",
      html: clientPaymentHtml({ offer: input.offer, link }),
      text: `Pagamento confirmado. Recebemos ${input.offer.nome} (${input.offer.valor}). Escolha o horário: ${link}`,
      idempotencyKey: `pagamento-${input.paymentId}`,
    });
  } catch (error) {
    console.error("booking_mail_resend", error);
  }

  if (host && host !== email) {
    try {
      await sendResendEmail({
        to: host,
        replyTo: email,
        subject: `Pagamento aprovado — ${input.offer.nome} | Reino de Mulambo`,
        html: hostPaymentHtml({ offer: input.offer, link, email }),
        text: `Pagamento aprovado. Cliente ${email} pagou ${input.offer.nome} (${input.offer.valor}). Agenda: ${link}`,
        idempotencyKey: `pagamento-anfitria-${input.paymentId}`,
      });
    } catch (error) {
      console.error("booking_mail_host_resend", error);
    }
  }

  if (instant.ok) {
    try {
      await rememberPayer(email);
    } catch (error) {
      console.error("booking_mail_klaviyo_followup", error);
    }
    return { ok: true };
  }

  if (!klaviyoKey()) return { ok: false, reason: instant.reason || "missing_mailer" };
  await trackKlaviyoPayment({ email, offer: input.offer, paymentId: input.paymentId, link });
  return { ok: true };
}

export async function sendAppointmentEmails(input: AppointmentMailInput): Promise<{ ok: boolean; reason?: string }> {
  const clientEmail = input.clientEmail.trim().toLowerCase();
  if (!isDeliverableEmail(clientEmail)) return { ok: false, reason: "missing_email" };
  const host = hostNotifyEmail();
  const clientCopy = appointmentCopy({ ...input, clientEmail }, "client");
  const hostCopy = appointmentCopy({ ...input, clientEmail }, "host");
  const prefix = input.trigger === "created" ? "agendamento" : input.trigger === "rescheduled" ? "reagendamento" : "cancelamento";

  let clientOk = false;
  try {
    const sent = await sendResendEmail({
      to: clientEmail,
      replyTo: CLIENT_REPLY_TO,
      subject: clientCopy.subject,
      html: clientCopy.html,
      text: clientCopy.text,
      idempotencyKey: `${prefix}-${input.uid}`,
    });
    clientOk = sent.ok;
  } catch (error) {
    console.error("appointment_mail_client", error);
  }

  if (host && host !== clientEmail) {
    try {
      await sendResendEmail({
        to: host,
        replyTo: clientEmail,
        subject: hostCopy.subject,
        html: hostCopy.html,
        text: hostCopy.text,
        idempotencyKey: `${prefix}-anfitria-${input.uid}`,
      });
    } catch (error) {
      console.error("appointment_mail_host", error);
    }
  }

  return clientOk ? { ok: true } : { ok: false, reason: "resend_failed" };
}
