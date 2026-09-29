import { Link } from "react-router-dom";
import imgAnswers from "../assets/stages/section-answers.svg";
import imgHiring from "../assets/stages/section-hiring.svg";
import imgLaw from "../assets/stages/section-law.svg";
import imgLocation from "../assets/stages/section-location.svg";
import imgPeople from "../assets/stages/section-people.svg";
import imgStart from "../assets/stages/section-start.svg";

const FEATURE_ROWS = [
  {
    id: "start",
    eyebrow: "Know you know",
    title: "Start a business from the very first step",
    paragraphs: [
      "Kno U Kno shows you how to start a business from the basics all the way to the finish. You get the questions in the order a real business needs them answered, and you write the answers yourself.",
      "Start with law. Then find your place, work out who to hire, and get to know the people who will come to your business.",
      "Your answers stay with you. Return to grade, rank, and print them whenever you need to make your next decision.",
    ],
    image: imgStart,
    alt: "A founder writing the first plan for a new business",
  },
  {
    id: "law",
    eyebrow: "Stage one",
    title: "Law first, so the business is real",
    paragraphs: [
      "Choose the entity, register the name, get the tax ID, and find out which licences and permits your trade and your city require.",
    ],
    image: imgLaw,
    alt: "Business formation paperwork on a desk",
  },
  {
    id: "location",
    eyebrow: "Stage two",
    title: "The best place to put a business",
    paragraphs: ["Location decides who finds you. Work through rent, zoning, traffic, and your second choice before you commit."],
    image: imgLocation,
    alt: "A storefront on a busy street",
  },
  {
    id: "hiring",
    eyebrow: "Stage three",
    title: "What type of person to hire",
    paragraphs: [
      "The first hire sets the standard for everyone who comes after. Define the role, the person, what you can pay, and what success looks like.",
    ],
    image: imgHiring,
    alt: "A small team working together",
  },
  {
    id: "people",
    eyebrow: "Stage four",
    title: "The people who come to your business",
    paragraphs: ["Who are your customers, what brings them to you, how do they find you, and what makes them come back?"],
    image: imgPeople,
    alt: "Customers being served at a counter",
  },
  {
    id: "answers",
    eyebrow: "How it works",
    title: "The question is ours. The answer is yours.",
    paragraphs: [
      "Your answers are kept under your business title so you can grade, rank, print, and return to them as your business grows.",
      "The result is not a certificate. It is your own thinking, written down and ready to share with a partner, lender, or first employee.",
    ],
    image: imgAnswers,
    alt: "Handwritten answers in a workbook",
  },
];

export default function Home() {
  return (
    <div>
      <section className="hero">
        <span className="eyebrow">knoukno.online</span>
        <h1>
          Kno U Kno
          <br />
          <span className="accent">Know you know.</span>
        </h1>
        <p>
          We show you how to start a business - from the basics all the way to the finish. Law,
          location, hiring, and the people who come to your business. We ask the questions. You
          write the answers, and we keep every one of them.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary btn-lg">
            Start free - 5 questions <span aria-hidden="true">&#8599;</span>
          </Link>
          <Link to="/price" className="btn btn-outline-light btn-lg">
            See the price
          </Link>
        </div>
      </section>

      {FEATURE_ROWS.map((row, i) => (
        <section
          className={`feature-row container ${i % 2 === 1 ? "reverse" : ""}`}
          id={row.id === "law" || row.id === "location" || row.id === "hiring" || row.id === "people" ? row.id : undefined}
          key={row.id}
        >
          <div className="feature-text">
            <span className="section-eyebrow">{row.eyebrow}</span>
            <h2>{row.title}</h2>
            {row.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="feature-image">
            <img src={row.image} alt={row.alt} />
          </div>
        </section>
      ))}

      <div className="cta-banner">
        <span className="section-eyebrow" style={{ color: "var(--dodger-blue)" }}>
          Everyone starts somewhere
        </span>
        <h2>Name your business and answer the first question</h2>
        <p>
          Register and start with five questions, free for three days. No card required until you
          decide to keep going.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary btn-lg">
            Register free
          </Link>
          <Link to="/price" className="btn btn-outline-light btn-lg">
            See the price
          </Link>
        </div>
      </div>
    </div>
  );
}
