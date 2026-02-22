/**
 * Centralized configuration access.
 * Re-exports getSiteConfig and provides runtime env checks.
 */

export { getSiteConfig, type SiteConfig } from "@/config/site.config";
export { SHEETS_SCHEMA, type SheetName } from "@/config/sheets-schema";

/**
 * Check if all required environment variables are set.
 * Returns an array of missing variable names.
 */
export function checkRequiredEnv(): string[] {
  const required = [
    "GOOGLE_SHEETS_ID",
    "GOOGLE_DRIVE_FOLDER_ID",
    "GOOGLE_SERVICE_ACCOUNT_KEY",
    "ADMIN_PASSWORD",
    "SESSION_SECRET",
  ];

  return required.filter((key) => !process.env[key]);
}

/**
 * Check if optional integrations are configured.
 */
export function getIntegrationStatus() {
  return {
    googleSheets: !!process.env.GOOGLE_SHEETS_ID,
    googleDrive: !!process.env.GOOGLE_DRIVE_FOLDER_ID,
    gemini: !!process.env.GEMINI_API_KEY,
    cro9: !!process.env.NEXT_PUBLIC_CRO9_KEY,
    crm: !!process.env.CRM_CLIENT_ID,
    crmTracking: !!process.env.NEXT_PUBLIC_CRM_TRACKING_ID,
  };
}

/**
 * Check if the initial setup wizard has been completed.
 * Returns false if Google credentials aren't set or setup_complete isn't true in Sheet.
 */
export async function isSetupComplete(): Promise<boolean> {
  if (
    !process.env.GOOGLE_SERVICE_ACCOUNT_KEY ||
    !process.env.GOOGLE_SHEETS_ID
  ) {
    return false;
  }

  try {
    const { getSiteConfigFromSheet } = await import("@/lib/google/sheets");
    const config = await getSiteConfigFromSheet();
    return config["setup_complete"] === "true";
  } catch {
    return false;
  }
}
