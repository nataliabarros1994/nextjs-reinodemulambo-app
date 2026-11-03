import { NextResponse } from "next/server";
import { sessionUnlock } from "@/lib/mercadopago";
import { paymentIdFromSearch } from "@/utils/payment.js";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const paymentId = paymentIdFromSearch(url.searchParams);
  const serviceId = url.searchParams.get("servico") || "";
  const result = await sessionUnlock(serviceId, paymentId);
  return NextResponse.json(result.body, { status: result.status });
}
