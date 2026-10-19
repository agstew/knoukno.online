import Answer from "../models/Answer.js";
import Average from "../models/Average.js";
import Grade from "../models/Grade.js";
import Question from "../models/Question.js";
import Rate from "../models/Rate.js";
import Title from "../models/Title.js";
import User from "../models/User.js";
import { sendBroadcastEmail } from "../utils/email.js";
import { PLANS } from "../utils/plans.js";

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

export async function deleteUser(req, res, next) {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ error: "You cannot delete your own account" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const titleIds = await Title.find({ user: user._id }).distinct("_id");
    if (titleIds.length > 0) {
      await Promise.all([
        Answer.deleteMany({ business: { $in: titleIds } }),
        Grade.deleteMany({ business: { $in: titleIds } }),
        Rate.deleteMany({ business: { $in: titleIds } }),
        Average.deleteMany({ business: { $in: titleIds } }),
        Question.deleteMany({ business: { $in: titleIds } }),
      ]);
      await Title.deleteMany({ user: user._id });
    }

    await user.deleteOne();

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function getStats(_req, res, next) {
  try {
    const [userCount, businessCount, answerCount, memberCount, proCount] = await Promise.all([
      User.countDocuments(),
      Title.countDocuments(),
      Answer.countDocuments(),
      User.countDocuments({ plan: "member", cancelAtPeriodEnd: { $ne: true } }),
      User.countDocuments({ plan: "pro", cancelAtPeriodEnd: { $ne: true } }),
    ]);
    // Pro is billed yearly - normalize to a monthly figure for a comparable MRR estimate.
    const mrr = memberCount * PLANS.member.price + proCount * (PLANS.pro.price / 12);
    res.json({
      userCount,
      businessCount,
      answerCount,
      revenue: { memberCount, proCount, mrr: Math.round(mrr * 100) / 100 },
    });
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
