import { Link } from "react-router-dom";

const STAGES = [
  {
    key: "law",
    title: "Law first, so the business is real",
    body:
      "Choose the entity, register the name, get the tax ID, and find out which licences and permits your trade and city require.",
  },
  {
    key: "location",
    title: "The best place to put a business",
    body:
      "Location decides who finds you. Defend the rent against the revenue, the zoning, and your backup plan.",
  },
  {
    key: "hiring",
    title: "What type of person to hire",
    body:
      "The first hire sets the standard for everyone after. Decide what the role covers and how you'll know it worked.",
  },
  {
    key: "people",
    title: "The people who come to your business",
    body:
      "Describe who they are, what problem brings them in, how they find you, and what makes them come back.",
  },
];

const STEPS = [
  {
    title: "Name your business",
    body: "Register free and title the business you're building. That title drives every question that follows.",
  },
  {
    title: "Answer, one question at a time",
    body: "The AI writes each question around your business and asks the same ground a different way each time.",
  },
  {
    title: "Grade and rank your answers",
    body: "Score every answer A to F, rank them so the strongest sits at number one, and track your average.",
  },
  {
    title: "Print your plan",
    body: "Hand the finished, graded, ranked set to a bank, a partner, a landlord, or your first employee.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I had a business plan in my head for two years and never wrote it down. Four stages of questions later, I had it on paper - in my own words.",
    author: "Maria T.",
    role: "Bakery owner",
  },
  {
    quote:
      "The questions kept catching things I hadn't thought about, like what happens to the shop if I'm out sick for a month.",
    author: "Devon R.",
    role: "First-time founder",
  },
  {
    quote:
      "Grading and ranking my own answers forced me to actually commit to a decision instead of leaving it vague.",
    author: "Priya K.",
    role: "Consultant",
  },
];

const FAQS = [
  {
    q: "Do you write the plan for me?",
    a: "No. The question is ours, the answer is yours. We ask, in the order a real business needs it answered, and you write the answer in your own words.",
  },
  {
    q: "What happens after the free trial?",
    a: "Your first 5 questions are free for 3 days with no card required. After that, pick the Member or Pro plan to keep going, or add a Bonus block of extra questions any time.",
  },
  {
    q: "Can I export or print my answers?",
    a: "Yes. Every answer is stored under your business title, and you can print or save the whole graded, ranked set whenever you're ready.",
  },
  {
    q: "Is my data private?",
    a: "Your business titles and answers are tied to your account only. We never sell or share your written answers.",
  },
];

export default function Home() {
  return (
    <div>
      <section className="hero">
        <span className="eyebrow">Know you know</span>
        <h1>
          Start a business from <span className="accent">the very first step</span>.
        </h1>
        <p>
          We show you how to start a business - from the basics all the way to the finish. Law,
          location, hiring, and the people who come to your business. We ask the questions. You
          write the answers, and we keep every one of them.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary btn-lg">
            Start free - 5 questions
          </Link>
          <Link to="/price" className="btn btn-outline btn-lg">
            See the price
          </Link>
        </div>
        <p className="hero-note">No card until you decide to keep going.</p>
      </section>

      <div className="stat-strip container">
        <div className="stat">
          <div className="stat-number">4</div>
          <div className="stat-label">Stages, in order</div>
        </div>
        <div className="stat">
          <div className="stat-number">A-F</div>
          <div className="stat-label">Grade every answer</div>
        </div>
        <div className="stat">
          <div className="stat-number">100%</div>
          <div className="stat-label">Your own words</div>
        </div>
        <div className="stat">
          <div className="stat-number">$0</div>
          <div className="stat-label">To start today</div>
        </div>
      </div>

      <section className="section">
        <div className="section-header">
          <h2>The path is always the same</h2>
          <p>Law first, because until the paperwork is right there is no business to run.</p>
        </div>
        <div className="stage-grid container">
          {STAGES.map((s, i) => (
            <div className="stage-card" key={s.key}>
              <div className="stage-number">{i + 1}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{ background: "var(--gray-light)" }}>
        <div className="section-header">
          <h2>How it works</h2>
          <p>Four simple steps from a blank page to a plan you can hand to someone else.</p>
        </div>
        <div className="steps-grid container">
          {STEPS.map((step, i) => (
            <div className="step-card" key={step.title}>
              <div className="step-circle">{i + 1}</div>
              <h4>{step.title}</h4>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Know you know</h2>
          <p>Real answers from people who used KnoUKno to get their plan out of their head and onto paper.</p>
        </div>
        <div className="testimonial-grid container">
          {TESTIMONIALS.map((t) => (
            <div className="testimonial-card" key={t.author}>
              <div className="stars">★★★★★</div>
              <p className="quote">&ldquo;{t.quote}&rdquo;</p>
              <div className="author">{t.author}</div>
              <div className="role">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Questions, answered</h2>
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

      <div className="cta-banner">
        <h2>Name your business and answer the first question</h2>
        <p>
          Register, write your business title, and the first five questions are written for you
          free for three days. No card until you decide to keep going.
        </p>
        <Link to="/register" className="btn btn-primary btn-lg">
          Register free
        </Link>
      </div>
    </div>
  );
}
