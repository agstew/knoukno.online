import { Link } from "react-router-dom";

const DIFFERENTIATORS = [
  {
    title: "No multiple choice",
    body: "Our questions require real written answers - forcing you to articulate what you actually know, not guess what sounds right.",
  },
  {
    title: "Real scenarios",
    body: "Every question is grounded in a realistic business situation with a concrete example so you can apply it to your own context.",
  },
  {
    title: "Self-graded",
    body: "You grade yourself. Our goal is honest self-assessment, not judgment. The only person who benefits from inflating your score is a competitor.",
  },
  {
    title: "Progression tracking",
    body: "Come back, improve your answers, see your scores rise over time as your business education deepens.",
  },
];

const AREAS = [
  {
    icon: "\u{1F680}",
    title: "Starting Your Business",
    body: "Validation, legal structure, pricing, operational setup, vendor relationships",
  },
  {
    icon: "\u2699\uFE0F",
    title: "Managing Operations",
    body: "SOPs, quality control, technology, scaling, customer service",
  },
  {
    icon: "\u{1F4B0}",
    title: "Business Finances",
    body: "Cash flow, accounting, financing, budgeting, financial modeling",
  },
  {
    icon: "\u{1F465}",
    title: "Employee Management",
    body: "Compensation, performance, culture, hiring, onboarding",
  },
  {
    icon: "\u{1F4C8}",
    title: "Business Growth",
    body: "Scaling, expansion, sales pipelines, market entry strategy",
  },
];

const PLANS = [
  { name: "Free Trial (3 days)", body: "Access 5 foundational questions to experience the platform." },
  { name: "Members ($39)", body: "Unlock 50 questions across all business categories. One-time payment." },
  { name: "Pro ($436)", body: "Full access to all 75 questions - our complete business knowledge curriculum. One-time payment." },
];

export default function About() {
  return (
    <div>
      <section className="hero hero-light">
        <h1>About Kno U Kno</h1>
        <p>Business intelligence through deep self-examination.</p>
      </section>

      <section className="section">
        <div className="section-header" style={{ textAlign: "left", margin: "0 auto 40px" }}>
          <h2>Our Mission</h2>
          <p>
            Most business owners fail not because they lack ambition, but because they don't know what they
            don't know. Kno U Kno is designed to change that. We present the real questions - the ones
            experienced operators ask - so you can honestly assess your knowledge, identify gaps, and fill them
            before they cost you your business.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: "var(--gray-light)" }}>
        <div className="section-header">
          <h2>What Makes Kno U Kno Different</h2>
        </div>
        <div className="steps-grid container">
          {DIFFERENTIATORS.map((d) => (
            <div className="step-card" key={d.title} style={{ textAlign: "left" }}>
              <h4>{d.title}</h4>
              <p>{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>The Five Business Areas</h2>
        </div>
        <div className="stage-grid container">
          {AREAS.map((a) => (
            <div className="stage-card" key={a.title}>
              <div className="stage-number" style={{ background: "none", fontSize: 28 }}>
                {a.icon}
              </div>
              <h3>{a.title}</h3>
              <p>{a.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{ background: "var(--gray-light)" }}>
        <div className="section-header">
          <h2>Our Plans</h2>
        </div>
        <div className="steps-grid container">
          {PLANS.map((p) => (
            <div className="step-card" key={p.name} style={{ textAlign: "left" }}>
              <h4>{p.name}</h4>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="cta-banner">
        <Link to="/register" className="btn btn-primary btn-lg">
          Start Your Free Trial
        </Link>
      </div>
    </div>
  );
}
