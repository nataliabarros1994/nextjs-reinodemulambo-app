import { NextResponse } from "next/server";
import { isDeliverableEmail, payerEmailFromPayment, sendBookingAccessEmail } from "@/lib/booking-mail";
import { findOffer, paymentUnlocksOffer, retrievePayment } from "@/lib/mercadopago";

export async function POST(request: Request) {
  let body: { paymentId?: string; serviceId?: string; email?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const paymentId = String(body.paymentId || "").trim();
  const serviceId = String(body.serviceId || "").trim();
  if (!paymentId) return NextResponse.json({ ok: false, reason: "missing_payment" }, { status: 400 });

  const offer = findOffer(serviceId);
  if (!offer) return NextResponse.json({ ok: false, reason: "unknown_service" }, { status: 404 });

  try {
    const payment = await retrievePayment(paymentId);
    if (!paymentUnlocksOffer(payment, offer).paid) {
      return NextResponse.json({ ok: false, reason: "unpaid" }, { status: 409 });
    }
    const email =
      payerEmailFromPayment(payment) ||
      (isDeliverableEmail(String(body.email || "")) ? String(body.email).trim().toLowerCase() : "");
    if (!email) return NextResponse.json({ ok: false, reason: "missing_email" }, { status: 400 });
    await sendBookingAccessEmail({ email, offer, paymentId });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("notify_booking", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
