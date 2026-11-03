import { NextResponse } from "next/server";
import { findOffer, mercadoPagoAccessToken, paymentUnlocksOffer, retrievePayment } from "@/lib/mercadopago";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const paymentId = url.searchParams.get("payment_id") || url.searchParams.get("session_id") || "";
  const serviceId = url.searchParams.get("servico") || "";
  const offer = findOffer(serviceId);

  if (!paymentId || !offer) {
    return NextResponse.json({ ok: false, paid: false, pending: false }, { status: 400 });
  }

  if (process.env.NODE_ENV !== "production" && paymentId === "test") {
    return NextResponse.json({ ok: true, paid: true, pending: false, dev: true });
  }

  if (!mercadoPagoAccessToken()) {
    return NextResponse.json({ ok: false, paid: false, pending: false, reason: "unconfigured" }, { status: 503 });
  }

  try {
    const payment = await retrievePayment(paymentId);
    const result = paymentUnlocksOffer(payment, offer);
    return NextResponse.json({ ok: true, ...result });
  } catch {
    return NextResponse.json({ ok: false, paid: false, pending: false }, { status: 502 });
  }
}
