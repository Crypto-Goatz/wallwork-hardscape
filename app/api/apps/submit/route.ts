import { NextRequest, NextResponse } from "next/server";
import { getSheetData } from "@/lib/google/sheets";
import { getSiteConfigFromSheet } from "@/lib/google/sheets";
import { createContact } from "@/lib/crm";
import { trackConversion } from "@/lib/cro9";
import { parseAppDefinition } from "@/config/app-schema";

const CRM_API_BASE = "https://services.leadconnectorhq.com";
const CRM_VERSION = "2021-07-28";

/**
 * POST /api/apps/submit
 * Handle form submissions from custom apps.
 */
export async function POST(req: NextRequest) {
  try {
    const { slug, values } = await req.json();

    if (!slug || !values) {
      return NextResponse.json(
        { error: "slug and values are required" },
        { status: 400 }
      );
    }

    // Load app definition from custom_apps sheet
    const apps = await getSheetData("custom_apps");
    const appRow = apps.find(
      (a) => a.slug === slug && a.status === "active"
    );

    if (!appRow) {
      return NextResponse.json(
        { error: "App not found or not active" },
        { status: 404 }
      );
    }

    const definition = parseAppDefinition(JSON.parse(appRow.definition));

    // CRM integration
    if (definition.crm) {
      try {
        const siteConfig = await getSiteConfigFromSheet().catch(
          () => ({}) as Record<string, string>
        );
        const accessToken = siteConfig["crm_access_token"];
        const locationId = siteConfig["crm_location_id"];

        if (accessToken && locationId) {
          // Map form fields to CRM contact fields
          const contactData: Record<string, string> = {};
          for (const [formField, crmField] of Object.entries(
            definition.crm.fieldMap
          )) {
            if (values[formField]) {
              contactData[crmField] = values[formField];
            }
          }

          await createContact(accessToken, locationId, {
            firstName: contactData.firstName || values.firstName || values.first_name || "",
            lastName: contactData.lastName || values.lastName || values.last_name,
            email: contactData.email || values.email,
            phone: contactData.phone || values.phone,
            source: definition.crm.source || "Custom App",
            tags: definition.crm.tags || [],
          });

          // Trigger workflow if configured
          if (definition.crm.workflowId && accessToken && locationId) {
            await fetch(
              `${CRM_API_BASE}/contacts/workflow/${definition.crm.workflowId}/enroll`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                  Version: CRM_VERSION,
                },
                body: JSON.stringify({
                  locationId,
                  email: contactData.email || values.email,
                }),
              }
            ).catch(() => {
              // Don't fail if workflow trigger fails
            });
          }
        }
      } catch {
        // CRM errors shouldn't block the submission
      }
    }

    // Track conversion
    await trackConversion({
      name: `app_submission_${slug}`,
      metadata: { slug, ...values },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
