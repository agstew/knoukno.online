import { Link } from "react-router-dom";

const PLANS = [
  { key: "free", label: "Free", price: "$0", detail: "5 questions, 3 days" },
  { key: "member", label: "Member", price: "$39", detail: "50 questions / month", featured: true },
  { key: "pro", label: "Pro", price: "$436", detail: "75 questions / year" },
  { key: "bonus", label: "Bonus", price: "$100", detail: "100 extra questions" },
];

export default function Price() {
  return (
    <div>
      <section className="hero" style={{ paddingBottom: 20 }}>
        <h1>Plans</h1>
        <p>Pick a plan and start writing your business plan, one question at a time.</p>
      </section>
      <div className="price-grid container">
        {PLANS.map((p) => (
          <div className={`price-card ${p.featured ? "featured" : ""}`} key={p.key}>
            <h3>{p.label}</h3>
            <div className="amount">{p.price}</div>
            <p>{p.detail}</p>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", paddingBottom: 60 }}>
        <Link to="/register" className="btn btn-primary">
          Buy Now
        </Link>
      </div>
    </div>
  );
}
