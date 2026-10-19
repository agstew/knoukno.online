import { sendContactEmail } from "../utils/email.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContact(req, res, next) {
  try {
    const { name, email, message } = req.body;
    if (!name || !name.trim() || !email || !message || !message.trim()) {
      return res.status(400).json({ error: "Name, email, and message are required" });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    await sendContactEmail(name.trim(), email.toLowerCase().trim(), message.trim());

    res.json({ message: "Thanks - your message has been sent." });
  } catch (err) {
    next(err);
  }
}
