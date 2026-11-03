import { offerFromCalcomSlug, type AppointmentMailInput } from "@/lib/booking-mail";

export type CalcomWebhookBody = {
  triggerEvent?: string;
  createdAt?: string;
  payload?: Record<string, unknown>;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function hexOf(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) {
    diff |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return diff === 0;
}

export async function verifyCalcomSignature(rawBody: string, signatureHeader: string): Promise<boolean> {
  const secret = String(process.env.CALCOM_WEBHOOK_SECRET || "");
  if (!secret) return true;
  const received = signatureHeader.trim().toLowerCase().replace(/^sha256=/, "");
  if (!received) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
  return timingSafeEqual(hexOf(digest), received);
}

function personEmail(person: Record<string, unknown>): string {
  return String(person.email || "").trim().toLowerCase();
}

function personName(person: Record<string, unknown>): string {
  return String(person.name || person.firstName || "").trim();
}

function meetingUrl(payload: Record<string, unknown>): string {
  const candidates = [
    payload.videoCallUrl,
    payload.meetingUrl,
    asRecord(payload.metadata).videoCallUrl,
    payload.location,
  ];
  for (const candidate of candidates) {
    const value = String(candidate || "").trim();
    if (/^https?:\/\//i.test(value)) return value;
  }
  return "";
}

function notesFrom(payload: Record<string, unknown>): string {
  const responses = asRecord(payload.responses);
  const notesField = asRecord(responses.notes);
  return String(
    payload.additionalNotes ||
      notesField.value ||
      payload.description ||
      "",
  ).trim();
}

export function appointmentFromCalcomPayload(
  triggerEvent: string,
  payload: Record<string, unknown>,
): AppointmentMailInput | null {
  const trigger =
    triggerEvent === "BOOKING_RESCHEDULED"
      ? "rescheduled"
      : triggerEvent === "BOOKING_CANCELLED"
        ? "cancelled"
        : triggerEvent === "BOOKING_CREATED"
          ? "created"
          : null;
  if (!trigger) return null;

  const attendees = Array.isArray(payload.attendees) ? payload.attendees.map(asRecord) : [];
  const responses = asRecord(payload.responses);
  const responseEmail = asRecord(responses.email);
  const responseName = asRecord(responses.name);
  const client = attendees[0] || {};
  const clientEmail = personEmail(client) || String(responseEmail.value || "").trim().toLowerCase();
  const clientName = personName(client) || String(responseName.value || "").trim();
  const slug = String(payload.type || payload.eventTypeSlug || payload.eventTitle || "").trim();
  const offer = offerFromCalcomSlug(slug);
  const startIso = String(payload.startTime || "");
  const endIso = String(payload.endTime || "");
  if (!startIso || !endIso) return null;

  const lengthMinutes = Number(payload.length || 0);
  const durationLabel =
    offer?.duracao ||
    (lengthMinutes > 0 ? (lengthMinutes === 1 ? "1 minuto" : `${lengthMinutes} minutos`) : "");

  return {
    uid: String(payload.uid || payload.bookingId || `${startIso}-${clientEmail}`),
    trigger,
    offerName: offer?.nome || String(payload.eventTitle || payload.title || slug || "Consulta"),
    offerPrice: offer?.valor,
    durationLabel,
    startIso,
    endIso,
    timeZone: String(asRecord(payload.organizer).timeZone || "America/Sao_Paulo"),
    clientName,
    clientEmail,
    location: meetingUrl(payload),
    notes: notesFrom(payload),
  };
}
