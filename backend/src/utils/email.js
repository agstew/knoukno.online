import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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
      html: `<p>Hi ${escapeHtml(name)},</p>
             <p>Your KnoUKno account is ready. Name your business and answer your first question -
             your free trial includes 5 questions for 3 days.</p>
             <p>Know you know.<br/>KnoUKno</p>`,
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
