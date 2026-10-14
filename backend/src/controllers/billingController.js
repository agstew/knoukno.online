import User from "../models/User.js";
import { getPaypalPlanId, PLANS } from "../utils/plans.js";
import {
  cancelSubscription,
  captureOrder,
  createOrder,
  getSubscription,
  verifyWebhookSignature,
} from "../utils/paypal.js";

// Bonus questions are a one-time PayPal order (Orders v2 API).
export async function createBonusOrder(req, res, next) {
  try {
    const order = await createOrder({
      amount: PLANS.bonus.price,
      description: "KnoUKno - Bonus questions (+100)",
    });
    res.status(201).json({ id: order.id });
  } catch (err) {
    next(err);
  }
}

export async function captureBonusOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const capture = await captureOrder(orderId);
    if (capture.status !== "COMPLETED") {
      return res.status(402).json({ error: "Payment was not completed" });
    }

    const user = await User.findById(req.user._id);
    user.questionsQuota += PLANS.bonus.questionQuota;
    await user.save();

    res.json({ user });
  } catch (err) {
    next(err);
  }
}

// Member/Pro are real recurring PayPal Subscriptions. The frontend creates the
// subscription client-side via the PayPal JS SDK using the plan's paypalPlanId,
// then sends us the resulting subscriptionID to verify and activate here.
export async function confirmSubscription(req, res, next) {
  try {
    const { plan, subscriptionID } = req.body;
    if (plan !== "member" && plan !== "pro") {
      return res.status(400).json({ error: "plan must be one of member, pro" });
    }
    if (!subscriptionID) {
      return res.status(400).json({ error: "subscriptionID is required" });
    }

    const subscription = await getSubscription(subscriptionID);
    const expectedPlanId = getPaypalPlanId(plan);
    if (!expectedPlanId || subscription.plan_id !== expectedPlanId) {
      return res.status(400).json({ error: "Subscription does not match the requested plan" });
    }
    if (subscription.status !== "ACTIVE") {
      return res.status(402).json({ error: `Subscription is not active (status: ${subscription.status})` });
    }

    const user = await User.findById(req.user._id);
    user.plan = plan;
    user.questionsQuota = PLANS[plan].questionQuota;
    user.questionsUsed = 0;
    user.trialEndsAt = null;
    user.paypalSubscriptionId = subscriptionID;
    user.planRenewsAt = subscription.billing_info?.next_billing_time || null;
    await user.save();

    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function cancelMySubscription(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user.paypalSubscriptionId) {
      return res.status(400).json({ error: "No active subscription to cancel" });
    }

    await cancelSubscription(user.paypalSubscriptionId);

    user.plan = "free";
    user.questionsQuota = PLANS.free.questionQuota;
    user.questionsUsed = 0;
    user.paypalSubscriptionId = null;
    user.planRenewsAt = null;
    await user.save();

    res.json({ user });
  } catch (err) {
    next(err);
  }
}

// PayPal calls this directly (no user auth) to notify us of subscription
// lifecycle/renewal events so quota and plan state stay in sync over time.
export async function paypalWebhook(req, res, next) {
  try {
    const verified = await verifyWebhookSignature(req.headers, req.body);
    if (!verified) {
      return res.status(400).json({ error: "Invalid webhook signature" });
    }

    const event = req.body;
    const subscriptionId = event.resource?.billing_agreement_id || event.resource?.id;

    switch (event.event_type) {
      case "PAYMENT.SALE.COMPLETED": {
        // A recurring payment succeeded - renew the user's quota for the new period.
        if (subscriptionId) {
          const user = await User.findOne({ paypalSubscriptionId: subscriptionId });
          if (user) {
            user.questionsUsed = 0;
            user.questionsQuota = PLANS[user.plan]?.questionQuota ?? user.questionsQuota;
            await user.save();
          }
        }
        break;
      }
      case "BILLING.SUBSCRIPTION.CANCELLED":
      case "BILLING.SUBSCRIPTION.EXPIRED":
      case "BILLING.SUBSCRIPTION.SUSPENDED": {
        const user = await User.findOne({ paypalSubscriptionId: subscriptionId });
        if (user) {
          user.plan = "free";
          user.questionsQuota = PLANS.free.questionQuota;
          user.paypalSubscriptionId = null;
          user.planRenewsAt = null;
          await user.save();
        }
        break;
      }
      default:
        break;
    }

    res.json({ received: true });
  } catch (err) {
    next(err);
  }
}
