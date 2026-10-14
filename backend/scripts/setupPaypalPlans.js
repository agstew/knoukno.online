// One-time setup script: creates a PayPal Product + two Billing Plans
// (Member $39/month, Pro $436/year) and prints the resulting Plan IDs.
//
// Run locally once with your PayPal credentials in the environment:
//   PAYPAL_CLIENT_ID=... PAYPAL_CLIENT_SECRET=... PAYPAL_MODE=live node scripts/setupPaypalPlans.js
//
// Then copy the printed PAYPAL_MEMBER_PLAN_ID / PAYPAL_PRO_PLAN_ID values into
// your Railway service variables (and your local .env for testing).

function apiBase() {
  return process.env.PAYPAL_MODE === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";
}

async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in your environment first");
  }
  const res = await fetch(`${apiBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`PayPal auth failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.access_token;
}

async function ppPost(token, path, body) {
  const res = await fetch(`${apiBase()}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${path} failed: ${res.status} ${JSON.stringify(data)}`);
  return data;
}

async function main() {
  const token = await getAccessToken();

  const product = await ppPost(token, "/v1/catalogs/products", {
    name: "KnoUKno subscription",
    description: "KnoUKno business-planning question access",
    type: "SERVICE",
    category: "SOFTWARE",
  });
  console.log(`Created product: ${product.id}`);

  const memberPlan = await ppPost(token, "/v1/billing/plans", {
    product_id: product.id,
    name: "Member",
    description: "50 questions, billed monthly",
    billing_cycles: [
      {
        frequency: { interval_unit: "MONTH", interval_count: 1 },
        tenure_type: "REGULAR",
        sequence: 1,
        total_cycles: 0,
        pricing_scheme: { fixed_price: { value: "39.00", currency_code: "USD" } },
      },
    ],
    payment_preferences: { auto_bill_outstanding: true, payment_failure_threshold: 2 },
  });
  console.log(`Created Member plan: ${memberPlan.id}`);

  const proPlan = await ppPost(token, "/v1/billing/plans", {
    product_id: product.id,
    name: "Pro",
    description: "75 questions, billed yearly",
    billing_cycles: [
      {
        frequency: { interval_unit: "YEAR", interval_count: 1 },
        tenure_type: "REGULAR",
        sequence: 1,
        total_cycles: 0,
        pricing_scheme: { fixed_price: { value: "436.00", currency_code: "USD" } },
      },
    ],
    payment_preferences: { auto_bill_outstanding: true, payment_failure_threshold: 2 },
  });
  console.log(`Created Pro plan: ${proPlan.id}`);

  console.log("\nSet these in Railway (and your local .env):");
  console.log(`PAYPAL_MEMBER_PLAN_ID=${memberPlan.id}`);
  console.log(`PAYPAL_PRO_PLAN_ID=${proPlan.id}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
