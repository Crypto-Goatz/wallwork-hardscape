import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createContact } from "@/lib/crm";
import { trackConversion } from "@/lib/cro9";
import { getSiteConfigFromSheet, appendSheetRow } from "@/lib/google/sheets";

const PROJECT_TYPE_LABELS: Record<string, string> = {
  residential_wall: "Residential Retaining Wall",
  commercial_wall: "Commercial Retaining Wall",
  paver_patio: "Paver Patio / Outdoor Living",
  concrete_driveway: "Concrete Driveway",
  excavation: "Excavation / Grading",
  boulder_wall: "Boulder Wall",
  outdoor_kitchen: "Outdoor Kitchen / Fireplace",
  other: "Other",
};

const TIMELINE_LABELS: Record<string, string> = {
  asap: "ASAP",
  "1_3_months": "1–3 Months",
  "3_6_months": "3–6 Months",
  planning: "Just Planning",
};

const STAGE_LABELS: Record<string, string> = {
  ideas: "Ideas / Early Thinking",
  budgeting: "Budgeting",
  ready: "Ready to Schedule",
  plans: "Have Plans / Drawings",
};

function buildOwnerEmail(data: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  projectTypes: string[];
  otherDescription: string;
  description: string;
  timeline: string;
  projectStage: string;
}) {
  const projectLabels = data.projectTypes
    .map((t) => PROJECT_TYPE_LABELS[t] || t)
    .join(", ");

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f4f1ec;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ec;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e0d8;max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:#1c1a17;padding:28px 36px;">
            <p style="margin:0;color:#c2410c;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">New Estimate Request</p>
            <h1 style="margin:6px 0 0;color:#ffffff;font-size:24px;font-weight:700;">Wallwork Hardscape</h1>
          </td>
        </tr>
        <!-- Alert banner -->
        <tr>
          <td style="background:#c2410c;padding:12px 36px;">
            <p style="margin:0;color:#ffffff;font-size:13px;font-weight:600;">
              A new project estimate request has been submitted — respond within 24 hours.
            </p>
          </td>
        </tr>
        <!-- Contact Info -->
        <tr>
          <td style="padding:32px 36px 0;">
            <h2 style="margin:0 0 16px;color:#1c1a17;font-size:16px;font-weight:700;border-bottom:2px solid #f4f1ec;padding-bottom:10px;">Contact Information</h2>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:6px 0;color:#7a7265;font-size:13px;width:130px;">Full Name</td>
                <td style="padding:6px 0;color:#1c1a17;font-size:13px;font-weight:600;">${data.firstName} ${data.lastName}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#7a7265;font-size:13px;">Phone</td>
                <td style="padding:6px 0;color:#1c1a17;font-size:13px;font-weight:600;">${data.phone}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#7a7265;font-size:13px;">Email</td>
                <td style="padding:6px 0;color:#1c1a17;font-size:13px;font-weight:600;">${data.email}</td>
              </tr>
              ${data.address ? `<tr>
                <td style="padding:6px 0;color:#7a7265;font-size:13px;">Address</td>
                <td style="padding:6px 0;color:#1c1a17;font-size:13px;font-weight:600;">${data.address}</td>
              </tr>` : ""}
            </table>
          </td>
        </tr>
        <!-- Project Details -->
        <tr>
          <td style="padding:24px 36px 0;">
            <h2 style="margin:0 0 16px;color:#1c1a17;font-size:16px;font-weight:700;border-bottom:2px solid #f4f1ec;padding-bottom:10px;">Project Details</h2>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:6px 0;color:#7a7265;font-size:13px;width:130px;">Project Type(s)</td>
                <td style="padding:6px 0;color:#1c1a17;font-size:13px;font-weight:600;">${projectLabels}${data.otherDescription ? ` (${data.otherDescription})` : ""}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#7a7265;font-size:13px;">Timeline</td>
                <td style="padding:6px 0;color:#1c1a17;font-size:13px;font-weight:600;">${TIMELINE_LABELS[data.timeline] || data.timeline}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#7a7265;font-size:13px;">Project Stage</td>
                <td style="padding:6px 0;color:#1c1a17;font-size:13px;font-weight:600;">${STAGE_LABELS[data.projectStage] || data.projectStage}</td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Description -->
        <tr>
          <td style="padding:24px 36px 0;">
            <h2 style="margin:0 0 10px;color:#1c1a17;font-size:16px;font-weight:700;border-bottom:2px solid #f4f1ec;padding-bottom:10px;">Project Description</h2>
            <p style="margin:0;color:#1c1a17;font-size:14px;line-height:1.7;background:#f4f1ec;border-radius:8px;padding:16px;">${data.description}</p>
          </td>
        </tr>
        <!-- CTA -->
        <tr>
          <td style="padding:32px 36px;">
            <a href="tel:${data.phone.replace(/\D/g, "")}" style="display:inline-block;background:#c2410c;color:#ffffff;font-size:14px;font-weight:700;padding:14px 28px;border-radius:8px;text-decoration:none;">
              Call ${data.firstName} Now &rarr;
            </a>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f4f1ec;padding:20px 36px;border-top:1px solid #e5e0d8;">
            <p style="margin:0;color:#7a7265;font-size:12px;">This request was submitted via the Wallwork Hardscape website contact form.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim();
}

function buildClientEmail(data: {
  firstName: string;
  phone: string;
  email: string;
  address: string;
  projectTypes: string[];
  otherDescription: string;
  description: string;
  timeline: string;
  projectStage: string;
}) {
  const projectLabels = data.projectTypes
    .map((t) => PROJECT_TYPE_LABELS[t] || t)
    .join(", ");

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f4f1ec;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ec;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e0d8;max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:#1c1a17;padding:28px 36px;">
            <p style="margin:0;color:#c2410c;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">Free Estimate Request Received</p>
            <h1 style="margin:6px 0 0;color:#ffffff;font-size:24px;font-weight:700;">Wallwork Hardscape</h1>
            <p style="margin:6px 0 0;color:#ffffff;opacity:0.6;font-size:13px;">Built to Last. Designed to Impress.</p>
          </td>
        </tr>
        <!-- Greeting -->
        <tr>
          <td style="padding:36px 36px 0;">
            <h2 style="margin:0 0 12px;color:#1c1a17;font-size:20px;font-weight:700;">Thanks, ${data.firstName} — we've got your request!</h2>
            <p style="margin:0;color:#7a7265;font-size:14px;line-height:1.7;">
              We've received your estimate request and our team will review your project details within the next business day. Here's a summary of what you submitted:
            </p>
          </td>
        </tr>
        <!-- Summary card -->
        <tr>
          <td style="padding:24px 36px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ec;border-radius:10px;border:1px solid #e5e0d8;">
              <tr><td style="padding:20px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:6px 0;color:#7a7265;font-size:13px;width:130px;">Project Type</td>
                    <td style="padding:6px 0;color:#1c1a17;font-size:13px;font-weight:600;">${projectLabels}${data.otherDescription ? ` (${data.otherDescription})` : ""}</td>
                  </tr>
                  ${data.address ? `<tr>
                    <td style="padding:6px 0;color:#7a7265;font-size:13px;">Address</td>
                    <td style="padding:6px 0;color:#1c1a17;font-size:13px;font-weight:600;">${data.address}</td>
                  </tr>` : ""}
                  <tr>
                    <td style="padding:6px 0;color:#7a7265;font-size:13px;">Your Timeline</td>
                    <td style="padding:6px 0;color:#1c1a17;font-size:13px;font-weight:600;">${TIMELINE_LABELS[data.timeline] || data.timeline}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#7a7265;font-size:13px;">Project Stage</td>
                    <td style="padding:6px 0;color:#1c1a17;font-size:13px;font-weight:600;">${STAGE_LABELS[data.projectStage] || data.projectStage}</td>
                  </tr>
                </table>
              </td></tr>
            </table>
          </td>
        </tr>
        <!-- Description -->
        <tr>
          <td style="padding:20px 36px 0;">
            <p style="margin:0 0 8px;color:#1c1a17;font-size:13px;font-weight:700;">Your Description</p>
            <p style="margin:0;color:#7a7265;font-size:13px;line-height:1.7;font-style:italic;">"${data.description}"</p>
          </td>
        </tr>
        <!-- What happens next -->
        <tr>
          <td style="padding:28px 36px 0;">
            <h3 style="margin:0 0 16px;color:#1c1a17;font-size:15px;font-weight:700;">What happens next?</h3>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:8px 0;vertical-align:top;width:28px;">
                  <div style="width:22px;height:22px;background:#c2410c;border-radius:50%;text-align:center;line-height:22px;color:#fff;font-size:11px;font-weight:700;">1</div>
                </td>
                <td style="padding:8px 0;padding-left:12px;color:#7a7265;font-size:13px;line-height:1.6;">Our team reviews your project details.</td>
              </tr>
              <tr>
                <td style="padding:8px 0;vertical-align:top;width:28px;">
                  <div style="width:22px;height:22px;background:#c2410c;border-radius:50%;text-align:center;line-height:22px;color:#fff;font-size:11px;font-weight:700;">2</div>
                </td>
                <td style="padding:8px 0;padding-left:12px;color:#7a7265;font-size:13px;line-height:1.6;">We reach out within <strong style="color:#1c1a17;">1 business day</strong> to confirm details and schedule a site visit.</td>
              </tr>
              <tr>
                <td style="padding:8px 0;vertical-align:top;width:28px;">
                  <div style="width:22px;height:22px;background:#c2410c;border-radius:50%;text-align:center;line-height:22px;color:#fff;font-size:11px;font-weight:700;">3</div>
                </td>
                <td style="padding:8px 0;padding-left:12px;color:#7a7265;font-size:13px;line-height:1.6;">We deliver your <strong style="color:#1c1a17;">free, detailed estimate</strong> — no pressure, no obligation.</td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Contact us -->
        <tr>
          <td style="padding:28px 36px 36px;">
            <p style="margin:0 0 16px;color:#7a7265;font-size:13px;">Need to reach us sooner? We're here:</p>
            <a href="tel:4125550199" style="display:inline-block;background:#1c1a17;color:#ffffff;font-size:14px;font-weight:700;padding:13px 26px;border-radius:8px;text-decoration:none;margin-right:12px;">
              Call (412) 555-0199
            </a>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f4f1ec;padding:20px 36px;border-top:1px solid #e5e0d8;">
            <p style="margin:0;color:#7a7265;font-size:12px;">Wallwork Hardscape &mdash; Pittsburgh, PA &amp; Surrounding Counties</p>
            <p style="margin:4px 0 0;color:#7a7265;font-size:12px;">You're receiving this because you submitted an estimate request on our website.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim();
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    firstName = "",
    lastName = "",
    phone = "",
    email = "",
    address = "",
    projectTypes = [],
    otherDescription = "",
    description = "",
    timeline = "",
    projectStage = "",
  } = body;

  if (!email || !firstName || !phone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Save lead to Google Sheets
  try {
    await appendSheetRow("leads", {
      id: `lead_${Date.now()}`,
      submitted_at: new Date().toISOString(),
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      address,
      project_types: (projectTypes as string[]).map((t) => PROJECT_TYPE_LABELS[t] || t).join(", "),
      description,
      timeline: TIMELINE_LABELS[timeline] || timeline,
      project_stage: STAGE_LABELS[projectStage] || projectStage,
      status: "new",
    });
  } catch {
    // Non-fatal — continue even if Sheets isn't configured
  }

  const resendKey = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.OWNER_EMAIL || "info@wallworkhardscape.com";

  // Send emails via Resend
  if (resendKey) {
    const resend = new Resend(resendKey);
    const emailData = { firstName, lastName, phone, email, address, projectTypes, otherDescription, description, timeline, projectStage };

    const projectLabels = (projectTypes as string[])
      .map((t) => PROJECT_TYPE_LABELS[t] || t)
      .join(", ");

    await Promise.all([
      // Owner notification
      resend.emails.send({
        from: "Wallwork Hardscape <noreply@wallworkhardscape.com>",
        to: [ownerEmail],
        subject: `New Estimate Request — ${firstName} ${lastName} (${projectLabels})`,
        html: buildOwnerEmail(emailData),
      }),
      // Client confirmation
      resend.emails.send({
        from: "Wallwork Hardscape <noreply@wallworkhardscape.com>",
        to: [email],
        subject: `We received your estimate request, ${firstName}!`,
        html: buildClientEmail(emailData),
      }),
    ]);
  }

  // CRM + conversion tracking (best effort)
  try {
    const siteConfig: Record<string, string> = await getSiteConfigFromSheet().catch(() => ({}));
    const accessToken = siteConfig["crm_access_token"];
    const locationId = siteConfig["crm_location_id"];

    if (accessToken && locationId) {
      await createContact(accessToken, locationId, {
        firstName,
        lastName,
        email,
        phone,
        source: "Website Estimate Form",
        tags: ["website-lead", "estimate-request", ...projectTypes],
      });
    }

    await trackConversion({
      name: "estimate_form_submission",
      metadata: { email, projectTypes: projectTypes.join(",") },
    });
  } catch {
    // Non-fatal — emails already sent
  }

  return NextResponse.json({ success: true });
}
