import { NextResponse } from "next/server";
import { isDeliverableEmail } from "@/lib/booking-mail";
import { checkoutUrl, createPreference, findOffer, mercadoPagoAccessToken, publicOrigin } from "@/lib/mercadopago";

export async function POST(request: Request) {
  if (!mercadoPagoAccessToken()) {
    return NextResponse.json({ ok: false, reason: "unconfigured" }, { status: 503 });
  }

  let body: { serviceId?: string; email?: string };
  try {
    body = await request.json();
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
    const preference = await createPreference(offer, publicOrigin(request), email);
    const url = checkoutUrl(preference);
    if (!url) return NextResponse.json({ ok: false }, { status: 502 });
    return NextResponse.json({ ok: true, url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "mercadopago_error";
    return NextResponse.json({ ok: false, reason: message }, { status: 502 });
  }
}
