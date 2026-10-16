// Thin wrapper around the PayPal REST API (Orders v2 + Subscriptions v1).
// Uses the platform's native fetch - no PayPal SDK dependency required.

function apiBase() {
  return process.env.PAYPAL_MODE === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";
}

async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("PayPal is not configured (missing PAYPAL_CLIENT_ID/PAYPAL_CLIENT_SECRET)");
  }

  const res = await fetch(`${apiBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`PayPal auth failed: ${res.status}`);
  const data = await res.json();
  return data.access_token;
}

async function ppFetch(path, options = {}) {
  const token = await getAccessToken();
  const res = await fetch(`${apiBase()}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || data?.name || `PayPal request failed: ${res.status}`;
    throw new Error(message);
  }
  return data;
}

export async function createOrder({ amount, currency = "USD", description }) {
  return ppFetch("/v2/checkout/orders", {
    method: "POST",
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          description,
          amount: { currency_code: currency, value: amount.toFixed(2) },
        },
      ],
    }),
  });
}

export async function captureOrder(orderId) {
  return ppFetch(`/v2/checkout/orders/${orderId}/capture`, { method: "POST" });
}

export async function getSubscription(subscriptionId) {
  return ppFetch(`/v1/billing/subscriptions/${subscriptionId}`);
}

export async function getSubscriptionTransactions(subscriptionId, startTime, endTime) {
  const params = new URLSearchParams({ start_time: startTime, end_time: endTime });
  return ppFetch(`/v1/billing/subscriptions/${subscriptionId}/transactions?${params.toString()}`);
}

export async function cancelSubscription(subscriptionId, reason = "User requested cancellation") {
  const token = await getAccessToken();
  const res = await fetch(`${apiBase()}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reason }),
  });
  if (!res.ok && res.status !== 204) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || `PayPal cancel failed: ${res.status}`);
  }
}

// Confirms a webhook really came from PayPal using the Verify Webhook Signature API.
export async function verifyWebhookSignature(headers, body) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) throw new Error("PAYPAL_WEBHOOK_ID is not configured");

  const data = await ppFetch("/v1/notifications/verify-webhook-signature", {
    method: "POST",
    body: JSON.stringify({
      auth_algo: headers["paypal-auth-algo"],
      cert_url: headers["paypal-cert-url"],
      transmission_id: headers["paypal-transmission-id"],
      transmission_sig: headers["paypal-transmission-sig"],
      transmission_time: headers["paypal-transmission-time"],
      webhook_id: webhookId,
      webhook_event: body,
    }),
  });
  return data.verification_status === "SUCCESS";
}
