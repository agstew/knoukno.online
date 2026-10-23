# KnoUKno.online — Investor Pitch Kit

A ready-to-use pitch package for raising money (angel/pre-seed) while keeping ownership, built with
zero marketing budget in mind. Fill in the `[ ]` placeholders with your real numbers before sending
anything out — never pitch numbers you can't back up.

---

## 1. One-liner

> KnoUKno.online turns "I don't know what I don't know" into a written, graded business plan —
> one real question at a time, across Law, Location, Hiring, and People.

## 2. The problem

Most small businesses fail not from lack of ambition but from unknown unknowns: founders skip steps
(entity type, permits, location math, first hire, customer definition) because no one hands them the
actual checklist of *questions experienced operators already know to ask*. Generic templates and
static checklists don't force a founder to write a real, specific answer — so the gaps stay hidden
until they're expensive.

## 3. The solution

KnoUKno is a guided, question-driven business planning app:
- Founder names their business, then answers real open-ended questions (no multiple choice) across
  4 stages: **Law → Location → Hiring → People**.
- Every answer is saved under that business, **self-graded A–F**, ranked, and printable — so it
  becomes a living plan, not a one-time quiz.
- The product is live today at **knoukno.online** (React + Node/Express + MongoDB, deployed on
  Railway) — this isn't a mockup, it's a working, shippable SaaS.

## 4. Business model (already built and wired to payments)

| Plan   | Price            | What you get                  |
|--------|------------------|--------------------------------|
| Free   | $0               | 5 questions, 3-day trial       |
| Member | $39/month        | 50 questions/month             |
| Pro    | $436/year        | 75 questions/year              |
| Bonus  | $100 one-time    | +100 questions                 |

Payments run through PayPal subscriptions (already integrated in `backend/src/controllers/billingController.js`).
This is a direct-to-consumer subscription SaaS — no sales team required to generate first revenue.

## 5. Why now / market

- Record numbers of new business formations post-2020 (U.S. Census BFS data — cite the latest figure
  you pull: `[ ADD current annual new-business-application number ]`).
- First-time founders overwhelmingly rely on fragmented free content (blog posts, YouTube) instead of
  a structured, accountable path — there's no dominant "Duolingo for starting a business."
- Low infrastructure cost (Node/Mongo/Railway stack) keeps gross margins high for a subscription model.

## 6. Traction (pulled live from production DB on 2026-10-20 — update before every outreach)

- Registered users: **1** (that's the founder's own account — no external users yet)
- Paying customers / MRR: **$0 — pre-revenue**
- Businesses created: **2** · Answers written: **4** · Question bank size: **131 questions live**
- Grades/ratings recorded: **4** each (same test data, not external usage)
- Qualitative: none yet — no outside users have tried it.

Honest framing for pitches right now: this is a **pre-launch / pre-traction** product — fully built,
live, and payment-ready, but not yet tested with real outside users. Say it plainly: *"The product
and billing are live; I haven't done user acquisition yet — that's exactly what this round funds."*
Investors fund this stage too (pure pre-seed), but it changes who you pitch (angels/friends/family
and accelerators, not traction-focused seed funds) and strengthens the case for running the free-trial
push in section 10 **before** any serious investor outreach — even 10–20 real users this week moves
this section from "0" to real numbers and meaningfully changes the conversation.

## 7. The ask

- Raising: `[ $ amount, e.g. $25k–$75k pre-seed ]`
- Use of funds: `[ e.g. 40% paid acquisition test, 30% content/SEO, 20% runway, 10% infra ]`
- Structure: `[ SAFE / convertible note — most pre-seed angel money uses a YC-style SAFE ]`

---

## 8. Elevator pitches

**10-second version:**
> "KnoUKno is Duolingo for starting a business — real questions, written answers, graded and
> tracked, across law, location, hiring, and customers."

**30-second version:**
> "Most founders fail from unknown unknowns, not lack of ambition. KnoUKno asks the real questions
> experienced operators already know to ask — law, location, hiring, customers — founders write real
> answers, we grade and track them, and it becomes their actual business plan. It's live today,
> subscription-based, already wired up to PayPal billing."

**2-minute version (for a warm intro call):**
> "I built KnoUKno because most 'business plan' tools are either a blank template or multiple-choice
> quizzes that don't force you to actually think. KnoUKno walks a founder through four stages — Law,
> Location, Hiring, People — with real open-ended questions and worked examples. They write their own
> answer, grade themselves, and can come back and improve it as the business grows — so the output
> isn't a certificate, it's their own thinking, written down, ready to show a partner or a lender.
> It's a full working product today — React frontend, Node/Mongo backend, deployed on Railway,
> subscription billing already live through PayPal. I'm raising `[amount]` to `[main use of funds]`."

---

## 9. Cold outreach email template (investors)

Subject: `Pre-seed: KnoUKno — Duolingo for starting a business`

> Hi [Name],
>
> I'm building KnoUKno (knoukno.online) — a guided business-planning app that replaces vague
> templates with real, graded, written-answer questions across Law, Location, Hiring, and Customers.
> It's live, subscription-based ($39/mo, $436/yr), and already has working PayPal billing.
>
> [1–2 lines of real traction or "I'm pre-revenue, validating with early users" — be honest]
>
> I'm raising [$amount] on a SAFE to [main use of funds]. Would you be open to a 15-minute call this
> week? Happy to send the live product link so you can try the first question yourself.
>
> [Your name]
> [Link to knoukno.online] · [LinkedIn/Twitter]

Keep it under 120 words. Always link the *live* product — letting them try the free first question
themselves does more convincing than any deck.

---

## 10. Zero-cost / low-cost ways to actually reach investors and customers with no budget

**Investors:**
- Warm intros first — ask everyone you know for one intro to one angel; never cold-email as plan A.
- [Wellfound (AngelList)](https://wellfound.com) — free founder profile + investor search.
- Y Combinator's free [Startup School](https://www.startupschool.org) and YC application itself
  (free to apply, no fee) — even a rejection gets you a sharper pitch.
- Local SBA/SCORE chapter — free mentors, some run free pitch nights.
- University/accelerator demo days that allow outside applicants (many are free to apply).
- r/startups, Indie Hackers, and Hacker News "Show HN" — post the live product, not just the idea.

**Customers (cheapest path to real traction, which makes the investor pitch 10x stronger):**
- Launch on [Product Hunt](https://www.producthunt.com) — free.
- Post in small-business subreddits (r/smallbusiness, r/Entrepreneur) with genuine value, not a sales
  pitch — link the free 5-question trial.
- Reach out directly to local Chambers of Commerce / SBDC centers — many will share free tools with
  new business owners.
- Build in public on X/LinkedIn: post one real screenshot or metric a week. Free, compounds over time.

**Strongest move available right now:** get 10–20 real users through the free trial and collect even
one or two testimonials or paid conversions before pitching investors. A handful of real users
answering real questions is worth more than any slide.

---

## 11. Next steps checklist

- [ ] Fill in every `[ ]` placeholder above with real numbers (even if they're small/zero).
- [ ] Get 5–10 real people to try the free trial this week.
- [ ] Turn this file into slides (Google Slides/Canva — both free) using sections 2–7 as slide content.
- [ ] Send the cold outreach template to 10 people you already know before 10 strangers.
