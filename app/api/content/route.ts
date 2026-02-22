import { NextRequest, NextResponse } from "next/server";
import {
  getSheetData,
  updateSheetRow,
  appendSheetRow,
  deleteSheetRow,
} from "@/lib/google/sheets";
import { createContact } from "@/lib/crm";
import { trackConversion } from "@/lib/cro9";
import { getSiteConfigFromSheet } from "@/lib/google/sheets";
import type { SheetName } from "@/config/sheets-schema";

const VALID_SHEETS: SheetName[] = [
  "services",
  "portfolio",
  "testimonials",
  "blog",
  "team",
  "faqs",
  "seo",
  "site_config",
  "custom_apps",
];

/**
 * GET /api/content?sheet=services
 * Read all rows from a sheet
 */
export async function GET(req: NextRequest) {
  const sheet = req.nextUrl.searchParams.get("sheet") as SheetName | null;

  if (!sheet || !VALID_SHEETS.includes(sheet)) {
    return NextResponse.json(
      { error: `Invalid sheet. Valid: ${VALID_SHEETS.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const data = await getSheetData(sheet);
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/content
 * Create a new row or handle contact submissions
 */
export async function POST(req: NextRequest) {
  const body = await req.json();

  // Handle contact form submissions
  if (body.type === "contact_submission") {
    try {
      // Try to submit to CRM if configured
      const siteConfig: Record<string, string> = await getSiteConfigFromSheet().catch(() => ({}));
      const accessToken = siteConfig["crm_access_token"];
      const locationId = siteConfig["crm_location_id"];

      if (accessToken && locationId) {
        await createContact(accessToken, locationId, {
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          phone: body.phone,
          source: "Website Contact Form",
          tags: ["website-lead"],
        });
      }

      // Track conversion
      await trackConversion({
        name: "contact_form_submission",
        metadata: { email: body.email || "" },
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  // Handle sheet row creation
  const { sheet, data } = body;

  if (!sheet || !VALID_SHEETS.includes(sheet)) {
    return NextResponse.json({ error: "Invalid sheet" }, { status: 400 });
  }

  try {
    await appendSheetRow(sheet, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PUT /api/content
 * Update an existing sheet row
 */
export async function PUT(req: NextRequest) {
  const { sheet, rowIndex, data } = await req.json();

  if (!sheet || !VALID_SHEETS.includes(sheet)) {
    return NextResponse.json({ error: "Invalid sheet" }, { status: 400 });
  }

  if (typeof rowIndex !== "number") {
    return NextResponse.json({ error: "rowIndex required" }, { status: 400 });
  }

  try {
    await updateSheetRow(sheet, rowIndex, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/content?sheet=services&rowIndex=0
 * Delete a sheet row
 */
export async function DELETE(req: NextRequest) {
  const sheet = req.nextUrl.searchParams.get("sheet") as SheetName | null;
  const rowIndex = parseInt(
    req.nextUrl.searchParams.get("rowIndex") || "",
    10
  );

  if (!sheet || !VALID_SHEETS.includes(sheet)) {
    return NextResponse.json({ error: "Invalid sheet" }, { status: 400 });
  }

  if (isNaN(rowIndex)) {
    return NextResponse.json({ error: "rowIndex required" }, { status: 400 });
  }

  try {
    await deleteSheetRow(sheet, rowIndex);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
