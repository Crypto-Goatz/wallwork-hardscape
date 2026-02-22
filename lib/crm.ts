const CRM_API_BASE = "https://services.leadconnectorhq.com";
const CRM_VERSION = "2021-07-28";

export interface CRMTokens {
  access_token: string;
  refresh_token: string;
  location_id: string;
  expires_at: number;
}

/**
 * Build the OAuth authorization URL for CRM connection.
 */
export function getOAuthUrl(): string {
  const clientId = process.env.CRM_CLIENT_ID;
  const redirectUri = process.env.CRM_REDIRECT_URI;
  if (!clientId || !redirectUri) {
    throw new Error("CRM OAuth credentials are not configured");
  }

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "contacts.write contacts.readonly",
  });

  return `https://marketplace.leadconnectorhq.com/oauth/chooselocation?${params}`;
}

/**
 * Exchange an authorization code for access tokens.
 */
export async function exchangeCode(code: string): Promise<CRMTokens> {
  const res = await fetch(`${CRM_API_BASE}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: process.env.CRM_CLIENT_ID!,
      client_secret: process.env.CRM_CLIENT_SECRET!,
      redirect_uri: process.env.CRM_REDIRECT_URI!,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`CRM OAuth error: ${error}`);
  }

  const data = await res.json();
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    location_id: data.locationId,
    expires_at: Date.now() + data.expires_in * 1000,
  };
}

/**
 * Create a contact/lead in the client's CRM sub-account.
 */
export async function createContact(
  accessToken: string,
  locationId: string,
  contact: {
    firstName: string;
    lastName?: string;
    email?: string;
    phone?: string;
    source?: string;
    tags?: string[];
  }
): Promise<{ id: string }> {
  const res = await fetch(`${CRM_API_BASE}/contacts/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Version: CRM_VERSION,
    },
    body: JSON.stringify({
      locationId,
      ...contact,
      source: contact.source || "Website Contact Form",
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`CRM contact creation error: ${error}`);
  }

  const data = await res.json();
  return { id: data.contact.id };
}
