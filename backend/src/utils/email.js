import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const SITE_URL = process.env.FRONTEND_URL || "https://www.knoukno.online";
const LOGO_URL = `${SITE_URL}/favicon.svg`;

function emailLayout(bodyHtml) {
  return `
  <div style="background:#f4f5f7;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" style="max-width:480px;margin:0 auto;border-collapse:collapse;background:#ffffff;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="background:#0a0a0d;border-bottom:3px solid #1e90ff;padding:20px 24px;">
          <table role="presentation" style="border-collapse:collapse;">
            <tr>
              <td style="vertical-align:middle;padding-right:12px;">
                <img src="${LOGO_URL}" width="32" height="32" alt="KnoUKno" style="display:block;border-radius:8px;" />
              </td>
              <td style="vertical-align:middle;font-size:20px;font-weight:800;">
                <span style="color:#ffffff;">Kno U</span> <span style="color:#1e90ff;">Kno</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 24px;color:#111111;font-size:15px;line-height:1.6;">
          ${bodyHtml}
        </td>
      </tr>
    </table>
  </div>`;
}

export async function sendWelcomeEmail(to, name) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set - skipping welcome email");
    return;
  }
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "KnoUKno <hello@knoukno.online>",
      to,
      subject: "Welcome to KnoUKno",
      html: emailLayout(`<p>Hi ${escapeHtml(name)},</p>
             <p>Your KnoUKno account is ready. Name your business and answer your first question -
             your free trial includes 5 questions for 3 days.</p>
             <p>Know you know.<br/>KnoUKno</p>`),
    });
  } catch (err) {
    console.error("Failed to send welcome email:", err.message);
  }
}

function escapeHtml(str = "") {
  return str.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}
