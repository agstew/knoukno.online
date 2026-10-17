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

export async function sendPasswordResetEmail(to, name, resetUrl) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set - skipping password reset email");
    return;
  }
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "KnoUKno <hello@knoukno.online>",
      to,
      subject: "Reset your KnoUKno password",
      html: emailLayout(`<p>Hi ${escapeHtml(name)},</p>
             <p>We got a request to reset your KnoUKno password. This link expires in 1 hour:</p>
             <p><a href="${resetUrl}" style="color:#1e90ff;">Reset your password</a></p>
             <p>If you didn't ask for this, you can ignore this email.</p>
             <p>Know you know.<br/>KnoUKno</p>`),
    });
  } catch (err) {
    console.error("Failed to send password reset email:", err.message);
  }
}

export async function sendBroadcastEmail(to, name, subject, message) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set - skipping broadcast email");
    return;
  }
  await resend.emails.send({
    from: process.env.EMAIL_FROM || "KnoUKno <hello@knoukno.online>",
    to,
    subject,
    html: emailLayout(`<p>Hi ${escapeHtml(name)},</p>
           <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
           <p>Know you know.<br/>KnoUKno</p>`),
  });
}

// Sent automatically once, 730 days (2 years) after a user registers.
export async function send730DayEmail(to, name) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set - skipping 730-day milestone email");
    return;
  }
  await resend.emails.send({
    from: process.env.EMAIL_FROM || "KnoUKno <hello@knoukno.online>",
    to,
    subject: "Two years in business - look how far you've come",
    html: emailLayout(`<p>Hi ${escapeHtml(name)},</p>
           <p>Today marks exactly two years - 730 days - since you first sat down and named your
           business on KnoUKno. That is worth stopping to notice, because most ideas never make it
           this far.</p>
           <p>Two years ago, you were staring at a blank page, answering the first hard question about
           law: what entity to register as, and why. Then came location - the rent, the zoning, the
           foot traffic, the backup plan if the first choice fell through. Then hiring - deciding what
           your first employee needed to cover, what you could actually pay, and what success looked
           like in the first thirty days. Then the people - who your customers really are, what problem
           brings them through the door, and what makes them come back.</p>
           <p>None of those questions were easy. None of them had a single right answer. But you wrote
           your own answers down anyway, in your own words, and you kept going. That is the whole idea
           behind KnoUKno: the question is ours, the answer is yours, and the answer only matters if you
           actually use it. Two years later, you have.</p>
           <p>Being in business for two years means you have made payroll, or paid yourself, more times
           than you can count. It means you have dealt with a slow month and figured out how to get
           through it. It means a customer came back a second time, and a third, because something you
           built actually worked for them. It means the plan you wrote on day one is not the plan you are
           running today - and that is exactly how it should be. A business that has not changed in two
           years is not learning from its customers.</p>
           <p>However big or small things look right now, two years of staying in business is a real,
           measurable result. Most new businesses do not make it this far. Yours did, because you did the
           work, one honest answer at a time.</p>
           <p>Go back into your business title whenever you want to see where you started, re-grade your
           answers, or add new ones as the business keeps changing. We kept every one of them for exactly
           this reason.</p>
           <p>Congratulations on two years. Here is to the next two.</p>
           <p>Know you know.<br/>KnoUKno</p>`),
  });
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
