import { unstable_cache } from "next/cache";

export interface SiteConfig {
  name: string;
  phone: string;
  email: string;
  url: string;
  tagline?: string;
  logoImageId?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  crmTrackingId?: string;
  cro9Key?: string;
}

const DEFAULTS: SiteConfig = {
  name: "Business Name",
  phone: "(555) 555-5555",
  email: "info@example.com",
  url: "https://example.com",
  tagline: "Professional Services You Can Trust",
  colors: {
    primary: "#2563eb",
    secondary: "#1e40af",
    accent: "#f59e0b",
  },
};

/**
 * Read site config from Google Sheet (site_config tab).
 * Cached for 5 minutes via unstable_cache.
 */
const getCachedSheetConfig = unstable_cache(
  async (): Promise<Record<string, string> | null> => {
    try {
      // Dynamic import to avoid loading googleapis on every cold start
      const { getSiteConfigFromSheet } = await import("@/lib/google/sheets");
      return await getSiteConfigFromSheet();
    } catch {
      return null;
    }
  },
  ["site-config-sheet"],
  { revalidate: 300 }
);

/**
 * Get site config with fallback chain: Sheet -> env vars -> defaults.
 * Must be called in server components (uses async cache).
 */
export async function getSiteConfig(): Promise<SiteConfig> {
  let sheetConfig: Record<string, string> | null = null;

  // Only attempt Sheet read if Google credentials exist
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY && process.env.GOOGLE_SHEETS_ID) {
    sheetConfig = await getCachedSheetConfig();
  }

  return {
    name:
      sheetConfig?.business_name ||
      process.env.NEXT_PUBLIC_SITE_NAME ||
      DEFAULTS.name,
    phone:
      sheetConfig?.phone ||
      process.env.NEXT_PUBLIC_SITE_PHONE ||
      DEFAULTS.phone,
    email:
      sheetConfig?.email ||
      process.env.NEXT_PUBLIC_SITE_EMAIL ||
      DEFAULTS.email,
    url:
      sheetConfig?.website ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      DEFAULTS.url,
    tagline:
      sheetConfig?.tagline ||
      process.env.NEXT_PUBLIC_SITE_TAGLINE ||
      DEFAULTS.tagline,
    logoImageId: sheetConfig?.logo_image_id || undefined,
    colors: {
      primary:
        sheetConfig?.primary_color ||
        process.env.NEXT_PUBLIC_COLOR_PRIMARY ||
        DEFAULTS.colors.primary,
      secondary:
        sheetConfig?.secondary_color ||
        process.env.NEXT_PUBLIC_COLOR_SECONDARY ||
        DEFAULTS.colors.secondary,
      accent:
        sheetConfig?.accent_color ||
        process.env.NEXT_PUBLIC_COLOR_ACCENT ||
        DEFAULTS.colors.accent,
    },
    crmTrackingId:
      sheetConfig?.crm_tracking_id ||
      process.env.NEXT_PUBLIC_CRM_TRACKING_ID,
    cro9Key:
      sheetConfig?.cro9_key ||
      process.env.NEXT_PUBLIC_CRO9_KEY,
  };
}
