import { createServerFn } from "@tanstack/react-start";
import { Resend } from "resend";
import { z } from "zod";

// ─── Input schema ──────────────────────────────────────────────────────────────

const emailInputSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  propertyName: z.string(),
  role: z.string().optional(),
  numberOfUnits: z.string().optional(),
  timeline: z.string().optional(),
  workCategories: z.array(z.string()),
  message: z.string().optional(),
});

type EmailInput = z.infer<typeof emailInputSchema>;

// ─── HTML builder ──────────────────────────────────────────────────────────────

function buildEmailHtml(d: EmailInput): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-CA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-CA", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
  const year = now.getFullYear();

  const role = d.role ?? "—";
  const phone = d.phone ?? "Not provided";
  const units = d.numberOfUnits ?? null;
  const timeline = d.timeline ?? null;

  // Summary sentence
  let summary = `<strong>${d.name}</strong> has requested a Co-op Pricing Sheet for <strong>${d.propertyName}</strong>. They are a <strong>${role}</strong>`;
  if (units) summary += ` with <strong>${units} units</strong>`;
  if (timeline) summary += ` and a timeline of <strong>${timeline}</strong>`;
  summary += ".";

  // Work category pills
  const categoryPills =
    d.workCategories.length > 0
      ? d.workCategories
          .map(
            (cat) =>
              `<span style="display:inline-block;background:#F5EDE0;border:0.5px solid #D4C4B0;border-radius:20px;padding:3px 10px;font-family:'DM Mono',monospace;font-size:10px;color:#5A4A38;margin:2px 3px 2px 0;">${cat}</span>`,
          )
          .join("")
      : `<span style="font-family:Georgia,serif;font-size:14px;color:#7A6A58;font-style:italic;">None specified</span>`;

  // Optional message block
  const messageBlock = d.message
    ? `
      <tr><td style="padding:24px 0 8px;">
        <p style="margin:0 0 10px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#7A6A58;">Additional Notes</p>
        <div style="border-left:3px solid #C04A22;background:#FAF6F0;padding:14px 18px;border-radius:0 6px 6px 0;">
          <p style="margin:0;font-family:Georgia,serif;font-size:14px;color:#3D2E22;font-style:italic;line-height:1.6;">${d.message}</p>
        </div>
      </td></tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>New Co-op Pricing Request — ${d.propertyName}</title></head>
<body style="margin:0;padding:0;background:#F0EAE0;font-family:Georgia,serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#F0EAE0;padding:32px 16px;">
<tr><td align="center">
<table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

  <!-- HEADER -->
  <tr>
    <td style="background:#1C1814;padding:28px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td valign="middle">
            <!-- IW mark -->
            <span style="display:inline-block;width:34px;height:34px;background:#C04A22;border-radius:7px;font-family:'DM Mono',monospace;font-size:11px;font-weight:500;color:#fff;letter-spacing:-0.5px;text-align:center;line-height:34px;vertical-align:middle;">IW</span>
            <span style="font-family:Georgia,serif;font-size:17px;font-weight:600;color:#F5EDE0;vertical-align:middle;margin-left:10px;">Imagine <em style="font-style:italic;font-weight:300;">Work</em></span>
          </td>
          <td align="right" valign="middle">
            <span style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(245,237,224,0.5);">New Pricing Request</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- BANNER -->
  <tr>
    <td style="background:#C04A22;padding:16px 32px;">
      <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:18px;font-weight:700;color:#fff;">New Co-op Pricing Sheet Request</p>
      <p style="margin:0;font-family:'DM Mono',monospace;font-size:10px;color:rgba(255,255,255,0.7);">Submitted via Imagine Work &nbsp;·&nbsp; ${dateStr} at ${timeStr}</p>
    </td>
  </tr>

  <!-- BODY -->
  <tr>
    <td style="background:#fff;padding:28px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0">

        <!-- Summary box -->
        <tr><td style="padding-bottom:24px;">
          <div style="background:#F5EDE0;border-radius:6px;padding:10px 14px;">
            <p style="margin:0;font-family:Georgia,serif;font-size:14px;color:#3D2E22;line-height:1.6;">${summary}</p>
          </div>
        </td></tr>

        <!-- CONTACT DETAILS -->
        <tr><td style="padding-bottom:16px;">
          <p style="margin:0 0 10px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#7A6A58;">Contact Details</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E8DDD0;border-radius:6px;overflow:hidden;">
            <tr style="background:#FAF6F0;">
              <td width="50%" style="padding:10px 14px;border-bottom:1px solid #E8DDD0;border-right:1px solid #E8DDD0;">
                <p style="margin:0 0 2px;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.08em;text-transform:uppercase;color:#A08870;">Name</p>
                <p style="margin:0;font-family:Georgia,serif;font-size:14px;color:#1C1814;">${d.name}</p>
              </td>
              <td width="50%" style="padding:10px 14px;border-bottom:1px solid #E8DDD0;">
                <p style="margin:0 0 2px;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.08em;text-transform:uppercase;color:#A08870;">Email</p>
                <p style="margin:0;font-family:Georgia,serif;font-size:14px;color:#1C1814;"><a href="mailto:${d.email}" style="color:#C04A22;text-decoration:none;">${d.email}</a></p>
              </td>
            </tr>
            <tr>
              <td width="50%" style="padding:10px 14px;border-right:1px solid #E8DDD0;">
                <p style="margin:0 0 2px;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.08em;text-transform:uppercase;color:#A08870;">Phone</p>
                <p style="margin:0;font-family:Georgia,serif;font-size:14px;color:${d.phone ? "#1C1814" : "#A08870"};font-style:${d.phone ? "normal" : "italic"};">${phone}</p>
              </td>
              <td width="50%" style="padding:10px 14px;">
                <p style="margin:0 0 2px;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.08em;text-transform:uppercase;color:#A08870;">Role</p>
                <p style="margin:0;font-family:Georgia,serif;font-size:14px;color:${role !== "—" ? "#1C1814" : "#A08870"};font-style:${role !== "—" ? "normal" : "italic"};">${role}</p>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- BUILDING DETAILS -->
        <tr><td style="padding-bottom:16px;">
          <p style="margin:0 0 10px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#7A6A58;">Building Details</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E8DDD0;border-radius:6px;overflow:hidden;">
            <tr style="background:#FAF6F0;">
              <td width="50%" style="padding:10px 14px;border-bottom:1px solid #E8DDD0;border-right:1px solid #E8DDD0;">
                <p style="margin:0 0 2px;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.08em;text-transform:uppercase;color:#A08870;">Co-op / Property Name</p>
                <p style="margin:0;font-family:Georgia,serif;font-size:14px;color:#1C1814;">${d.propertyName}</p>
              </td>
              <td width="50%" style="padding:10px 14px;border-bottom:1px solid #E8DDD0;">
                <p style="margin:0 0 2px;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.08em;text-transform:uppercase;color:#A08870;">Number of Units</p>
                <p style="margin:0;font-family:Georgia,serif;font-size:14px;color:${units ? "#1C1814" : "#A08870"};font-style:${units ? "normal" : "italic"};">${units ?? "Not provided"}</p>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="padding:10px 14px;">
                <p style="margin:0 0 2px;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.08em;text-transform:uppercase;color:#A08870;">Timeline</p>
                <p style="margin:0;font-family:Georgia,serif;font-size:14px;color:${timeline ? "#1C1814" : "#A08870"};font-style:${timeline ? "normal" : "italic"};">${timeline ?? "Not provided"}</p>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- WORK CATEGORIES -->
        <tr><td style="padding-bottom:${d.message ? "8px" : "4px"};">
          <p style="margin:0 0 10px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#7A6A58;">Work Categories Needed</p>
          <div style="padding:10px 0 4px;">${categoryPills}</div>
        </td></tr>

        <!-- ADDITIONAL NOTES (conditional) -->
        ${messageBlock}

      </table>
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="background:#1C1814;padding:20px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td valign="middle">
            <span style="display:inline-block;width:24px;height:24px;background:#C04A22;border-radius:5px;font-family:'DM Mono',monospace;font-size:9px;font-weight:500;color:#fff;letter-spacing:-0.5px;text-align:center;line-height:24px;vertical-align:middle;">IW</span>
            <span style="font-family:Georgia,serif;font-size:13px;font-weight:600;color:#F5EDE0;vertical-align:middle;margin-left:8px;">Imagine <em style="font-style:italic;font-weight:300;">Work</em></span>
          </td>
        </tr>
        <tr>
          <td style="padding:14px 0 12px;">
            <div style="height:1px;background:rgba(255,255,255,0.1);"></div>
          </td>
        </tr>
        <tr>
          <td>
            <p style="margin:0 0 4px;font-family:'DM Mono',monospace;font-size:10px;color:rgba(245,237,224,0.5);">This request was submitted through Imagine Work.</p>
            <p style="margin:0 0 4px;font-family:'DM Mono',monospace;font-size:10px;color:rgba(245,237,224,0.5);">Reply directly to this email to respond to ${d.name} at <a href="mailto:${d.email}" style="color:rgba(245,237,224,0.7);text-decoration:none;">${d.email}</a>.</p>
            <p style="margin:0;font-family:'DM Mono',monospace;font-size:10px;color:rgba(245,237,224,0.3);">© ${year} Imagine Work. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

</table>
</td></tr>
</table>

</body>
</html>`;
}

// ─── Server function ───────────────────────────────────────────────────────────

export const sendPricingRequestEmail = createServerFn({ method: "POST" })
  .inputValidator(emailInputSchema)
  .handler(async ({ data }) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey === "your_key_here") {
      console.warn("[sendPricingRequestEmail] RESEND_API_KEY not set — skipping email send.");
      return { sent: false, reason: "no_api_key" };
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["philip.a@prelook.com"],
      cc: ["kelvin@prelook.com"],
      reply_to: data.email,
      subject: `New Co-op Pricing Sheet Request — ${data.propertyName}`,
      html: buildEmailHtml(data),
    });

    if (error) {
      console.error("[sendPricingRequestEmail] Resend error:", error);
      return { sent: false, reason: error.message };
    }

    return { sent: true };
  });
