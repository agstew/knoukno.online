import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "../app.js";
import User from "../models/User.js";
import { registerUser } from "./helpers.js";

vi.mock("../utils/paypal.js", () => ({
  createOrder: vi.fn(),
  captureOrder: vi.fn(),
  getSubscription: vi.fn(),
  getSubscriptionTransactions: vi.fn(),
  cancelSubscription: vi.fn(),
  verifyWebhookSignature: vi.fn(),
}));

import {
  cancelSubscription,
  captureOrder,
  createOrder,
  getSubscription,
  getSubscriptionTransactions,
  verifyWebhookSignature,
} from "../utils/paypal.js";

beforeEach(() => {
  vi.clearAllMocks();
  process.env.PAYPAL_MEMBER_PLAN_ID = "P-MEMBER-TEST";
  process.env.PAYPAL_PRO_PLAN_ID = "P-PRO-TEST";
});

describe("POST /api/billing/paypal/bonus-order", () => {
  it("creates a PayPal order for the bonus price", async () => {
    const { token } = await registerUser();
    createOrder.mockResolvedValue({ id: "ORDER-1" });

    const res = await request(app)
      .post("/api/billing/paypal/bonus-order")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(201);
    expect(res.body.id).toBe("ORDER-1");
    expect(createOrder).toHaveBeenCalledWith(expect.objectContaining({ amount: 100 }));
  });

  it("requires authentication", async () => {
    const res = await request(app).post("/api/billing/paypal/bonus-order");
    expect(res.status).toBe(401);
  });
});

describe("POST /api/billing/paypal/bonus-order/:orderId/capture", () => {
  it("grants bonus questions when payment is completed", async () => {
    const { token, user } = await registerUser();
    captureOrder.mockResolvedValue({ status: "COMPLETED" });

    const res = await request(app)
      .post("/api/billing/paypal/bonus-order/ORDER-1/capture")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.questionsQuota).toBe(5 + 100);
    expect(captureOrder).toHaveBeenCalledWith("ORDER-1");

    const updated = await User.findById(user._id);
    expect(updated.questionsQuota).toBe(105);
  });

  it("rejects a payment that was not completed", async () => {
    const { token } = await registerUser();
    captureOrder.mockResolvedValue({ status: "DECLINED" });

    const res = await request(app)
      .post("/api/billing/paypal/bonus-order/ORDER-1/capture")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(402);
  });
});

describe("POST /api/billing/paypal/subscriptions/confirm", () => {
  it("activates the member plan when the subscription is active and matches", async () => {
    const { token } = await registerUser();
    getSubscription.mockResolvedValue({
      status: "ACTIVE",
      plan_id: "P-MEMBER-TEST",
      billing_info: { next_billing_time: "2026-11-13T00:00:00Z" },
    });

    const res = await request(app)
      .post("/api/billing/paypal/subscriptions/confirm")
      .set("Authorization", `Bearer ${token}`)
      .send({ plan: "member", subscriptionID: "SUB-1" });
    expect(res.status).toBe(200);
    expect(res.body.user.plan).toBe("member");
    expect(res.body.user.questionsQuota).toBe(50);
  });

  it("rejects a subscription for a different plan_id", async () => {
    const { token } = await registerUser();
    getSubscription.mockResolvedValue({ status: "ACTIVE", plan_id: "P-OTHER" });

    const res = await request(app)
      .post("/api/billing/paypal/subscriptions/confirm")
      .set("Authorization", `Bearer ${token}`)
      .send({ plan: "member", subscriptionID: "SUB-1" });
    expect(res.status).toBe(400);
  });

  it("rejects a subscription that isn't active", async () => {
    const { token } = await registerUser();
    getSubscription.mockResolvedValue({ status: "APPROVAL_PENDING", plan_id: "P-MEMBER-TEST" });

    const res = await request(app)
      .post("/api/billing/paypal/subscriptions/confirm")
      .set("Authorization", `Bearer ${token}`)
      .send({ plan: "member", subscriptionID: "SUB-1" });
    expect(res.status).toBe(402);
  });

  it("rejects an unknown plan", async () => {
    const { token } = await registerUser();
    const res = await request(app)
      .post("/api/billing/paypal/subscriptions/confirm")
      .set("Authorization", `Bearer ${token}`)
      .send({ plan: "ultra", subscriptionID: "SUB-1" });
    expect(res.status).toBe(400);
  });
});

describe("POST /api/billing/paypal/subscriptions/cancel", () => {
  it("stops future billing but keeps access until the period ends", async () => {
    const { token, user } = await registerUser();
    const future = new Date(Date.now() + 1000 * 60 * 60 * 24 * 10);
    await User.updateOne(
      { _id: user._id },
      { paypalSubscriptionId: "SUB-1", plan: "member", planRenewsAt: future }
    );
    cancelSubscription.mockResolvedValue();

    const res = await request(app)
      .post("/api/billing/paypal/subscriptions/cancel")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.plan).toBe("member");
    expect(res.body.user.cancelAtPeriodEnd).toBe(true);
    expect(cancelSubscription).toHaveBeenCalledWith("SUB-1");
  });

  it("rejects when there is no active subscription", async () => {
    const { token } = await registerUser();
    const res = await request(app)
      .post("/api/billing/paypal/subscriptions/cancel")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
  });
});

describe("Lazy downgrade after a cancelled subscription's period ends", () => {
  it("downgrades to free once planRenewsAt has passed", async () => {
    const { token, user } = await registerUser();
    const past = new Date(Date.now() - 1000 * 60 * 60);
    await User.updateOne(
      { _id: user._id },
      { plan: "member", questionsQuota: 50, cancelAtPeriodEnd: true, planRenewsAt: past, paypalSubscriptionId: "SUB-1" }
    );

    const res = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.plan).toBe("free");
    expect(res.body.user.cancelAtPeriodEnd).toBe(false);
  });

  it("keeps access while the period hasn't ended yet", async () => {
    const { token, user } = await registerUser();
    const future = new Date(Date.now() + 1000 * 60 * 60);
    await User.updateOne(
      { _id: user._id },
      { plan: "member", questionsQuota: 50, cancelAtPeriodEnd: true, planRenewsAt: future, paypalSubscriptionId: "SUB-1" }
    );

    const res = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.plan).toBe("member");
  });
});

describe("POST /api/billing/paypal/webhook", () => {
  it("rejects an invalid signature", async () => {
    verifyWebhookSignature.mockResolvedValue(false);
    const res = await request(app)
      .post("/api/billing/paypal/webhook")
      .send({ event_type: "PAYMENT.SALE.COMPLETED", resource: {} });
    expect(res.status).toBe(400);
  });

  it("renews quota on a completed recurring payment", async () => {
    const { user } = await registerUser();
    await User.updateOne(
      { _id: user._id },
      { paypalSubscriptionId: "SUB-1", plan: "member", questionsUsed: 40 }
    );
    verifyWebhookSignature.mockResolvedValue(true);

    const res = await request(app)
      .post("/api/billing/paypal/webhook")
      .send({ event_type: "PAYMENT.SALE.COMPLETED", resource: { billing_agreement_id: "SUB-1" } });
    expect(res.status).toBe(200);

    const updated = await User.findById(user._id);
    expect(updated.questionsUsed).toBe(0);
  });

  it("marks cancelAtPeriodEnd without changing plan immediately on cancellation", async () => {
    const { user } = await registerUser();
    await User.updateOne({ _id: user._id }, { paypalSubscriptionId: "SUB-1", plan: "pro" });
    verifyWebhookSignature.mockResolvedValue(true);

    const res = await request(app)
      .post("/api/billing/paypal/webhook")
      .send({ event_type: "BILLING.SUBSCRIPTION.CANCELLED", resource: { id: "SUB-1" } });
    expect(res.status).toBe(200);

    const updated = await User.findById(user._id);
    expect(updated.plan).toBe("pro");
    expect(updated.cancelAtPeriodEnd).toBe(true);
  });

  it("downgrades to free immediately when a subscription is suspended", async () => {
    const { user } = await registerUser();
    await User.updateOne({ _id: user._id }, { paypalSubscriptionId: "SUB-1", plan: "pro" });
    verifyWebhookSignature.mockResolvedValue(true);

    const res = await request(app)
      .post("/api/billing/paypal/webhook")
      .send({ event_type: "BILLING.SUBSCRIPTION.SUSPENDED", resource: { id: "SUB-1" } });
    expect(res.status).toBe(200);

    const updated = await User.findById(user._id);
    expect(updated.plan).toBe("free");
    expect(updated.paypalSubscriptionId).toBeFalsy();
  });
});

describe("GET /api/billing/paypal/schedule", () => {
  it("returns no subscription for a user without one", async () => {
    const { token } = await registerUser();
    const res = await request(app)
      .get("/api/billing/paypal/schedule")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.subscription).toBeNull();
    expect(res.body.transactions).toEqual([]);
  });

  it("returns subscription summary and transaction history", async () => {
    const { token, user } = await registerUser();
    await User.updateOne({ _id: user._id }, { paypalSubscriptionId: "SUB-1", plan: "member" });
    getSubscription.mockResolvedValue({
      status: "ACTIVE",
      create_time: "2026-01-01T00:00:00Z",
      billing_info: {
        next_billing_time: "2026-11-13T00:00:00Z",
        last_payment: { amount: { value: "39.00", currency_code: "USD" }, time: "2026-10-13T00:00:00Z" },
      },
    });
    getSubscriptionTransactions.mockResolvedValue({
      transactions: [
        {
          id: "TXN-1",
          status: "COMPLETED",
          amount_with_breakdown: { gross_amount: { value: "39.00", currency_code: "USD" } },
          time: "2026-10-13T00:00:00Z",
        },
      ],
    });

    const res = await request(app)
      .get("/api/billing/paypal/schedule")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.subscription.plan).toBe("member");
    expect(res.body.subscription.status).toBe("ACTIVE");
    expect(res.body.subscription.nextBillingTime).toBe("2026-11-13T00:00:00Z");
    expect(res.body.transactions).toHaveLength(1);
    expect(res.body.transactions[0].id).toBe("TXN-1");
  });

  it("still returns the subscription summary if transaction history fails", async () => {
    const { token, user } = await registerUser();
    await User.updateOne({ _id: user._id }, { paypalSubscriptionId: "SUB-1", plan: "pro" });
    getSubscription.mockResolvedValue({ status: "ACTIVE", billing_info: {} });
    getSubscriptionTransactions.mockRejectedValue(new Error("boom"));

    const res = await request(app)
      .get("/api/billing/paypal/schedule")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.subscription.status).toBe("ACTIVE");
    expect(res.body.transactions).toEqual([]);
  });

  it("requires authentication", async () => {
    const res = await request(app).get("/api/billing/paypal/schedule");
    expect(res.status).toBe(401);
  });
});
