import { sendHiringEmail } from "../utils/email.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitHiring(req, res, next) {
  try {
    const { name, email, role, message } = req.body;
    if (!name || !name.trim() || !email || !message || !message.trim()) {
      return res.status(400).json({ error: "Name, email, and message are required" });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    await sendHiringEmail(name.trim(), email.toLowerCase().trim(), (role || "").trim(), message.trim());

    res.json({ message: "Thanks - your message has been sent." });
  } catch (err) {
    next(err);
  }
}
