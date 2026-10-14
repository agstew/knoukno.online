// Plan definitions mirroring the knoukno.net pricing model
export const PLANS = {
  free: {
    key: "free",
    label: "Free",
    price: 0,
    questionQuota: 5,
    trialDays: 3,
    billingPeriod: null,
  },
  member: {
    key: "member",
    label: "Member",
    price: 39,
    questionQuota: 50,
    billingPeriod: "month",
  },
  pro: {
    key: "pro",
    label: "Pro",
    price: 436,
    questionQuota: 75,
    billingPeriod: "year",
  },
  bonus: {
    key: "bonus",
    label: "Bonus",
    price: 100,
    questionQuota: 100,
    billingPeriod: null,
  },
};

const PAYPAL_PLAN_ID_ENV = { member: "PAYPAL_MEMBER_PLAN_ID", pro: "PAYPAL_PRO_PLAN_ID" };

// Read at call time (not module load) so env vars set after import still apply.
export function getPaypalPlanId(key) {
  const envName = PAYPAL_PLAN_ID_ENV[key];
  return (envName && process.env[envName]) || null;
}

export function getPlan(key) {
  return PLANS[key] || PLANS.free;
}

export function serializePlans() {
  return Object.values(PLANS).map((p) => ({ ...p, paypalPlanId: getPaypalPlanId(p.key) }));
}
