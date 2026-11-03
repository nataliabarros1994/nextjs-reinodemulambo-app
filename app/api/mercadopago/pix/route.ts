import { NextResponse } from "next/server";
import { isDeliverableEmail } from "@/lib/booking-mail";
import {
  createPixPayment,
  findOffer,
  mercadoPagoAccessToken,
  pixCopyFromPayment,
  publicOrigin,
} from "@/lib/mercadopago";

export async function POST(request: Request) {
  if (!mercadoPagoAccessToken()) {
    return NextResponse.json({ ok: false, reason: "unconfigured" }, { status: 503 });
  }

  let body: { serviceId?: string; email?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const offer = findOffer(String(body.serviceId || ""));
  if (!offer) {
    return NextResponse.json({ ok: false, reason: "unknown_service" }, { status: 404 });
  }

  const email = String(body.email || "").trim().toLowerCase();
  if (!isDeliverableEmail(email)) {
    return NextResponse.json({ ok: false, reason: "missing_email" }, { status: 400 });
  }

  try {
    const payment = await createPixPayment(offer, publicOrigin(request), email);
    const pix = pixCopyFromPayment(payment);
    if (!pix.paymentId || !pix.qrCode) {
      return NextResponse.json({ ok: false, reason: "missing_pix" }, { status: 502 });
    }
    return NextResponse.json({ ok: true, ...pix });
  } catch (error) {
    const message = error instanceof Error ? error.message : "mercadopago_error";
    return NextResponse.json({ ok: false, reason: message }, { status: 502 });
  }
}
