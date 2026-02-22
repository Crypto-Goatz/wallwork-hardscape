/**
 * CRO9 analytics helpers.
 * CRO9 tracker is embedded via script tag in the root layout.
 * These helpers are for server-side analytics data retrieval.
 */

const CRO9_API_URL = process.env.CRO9_API_URL || "https://api.cro9.app";
const CRO9_API_KEY = process.env.NEXT_PUBLIC_CRO9_KEY;

export interface AnalyticsStats {
  visitors: number;
  pageviews: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: { path: string; views: number }[];
}

export interface BehavioralData {
  scrollDepth: { page: string; avgDepth: number }[];
  rageClicks: { selector: string; count: number; page: string }[];
  deadClicks: { selector: string; count: number; page: string }[];
  exitIntent: { page: string; rate: number }[];
  formAbandonment: { formId: string; rate: number; lastField: string }[];
}

/**
 * Fetch site analytics stats from CRO9 API.
 */
export async function getAnalyticsStats(
  period: string = "7d"
): Promise<AnalyticsStats> {
  if (!CRO9_API_KEY) throw new Error("CRO9 API key is not configured");

  const res = await fetch(`${CRO9_API_URL}/api/stats?period=${period}`, {
    headers: { Authorization: `Bearer ${CRO9_API_KEY}` },
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!res.ok) throw new Error(`CRO9 API error: ${res.status}`);
  return res.json();
}

/**
 * Fetch behavioral/SXO data from CRO9 API.
 */
export async function getBehavioralData(
  period: string = "7d"
): Promise<BehavioralData> {
  if (!CRO9_API_KEY) throw new Error("CRO9 API key is not configured");

  const res = await fetch(
    `${CRO9_API_URL}/api/behavioral?period=${period}`,
    {
      headers: { Authorization: `Bearer ${CRO9_API_KEY}` },
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) throw new Error(`CRO9 API error: ${res.status}`);
  return res.json();
}

/**
 * Track a conversion event server-side.
 */
export async function trackConversion(event: {
  name: string;
  value?: number;
  metadata?: Record<string, string>;
}): Promise<void> {
  if (!CRO9_API_KEY) return; // Silently skip if not configured

  await fetch(`${CRO9_API_URL}/api/events`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CRO9_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  }).catch(() => {
    // Don't fail the request if analytics tracking fails
  });
}
