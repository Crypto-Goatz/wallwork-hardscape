import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/7zuYOTo6lCKTXW5K5BLJ/webhook-trigger/9478386a-3b11-4747-9cf6-32601bd5acf2";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const payload = {
      first_name: body.firstName || "",
      last_name: body.lastName || "",
      email: body.email || "",
      phone: body.phone || "",
      source: "wallworkshardscape.com/homeshow",
      tags: ["homeshow-2026", "500-bonus", "wallwork-hardscape"],
    };

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Homeshow webhook error:", res.status, text);
      return NextResponse.json({ error: "Webhook failed" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Homeshow webhook proxy error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
