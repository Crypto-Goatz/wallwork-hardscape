import { NextRequest, NextResponse } from "next/server";
import { createSpreadsheet } from "@/lib/setup/sheet-creator";
import { createDriveFolders } from "@/lib/setup/drive-setup";
import { generateAllContent } from "@/lib/setup/content-generator";
import { setEnvVars, triggerRedeploy } from "@/lib/setup/vercel";
import { getAuthFromCredentials, getSheetsClientWithAuth } from "@/lib/google/auth";
import { SHEETS_SCHEMA, type SheetName } from "@/config/sheets-schema";

function json(data: object, status = 200) {
  return NextResponse.json(data, { status });
}

function error(message: string, status = 400) {
  return json({ error: message }, status);
}

/**
 * Decode base64 service account JSON and return the credentials object.
 */
function decodeCredentials(base64Key: string): object {
  try {
    return JSON.parse(Buffer.from(base64Key, "base64").toString("utf-8"));
  } catch {
    throw new Error("Invalid service account JSON — could not decode base64");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case "validate-google": {
        const { googleKey } = body;
        if (!googleKey) return error("Missing googleKey");

        const credentials = decodeCredentials(googleKey) as {
          client_email?: string;
        };
        if (!credentials.client_email) {
          return error("Invalid service account JSON — no client_email found");
        }

        // Test that the credentials actually work
        const auth = getAuthFromCredentials(credentials);
        const client = await auth.getClient();
        await client.getAccessToken();

        return json({
          valid: true,
          serviceAccountEmail: credentials.client_email,
        });
      }

      case "create-sheet": {
        const { googleKey, businessName } = body;
        if (!googleKey || !businessName) {
          return error("Missing googleKey or businessName");
        }

        const credentials = decodeCredentials(googleKey);
        const result = await createSpreadsheet(credentials, businessName);

        return json(result);
      }

      case "setup-drive": {
        const { googleKey, businessName } = body;
        if (!googleKey || !businessName) {
          return error("Missing googleKey or businessName");
        }

        const credentials = decodeCredentials(googleKey);
        const result = await createDriveFolders(credentials, businessName);

        return json(result);
      }

      case "generate-content": {
        const { googleKey, spreadsheetId, geminiKey, businessInfo } = body;
        if (!googleKey || !spreadsheetId || !geminiKey || !businessInfo) {
          return error("Missing required fields for content generation");
        }

        const credentials = decodeCredentials(googleKey);
        const content = await generateAllContent(businessInfo, geminiKey);

        // Write all content to the spreadsheet
        const auth = getAuthFromCredentials(credentials);
        const sheets = getSheetsClientWithAuth(auth);

        const writeData: { range: string; values: string[][] }[] = [];

        // Services
        if (content.services.length > 0) {
          const cols = SHEETS_SCHEMA.services.columns;
          writeData.push({
            range: "services!A2",
            values: content.services.map((svc) =>
              cols.map((c) => (svc as Record<string, string>)[c] || "")
            ),
          });
        }

        // FAQs
        if (content.faqs.length > 0) {
          const cols = SHEETS_SCHEMA.faqs.columns;
          writeData.push({
            range: "faqs!A2",
            values: content.faqs.map((faq) =>
              cols.map((c) => (faq as Record<string, string>)[c] || "")
            ),
          });
        }

        // Blog
        if (content.blog.length > 0) {
          const cols = SHEETS_SCHEMA.blog.columns;
          writeData.push({
            range: "blog!A2",
            values: content.blog.map((post) =>
              cols.map((c) => (post as Record<string, string>)[c] || "")
            ),
          });
        }

        // SEO
        if (content.seo.length > 0) {
          const cols = SHEETS_SCHEMA.seo.columns;
          writeData.push({
            range: "seo!A2",
            values: content.seo.map((seo) =>
              cols.map((c) => (seo as Record<string, string>)[c] || "")
            ),
          });
        }

        // Team
        if (content.team.length > 0) {
          const cols = SHEETS_SCHEMA.team.columns;
          writeData.push({
            range: "team!A2",
            values: content.team.map((member) =>
              cols.map((c) => (member as Record<string, string>)[c] || "")
            ),
          });
        }

        if (writeData.length > 0) {
          await sheets.spreadsheets.values.batchUpdate({
            spreadsheetId,
            requestBody: {
              valueInputOption: "RAW",
              data: writeData,
            },
          });
        }

        return json({
          services: content.services.length,
          faqs: content.faqs.length,
          blog: content.blog.length,
          seo: content.seo.length,
          team: content.team.length,
        });
      }

      case "save-config": {
        const { googleKey, spreadsheetId, config } = body;
        if (!googleKey || !spreadsheetId || !config) {
          return error("Missing required fields");
        }

        const credentials = decodeCredentials(googleKey);
        const auth = getAuthFromCredentials(credentials);
        const sheets = getSheetsClientWithAuth(auth);

        // Write key-value pairs to site_config tab
        const configEntries = Object.entries(config) as [string, string][];
        // Always include setup_complete
        if (!configEntries.find(([k]) => k === "setup_complete")) {
          configEntries.push(["setup_complete", "true"]);
        }

        const values = configEntries.map(([key, value]) => [key, String(value)]);

        // Clear existing config and write fresh
        await sheets.spreadsheets.values.clear({
          spreadsheetId,
          range: "site_config!A2:B1000",
        });

        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: "site_config!A2",
          valueInputOption: "RAW",
          requestBody: { values },
        });

        return json({ saved: true });
      }

      case "save-env": {
        const { envVars } = body;
        if (!envVars || typeof envVars !== "object") {
          return error("Missing envVars object");
        }

        await setEnvVars(envVars);
        return json({ saved: true });
      }

      case "trigger-redeploy": {
        const result = await triggerRedeploy();
        return json(result);
      }

      case "check-status": {
        const hasGoogle = !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
        const hasSheets = !!process.env.GOOGLE_SHEETS_ID;
        const hasDrive = !!process.env.GOOGLE_DRIVE_FOLDER_ID;
        const hasGemini = !!process.env.GEMINI_API_KEY;
        const hasVercel =
          !!process.env.VERCEL_TOKEN && !!process.env.VERCEL_PROJECT_ID;

        return json({
          google: hasGoogle,
          sheets: hasSheets,
          drive: hasDrive,
          gemini: hasGemini,
          vercel: hasVercel,
        });
      }

      default:
        return error(`Unknown action: ${action}`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return json({ error: message }, 500);
  }
}
