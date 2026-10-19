import { Resend } from "resend";
import { render } from "@react-email/render";
import React from "react";
import WelcomeEmail from "../emails/WelcomeEmail.js";
import PasswordResetEmail from "../emails/PasswordResetEmail.js";
import BroadcastEmail from "../emails/BroadcastEmail.js";
import MilestoneEmail730 from "../emails/MilestoneEmail730.js";
import ContactEmail from "../emails/ContactEmail.js";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendWelcomeEmail(to, name) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set - skipping welcome email");
    return;
  }
  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "KnoUKno <hello@knoukno.online>",
      to,
      subject: "Welcome to KnoUKno",
      html: await render(React.createElement(WelcomeEmail, { name })),
    });
    if (error) console.error("Failed to send welcome email:", error.message);
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
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "KnoUKno <hello@knoukno.online>",
      to,
      subject: "Reset your KnoUKno password",
      html: await render(React.createElement(PasswordResetEmail, { name, resetUrl })),
    });
    if (error) console.error("Failed to send password reset email:", error.message);
  } catch (err) {
    console.error("Failed to send password reset email:", err.message);
  }
}

// Sent to the site's own inbox whenever someone submits the public contact form.
export async function sendContactEmail(name, email, message) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set - skipping contact form email");
    return;
  }
  const { error } = await resend.emails.send({
    from: "KnoUKno <hello@knoukno.online>",
    to: "hello@knoukno.online",
    reply_to: email,
    subject: `New contact form message from ${name}`,
    html: await render(React.createElement(ContactEmail, { name, email, message })),
  });
  if (error) throw new Error(error.message);
}

export async function sendBroadcastEmail(to, name, subject, message) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set - skipping broadcast email");
    return;
  }
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || "KnoUKno <hello@knoukno.online>",
    to,
    subject,
    html: await render(React.createElement(BroadcastEmail, { name, message })),
  });
  if (error) throw new Error(error.message);
}

// Sent automatically once, 730 days (2 years) after a user registers.
// Always sends from hello@knoukno.online regardless of EMAIL_FROM.
export async function send730DayEmail(to, name) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set - skipping 730-day milestone email");
    return;
  }
  const { error } = await resend.emails.send({
    from: "KnoUKno <hello@knoukno.online>",
    to,
    subject: "Two years in business - look how far you've come",
    html: await render(React.createElement(MilestoneEmail730, { name })),
  });
  if (error) throw new Error(error.message);
}
