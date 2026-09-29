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

export function getPlan(key) {
  return PLANS[key] || PLANS.free;
}
