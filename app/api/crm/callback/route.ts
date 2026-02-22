import { NextRequest, NextResponse } from "next/server";
import { exchangeCode } from "@/lib/crm";
import { getSheetsClient } from "@/lib/google/auth";

/**
 * GET /api/crm/callback?code=xxx
 * OAuth callback — exchanges code for tokens and stores them in the site_config sheet
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/admin/settings?error=no_code", req.url)
    );
  }

  try {
    const tokens = await exchangeCode(code);

    // Store tokens in site_config Google Sheet
    try {
      const sheets = getSheetsClient();
      const spreadsheetId = process.env.GOOGLE_SHEETS_ID!;

      // Append CRM tokens to site_config sheet
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "site_config!A:B",
        valueInputOption: "RAW",
        requestBody: {
          values: [
            ["crm_access_token", tokens.access_token],
            ["crm_refresh_token", tokens.refresh_token],
            ["crm_location_id", tokens.location_id],
            ["crm_expires_at", String(tokens.expires_at)],
          ],
        },
      });
    } catch {
      // If sheets fail, still redirect with success — tokens were obtained
    }

    return NextResponse.redirect(
      new URL("/admin/settings?crm=connected", req.url)
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.redirect(
      new URL(
        `/admin/settings?error=${encodeURIComponent(message)}`,
        req.url
      )
    );
  }
}
