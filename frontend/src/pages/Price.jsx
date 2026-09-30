import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

const PLANS = [
  {
    key: "free",
    icon: "\u2728",
    label: "Free Tier",
    price: "$0",
    original: null,
    discount: null,
    detail: "5 questions \u2022 3-day access",
    features: ["5 questions", "Save page access", "Print page access"],
    cta: "Start Free Trial",
  },
  {
    key: "member",
    icon: "\u2B50",
    label: "Members Tier",
    price: "$39.00",
    original: "$49.00",
    discount: "20% off (Save $10.00)",
    detail: "50 questions \u2022 billed monthly",
    features: [
      "50 questions",
      "Print page access",
      "Save page access",
      "Grade page access",
      "Rated page access",
      "Average page access",
    ],
    cta: "Buy Members Tier",
    featured: true,
  },
  {
    key: "pro",
    icon: "\u{1F680}",
    label: "Pro Tier",
    price: "$436.00",
    original: "$675.00",
    discount: "35% off (Save $235.00)",
    detail: "75 questions \u2022 billed yearly",
    features: [
      "75 questions",
      "Print page access",
      "Save page access",
      "Grade page access",
      "Rated page access",
      "Average page access",
    ],
    cta: "Buy Pro Tier",
  },
  {
    key: "bonus",
    icon: "\u{1F381}",
    label: "Bonus",
    price: "$100.00",
    original: null,
    discount: null,
    detail: "+100 questions \u2022 one-time add-on",
    features: [
      "+100 questions",
      "Stacks on Member or Pro",
      "Never expires",
      "Buy again any time",
    ],
    cta: "Add Bonus Questions",
    addOn: true,
  },
];

const COMPARE_ROWS = [
  ["Questions", "5", "50", "75"],
  ["Billing", "3-day trial", "Monthly", "Yearly"],
  ["Save answers", "\u2713", "\u2713", "\u2713"],
  ["Print", "\u2713", "\u2713", "\u2713"],
  ["Grade", "\u2014", "\u2713", "\u2713"],
  ["Rated", "\u2014", "\u2713", "\u2713"],
  ["Average", "\u2014", "\u2713", "\u2713"],
  ["Bonus: 100 questions for $100", "\u2014", "Add-on", "Add-on"],
];

const FAQS = [
  {
    q: "Is this a subscription?",
    a: "Yes. Members bills $39 every month and Pro bills $436 every year. Cancel any time.",
  },
  {
    q: "What happens after the free trial?",
    a: "After 3 days, free trial access expires. Your account remains and you can upgrade to continue.",
  },
  {
    q: "Can I get a refund?",
    a: "We offer a 7-day money-back guarantee if you are not satisfied. Contact us with your purchase email.",
  },
  {
    q: "How do I access my questions?",
    a: "Once registered and logged in, go to your Dashboard. Questions unlock based on your plan immediately after payment.",
  },
];

export default function Price() {
  const { token, user, setUser } = useAuth();
  const navigate = useNavigate();
  const [pendingKey, setPendingKey] = useState(null);
  const [error, setError] = useState("");

  async function handleBuy(planKey) {
    setError("");
    setPendingKey(planKey);
    try {
      const data = await api.upgradePlan(token, planKey);
      setUser(data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setPendingKey(null);
    }
  }

  return (
    <div>
      <section className="hero hero-light">
        <h1>Simple, Straightforward Pricing</h1>
        <p>Monthly or yearly billing. Cancel any time.</p>
        <div className="trust-row">
          <span>&#128179; Cancel any time</span>
          <span>&#8635; 7-day refund guarantee</span>
          <span>&#128737; Secure checkout</span>
        </div>
        {error && <p className="error-text" style={{ maxWidth: 420, margin: "16px auto 0" }}>{error}</p>}
      </section>

      <div className="price-grid container">
        {PLANS.map((p) => (
          <div className={`price-card ${p.featured ? "featured" : ""}`} key={p.key}>
            {p.featured && <span className="price-badge">Most popular</span>}
            <div className="price-icon">{p.icon}</div>
            <h3>{p.label}</h3>
            <div className="amount">
              {p.price}
              {p.original && <span className="original-price">{p.original}</span>}
            </div>
            {p.discount && <div className="discount-badge">{p.discount}</div>}
            <div className="plan-tagline">{p.detail}</div>
            <ul>
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            {p.addOn && token && user && user.plan === "free" ? (
              <button className="btn btn-outline btn-block" disabled>
                Upgrade to Member or Pro first
              </button>
            ) : p.key !== "free" && !p.addOn && user && user.plan === p.key ? (
              <button className="btn btn-outline btn-block" disabled>
                Current plan
              </button>
            ) : p.key !== "free" && token ? (
              <button
                className={`btn ${p.featured ? "btn-primary" : "btn-outline"} btn-block`}
                onClick={() => handleBuy(p.key)}
                disabled={pendingKey === p.key}
              >
                {pendingKey === p.key ? "Processing..." : p.cta}
              </button>
            ) : (
              <Link
                to="/register"
                className={`btn ${p.featured ? "btn-primary" : "btn-outline"} btn-block`}
              >
                {p.cta}
              </Link>
            )}
          </div>
        ))}
      </div>

      <section className="section-tight container">
        <div className="compare-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Free</th>
                <th>Members</th>
                <th>Pro</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => (
                    <td key={i}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="faq-list">
          {FAQS.map((f) => (
            <details className="faq-item" key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
