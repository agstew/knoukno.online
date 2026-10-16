import User from "../models/User.js";
import { getPaypalPlanId, PLANS } from "../utils/plans.js";
import {
  cancelSubscription,
  captureOrder,
  createOrder,
  getSubscription,
  getSubscriptionTransactions,
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
    user.cancelAtPeriodEnd = false;
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

    // Stops future billing in PayPal, but keep access until the current
    // paid period ends (enforced lazily in the requireAuth middleware).
    user.cancelAtPeriodEnd = true;
    await user.save();

    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function getPaymentSchedule(req, res, next) {
  try {
    const user = req.user;
    if (!user.paypalSubscriptionId) {
      return res.json({ subscription: null, transactions: [] });
    }

    const subscription = await getSubscription(user.paypalSubscriptionId);

    const startTime = subscription.create_time || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
    const endTime = new Date().toISOString();
    let transactions = [];
    try {
      const txData = await getSubscriptionTransactions(user.paypalSubscriptionId, startTime, endTime);
      transactions = (txData.transactions || []).map((t) => ({
        id: t.id,
        status: t.status,
        amount: t.amount_with_breakdown?.gross_amount || null,
        time: t.time,
      }));
    } catch {
      // Transaction history is best-effort - still return the subscription summary if it fails.
    }

    res.json({
      subscription: {
        plan: user.plan,
        status: subscription.status,
        cancelAtPeriodEnd: user.cancelAtPeriodEnd,
        nextBillingTime: subscription.billing_info?.next_billing_time || null,
        lastPaymentAmount: subscription.billing_info?.last_payment?.amount || null,
        lastPaymentTime: subscription.billing_info?.last_payment?.time || null,
      },
      transactions,
    });
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
      case "BILLING.SUBSCRIPTION.CANCELLED": {
        // User (or PayPal) cancelled future billing - access continues until
        // planRenewsAt passes, enforced lazily in the requireAuth middleware.
        const user = await User.findOne({ paypalSubscriptionId: subscriptionId });
        if (user) {
          user.cancelAtPeriodEnd = true;
          await user.save();
        }
        break;
      }
      case "BILLING.SUBSCRIPTION.EXPIRED":
      case "BILLING.SUBSCRIPTION.SUSPENDED": {
        // The subscription is no longer active (final cycle reached, or
        // suspended after repeated failed payments) - downgrade now.
        const user = await User.findOne({ paypalSubscriptionId: subscriptionId });
        if (user) {
          user.plan = "free";
          user.questionsQuota = PLANS.free.questionQuota;
          user.paypalSubscriptionId = null;
          user.planRenewsAt = null;
          user.cancelAtPeriodEnd = false;
          await user.save();
        }
        break;
      }
      case "BILLING.SUBSCRIPTION.PAYMENT.FAILED":
        // PayPal retries automatically; a single failure doesn't revoke
        // access. Repeated failures eventually surface as SUSPENDED above.
        break;
      default:
        break;
    }

    res.json({ received: true });
  } catch (err) {
    next(err);
  }
}
