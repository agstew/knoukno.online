import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { PLANS } from "../utils/plans.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // A cancelled subscription keeps access until the paid period actually
    // ends - only downgrade once planRenewsAt has passed.
    if (user.cancelAtPeriodEnd && user.planRenewsAt && user.planRenewsAt <= new Date()) {
      user.plan = "free";
      user.questionsQuota = PLANS.free.questionQuota;
      user.questionsUsed = 0;
      user.paypalSubscriptionId = null;
      user.planRenewsAt = null;
      user.cancelAtPeriodEnd = false;
      await user.save();
    }

    req.user = user;
    next();
  } catch (_err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}
