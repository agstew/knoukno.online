import Answer from "../models/Answer.js";
import Title from "../models/Title.js";
import User from "../models/User.js";
import { sendBroadcastEmail } from "../utils/email.js";

export async function listUsers(_req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    next(err);
  }
}

export async function updateUserRole(req, res, next) {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ error: "role must be 'user' or 'admin'" });
    }
    if (req.params.id === req.user._id.toString() && role !== "admin") {
      return res.status(400).json({ error: "You cannot remove your own admin access" });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function getStats(_req, res, next) {
  try {
    const [userCount, businessCount, answerCount] = await Promise.all([
      User.countDocuments(),
      Title.countDocuments(),
      Answer.countDocuments(),
    ]);
    res.json({ userCount, businessCount, answerCount });
  } catch (err) {
    next(err);
  }
}

export async function sendBroadcast(req, res, next) {
  try {
    const { subject, message } = req.body;
    if (!subject || !subject.trim() || !message || !message.trim()) {
      return res.status(400).json({ error: "Subject and message are required" });
    }

    const recipients = await User.find({ emailOptIn: { $ne: false } }, "name email");

    const results = await Promise.allSettled(
      recipients.map((r) => sendBroadcastEmail(r.email, r.name, subject.trim(), message.trim()))
    );
    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.length - sent;

    res.json({ recipientCount: recipients.length, sent, failed });
  } catch (err) {
    next(err);
  }
}
