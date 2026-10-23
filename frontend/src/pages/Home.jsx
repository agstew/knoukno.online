import { useState } from "react";
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
    title: "Start a business from the very first step - no guesswork",
    paragraphs: [
      "Most businesses don't fail from a lack of ambition. They fail from the questions nobody thought to ask. Kno U Kno hands you the real checklist - in the exact order a real business needs it answered - and makes you write the answer yourself.",
      "Start with the law. Then lock in your location, decide who to hire first, and learn who your customers really are.",
      "Every answer you write stays with you - graded, ranked, and ready to print the moment you need to make your next move.",
    ],
    image: imgStart,
    alt: "A founder writing the first plan for a new business",
  },
  {
    id: "law",
    eyebrow: "Stage one",
    title: "Get the law right before you spend a dollar",
    paragraphs: [
      "Pick the right entity, register your name, lock down your tax ID, and find every licence and permit your trade and city actually require - before a mistake here costs you later.",
    ],
    image: imgLaw,
    alt: "Business formation paperwork on a desk",
  },
  {
    id: "location",
    eyebrow: "Stage two",
    title: "The address that makes or breaks you",
    paragraphs: ["Your location decides who walks in the door. Work through rent, zoning, foot traffic, and your backup plan before you sign a lease you can't undo."],
    image: imgLocation,
    alt: "A storefront on a busy street",
  },
  {
    id: "hiring",
    eyebrow: "Stage three",
    title: "Your first hire sets the bar for every hire after",
    paragraphs: [
      "Define the role, the person, the pay, and what success actually looks like - before you hand someone the keys to your business.",
    ],
    image: imgHiring,
    alt: "A small team working together",
  },
  {
    id: "people",
    eyebrow: "Stage four",
    title: "Know your customer before they ever walk in",
    paragraphs: ["Who are they, why do they choose you, how do they find you, and what brings them back? Answer this now - not after you've already spent your marketing budget guessing."],
    image: imgPeople,
    alt: "Customers being served at a counter",
  },
  {
    id: "answers",
    eyebrow: "How it works",
    title: "We ask the hard question. You own the answer.",
    paragraphs: [
      "Every answer is saved under your business, graded, ranked, and printable - a living plan, not a one-time quiz.",
      "It's not a certificate. It's proof you've already thought through what most founders only find out the hard way.",
    ],
    image: imgAnswers,
    alt: "Handwritten answers in a workbook",
  },
];

export default function Home() {
  const [tryAnswer, setTryAnswer] = useState("");

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
          Every founder has the same blind spots - the questions nobody hands you until it's too late.
          Kno U Kno puts them in front of you first: Law, Location, Hiring, and the People who come to
          your business. We ask the real questions. You write the real answers. We keep every one of them.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary btn-lg">
            Start your free 3-day trial <span aria-hidden="true">&#8599;</span>
          </Link>
          <Link to="/price" className="btn btn-outline-light btn-lg">
            See the price
          </Link>
        </div>
      </section>

      <section className="container" style={{ padding: "56px 0" }}>
        <div className="section-header" style={{ textAlign: "left", marginBottom: 24 }}>
          <span className="section-eyebrow">Try it yourself</span>
          <h2>See exactly what you'd be asked - right now</h2>
          <p className="muted">No account needed to try it. Write a real answer below - it just won't be saved until you register.</p>
        </div>
        <div className="question-card">
          <span className="question-index">Question 1 &middot; Law</span>
          <p className="question-text">
            For your business, which legal entity are you registering as, and why is that the right structure?
          </p>
          <p className="question-example">
            <strong>Example:</strong> Rivertown Coffee Co. is registering as a single-member LLC. It keeps my
            personal assets separate from the business, costs little to maintain in my state, and still lets
            me file taxes as a sole proprietor until the business is big enough to need a different structure.
          </p>
          <textarea
            rows={4}
            placeholder="Write your answer in your own words..."
            value={tryAnswer}
            onChange={(e) => setTryAnswer(e.target.value)}
            style={{
              width: "100%",
              padding: "11px 14px",
              border: "1.5px solid var(--gray-border)",
              borderRadius: "var(--radius-sm)",
              fontSize: 15,
              fontFamily: "inherit",
              marginTop: 12,
            }}
          />
          <Link to="/register" className="btn btn-primary" style={{ marginTop: 14, display: "inline-block" }}>
            {tryAnswer.trim() ? "Create an account to save this answer" : "Register free to answer for real"}
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
        <h2>Stop guessing. Start writing the answers that matter.</h2>
        <p>
          Five real questions, free for three days, no card required. Name your business today and
          find out exactly what you don't know yet - before it costs you real money.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary btn-lg">
            Start free now
          </Link>
          <Link to="/price" className="btn btn-outline-light btn-lg">
            See the price
          </Link>
        </div>
      </div>
    </div>
  );
}
