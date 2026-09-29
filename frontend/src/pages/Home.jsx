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

export default function Home() {
  return (
    <div>
      <section className="hero">
        <h1>
          Kno U Kno. <span className="accent">Know you know.</span>
        </h1>
        <p>
          We show you how to start a business - from the basics all the way to the finish. Law,
          location, hiring, and the people who come to your business. We ask the questions. You
          write the answers, and we keep every one of them.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary">
            Start free - 5 questions
          </Link>
          <Link to="/price" className="btn btn-outline">
            See the price
          </Link>
        </div>
      </section>

      <div className="stage-grid container">
        {STAGES.map((s) => (
          <div className="stage-card" key={s.key}>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </div>
        ))}
      </div>

      <section className="hero" style={{ paddingTop: 20 }}>
        <h2>The question is ours. The answer is yours.</h2>
        <p>
          Every answer is stored under your business title. Grade each one A to F, rank them so the
          strongest sits at number one, and print the whole set when you're done.
        </p>
      </section>
    </div>
  );
}
