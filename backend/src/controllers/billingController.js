import User from "../models/User.js";
import { PLANS } from "../utils/plans.js";

// Stubbed upgrade: no real payment processor is wired up yet (PayPal/Stripe TODO).
// This marks the plan and grants its quota so the rest of the app can be tested end-to-end.
export async function upgradePlan(req, res, next) {
  try {
    const { plan } = req.body;

    if (plan === "bonus") {
      const user = await User.findById(req.user._id);
      user.questionsQuota += PLANS.bonus.questionQuota;
      await user.save();
      return res.json({ user });
    }

    if (plan !== "member" && plan !== "pro") {
      return res.status(400).json({ error: "plan must be one of member, pro, bonus" });
    }

    const user = await User.findById(req.user._id);
    user.plan = plan;
    user.questionsQuota = PLANS[plan].questionQuota;
    user.questionsUsed = 0;
    user.trialEndsAt = null;
    await user.save();

    res.json({ user });
  } catch (err) {
    next(err);
  }
}
