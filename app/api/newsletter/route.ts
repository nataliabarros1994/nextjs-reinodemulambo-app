import { NextResponse } from "next/server";
import {
  clientIp,
  jsonStatus,
  subscribeNewsletter,
  type NewsletterInput,
} from "@/lib/newsletter";

export async function POST(request: Request) {
  let body: NewsletterInput;
  try {
    body = (await request.json()) as NewsletterInput;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const result = await subscribeNewsletter(body, clientIp(request));
  return NextResponse.json(result, { status: jsonStatus(result) });
}
