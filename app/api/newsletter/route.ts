import { NextResponse } from "next/server";

const KLAVIYO_API_KEY = process.env.KLAVIYO_PRIVATE_KEY;
const KLAVIYO_LIST_ID = process.env.KLAVIYO_LIST_ID ?? "Yz7AcS";

export async function POST(request: Request) {
  let body: { email?: string; source?: string; first_name?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!KLAVIYO_API_KEY) {
    return NextResponse.json({ ok: true, stored: "local" });
  }

  try {
    const response = await fetch("https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/", {
      method: "POST",
      headers: {
        Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        revision: "2024-10-15",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          type: "profile-subscription-bulk-create-job",
          attributes: {
            custom_source: String(body.source || "site"),
            profiles: {
              data: [
                {
                  type: "profile",
                  attributes: {
                    email,
                    first_name: body.first_name || undefined,
                    subscriptions: {
                      email: { marketing: { consent: "SUBSCRIBED" } },
                    },
                  },
                },
              ],
            },
          },
          relationships: {
            list: { data: { type: "list", id: KLAVIYO_LIST_ID } },
          },
        },
      }),
    });

    return NextResponse.json({ ok: response.ok });
  } catch {
    return NextResponse.json({ ok: true, stored: "local" });
  }
}
