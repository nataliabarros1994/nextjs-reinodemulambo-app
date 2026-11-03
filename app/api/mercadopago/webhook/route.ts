import { NextResponse } from "next/server";
import { payerEmailFromPayment, sendBookingAccessEmail } from "@/lib/booking-mail";
import {
  findOffer,
  paymentUnlocksOffer,
  retrieveMerchantOrder,
  retrievePayment,
  retrievePreference,
  verifyMercadoPagoSignature,
} from "@/lib/mercadopago";

async function emailForPaidPayment(payment: Record<string, unknown>): Promise<string> {
  const direct = payerEmailFromPayment(payment);
  if (direct) return direct;
  const order = (payment.order || {}) as { id?: string };
  const orderId = String(order.id || "");
  if (!orderId) return "";
  try {
    const merchant = await retrieveMerchantOrder(orderId);
    const preferenceId = String(merchant.preference_id || "");
    if (!preferenceId) return "";
    const preference = await retrievePreference(preferenceId);
    return payerEmailFromPayment({
      payer: preference.payer,
      metadata: preference.metadata,
    });
  } catch (error) {
    console.error("booking_mail_preference_lookup", error);
    return "";
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  let payload: { type?: string; action?: string; data?: { id?: string } } = {};
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return NextResponse.json({ ok: true });
  }

  const paymentId = String(
    payload.data?.id || url.searchParams.get("data.id") || url.searchParams.get("id") || "",
  );
  const type = String(payload.type || url.searchParams.get("type") || url.searchParams.get("topic") || "");
  if (!paymentId || (type && type !== "payment")) {
    return NextResponse.json({ ok: true });
  }

  const valid = await verifyMercadoPagoSignature(request, paymentId);
  if (!valid) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const payment = await retrievePayment(paymentId);
    const offer = findOffer(String(payment.external_reference || ""));
    if (offer && paymentUnlocksOffer(payment, offer).paid) {
      const email = await emailForPaidPayment(payment);
      if (email) {
        await sendBookingAccessEmail({ email, offer, paymentId });
      } else {
        console.error("booking_mail_skipped_missing_email", paymentId);
      }
    }
  } catch (error) {
    console.error("mercadopago_webhook", error);
  }

  return NextResponse.json({ ok: true });
}
