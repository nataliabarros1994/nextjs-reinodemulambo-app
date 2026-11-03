import { NextResponse } from "next/server";
import { sendAppointmentEmails } from "@/lib/booking-mail";
import {
  appointmentFromCalcomPayload,
  verifyCalcomSignature,
  type CalcomWebhookBody,
} from "@/lib/calcom";

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-cal-signature-256") || request.headers.get("X-Cal-Signature-256") || "";
  const valid = await verifyCalcomSignature(rawBody, signature);
  if (!valid) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: CalcomWebhookBody = {};
  try {
    body = rawBody ? (JSON.parse(rawBody) as CalcomWebhookBody) : {};
  } catch {
    return NextResponse.json({ ok: true });
  }

  const triggerEvent = String(body.triggerEvent || "");
  const payload = (body.payload || {}) as Record<string, unknown>;
  const appointment = appointmentFromCalcomPayload(triggerEvent, payload);
  if (!appointment) {
    return NextResponse.json({ ok: true });
  }

  try {
    await sendAppointmentEmails(appointment);
  } catch (error) {
    console.error("calcom_webhook_mail", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
