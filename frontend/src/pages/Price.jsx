import { Link } from "react-router-dom";

const PLANS = [
  {
    key: "free",
    label: "Free",
    price: "$0",
    period: null,
    tagline: "Try the first stage, on us.",
    features: ["5 questions", "3-day trial", "1 business", "No card required"],
  },
  {
    key: "member",
    label: "Member",
    price: "$39",
    period: "/ month",
    tagline: "For working through a full plan.",
    features: [
      "50 questions / month",
      "All 4 stages: Law, Location, Hiring, People",
      "Grade, rank, and print",
      "Cancel any time",
    ],
    featured: true,
  },
  {
    key: "pro",
    label: "Pro",
    price: "$436",
    period: "/ year",
    tagline: "Best value for the full year.",
    features: [
      "75 questions / year",
      "Everything in Member",
      "Priority email support",
      "About 27% cheaper than monthly",
    ],
  },
  {
    key: "bonus",
    label: "Bonus",
    price: "$100",
    period: "one-time",
    tagline: "Need more room? Add it once.",
    features: ["+100 questions", "Stacks on any plan", "Never expires", "Buy as many times as you need"],
  },
];

const FAQS = [
  {
    q: "Can I switch plans later?",
    a: "Yes. Upgrade, downgrade, or add a Bonus block whenever your business needs more questions.",
  },
  {
    q: "What counts as a question?",
    a: "Each time you ask KnoUKno for the next question in a stage, it uses one from your quota - regardless of how long your answer is.",
  },
  {
    q: "Is there a refund policy?",
    a: "Email hello@knoukno.online within 7 days of a paid purchase and we'll make it right.",
  },
];

export default function Price() {
  return (
    <div>
      <section className="hero" style={{ paddingBottom: 20 }}>
        <span className="eyebrow">Simple pricing</span>
        <h1>Pick a plan and start writing.</h1>
        <p>
          Every plan gives you the same four stages and the same grading and ranking tools. The
          only difference is how many questions you can ask.
        </p>
      </section>
      <div className="price-grid container">
        {PLANS.map((p) => (
          <div className={`price-card ${p.featured ? "featured" : ""}`} key={p.key}>
            {p.featured && <span className="price-badge">Most popular</span>}
            <h3>{p.label}</h3>
            <div className="amount">
              {p.price} {p.period && <span>{p.period}</span>}
            </div>
            <div className="plan-tagline">{p.tagline}</div>
            <ul>
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <Link
              to="/register"
              className={`btn ${p.featured ? "btn-primary" : "btn-outline"} btn-block`}
            >
              {p.key === "free" ? "Start free" : "Buy Now"}
            </Link>
          </div>
        ))}
      </div>

      <section className="section">
        <div className="section-header">
          <h2>Pricing questions</h2>
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
