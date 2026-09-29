import { Link } from "react-router-dom";

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
    detail: "50 questions \u2022 one-time access",
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
    detail: "75 questions \u2022 one-time access",
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
];

const COMPARE_ROWS = [
  ["Questions", "5", "50", "75"],
  ["Access period", "3 days", "Lifetime", "Lifetime"],
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
    a: "No. Kno U Kno uses one-time pricing. Pay once and access your questions forever.",
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
  return (
    <div>
      <section className="hero hero-light">
        <h1>Simple, One-Time Pricing</h1>
        <p>Pay once. Access forever. No subscriptions, no renewals.</p>
        <div className="trust-row">
          <span>&#128179; One-time payment</span>
          <span>&#8635; 7-day refund guarantee</span>
          <span>&#128737; Secure checkout</span>
        </div>
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
            <Link
              to="/register"
              className={`btn ${p.featured ? "btn-primary" : "btn-outline"} btn-block`}
            >
              {p.cta}
            </Link>
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
