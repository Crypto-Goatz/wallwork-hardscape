import { NextResponse } from "next/server";
import { getOAuthUrl } from "@/lib/crm";

/**
 * GET /api/crm/connect
 * Redirects to CRM OAuth authorization page
 */
export async function GET() {
  try {
    const url = getOAuthUrl();
    return NextResponse.redirect(url);
  } catch (error) {
    const message = error instanceof Error ? error.message : "CRM OAuth not configured";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
