// Templated question generator. Each stage has a pool of underlying
// questions, and each underlying question has several phrasings so the
// same ground gets covered a different way every time it is asked.

const BANK = {
  law: [
    [
      "For {title}, which legal entity are you registering as, and why is that the right structure?",
      "What entity type will {title} operate under, and what made you choose it over the alternatives?",
      "Which structure - sole proprietor, LLC, corporation, or partnership - fits {title}, and what is your reasoning?",
    ],
    [
      "Who has the authority to sign contracts and legal documents on behalf of {title}?",
      "For {title}, who is the signer of record, and what happens if that person is unavailable?",
    ],
    [
      "What licenses and permits does {title} need to legally operate in your city and industry?",
      "Which specific licences or permits must {title} hold before opening, and who issues them?",
    ],
    [
      "What insurance will your lease or industry require {title} to carry?",
      "What coverage does {title} need to satisfy a landlord, lender, or regulator?",
    ],
    [
      "If you had to step away from {title} for a month, what happens to the business?",
      "What is the continuity plan for {title} if you are unexpectedly unavailable for thirty days?",
    ],
  ],
  location: [
    [
      "Where will {title} be located, and what does that location cost against the revenue you expect?",
      "What is the rent for {title}'s space, and how does it compare to your projected revenue?",
    ],
    [
      "What does local zoning allow for {title} at this location?",
      "Does the zoning at your chosen site actually permit what {title} plans to do there?",
    ],
    [
      "How long does the lease lock {title} into this location?",
      "What is the term of the lease for {title}, and what does breaking it early cost?",
    ],
    [
      "If your first-choice location for {title} falls through, what is your second choice?",
      "What is {title}'s backup location plan if the primary site does not work out?",
    ],
  ],
  hiring: [
    [
      "What type of person does {title} need for its first hire, not just a headcount?",
      "Describe the kind of person - not just the role - {title} needs to hire first.",
    ],
    [
      "What can {title} afford to pay this first hire, and how was that number set?",
      "What is the budget for {title}'s first hire, and how does it compare to market rate?",
    ],
    [
      "How will you know within thirty days whether the first hire at {title} is working out?",
      "What signals in the first month tell you a new hire at {title} is or is not working?",
    ],
    [
      "Will {title} use contractors or employees for this role, and why?",
      "Is this role at {title} better filled by a contractor or an employee, and what drove that choice?",
    ],
    [
      "What training does {title} owe a new hire, and what part of the job are you not ready to hand over yet?",
      "What must {title} teach a new hire, and which responsibilities will you keep for yourself for now?",
    ],
  ],
  people: [
    [
      "Who are the people who come to {title}, described in one sentence?",
      "How would you describe {title}'s customer to a stranger in a single sentence?",
    ],
    [
      "What problem brings customers to {title} in the first place?",
      "What specific problem does {title} solve for the people who walk in?",
    ],
    [
      "How do customers find {title} for the first time?",
      "What is the first-touch channel that brings a new customer to {title}?",
    ],
    [
      "What makes a customer come back to {title} a second time?",
      "Why would someone return to {title} after their first visit or purchase?",
    ],
  ],
};

function pick(arr, seed) {
  return arr[seed % arr.length];
}

/**
 * Generate `count` questions for a stage, continuing from `startIndex`
 * (how many questions have already been asked in this stage). Topics cycle
 * through the underlying question pool, and the phrasing varies each time a
 * topic comes back around.
 */
export function generateQuestions(stage, title, count, startIndex = 0) {
  const pools = BANK[stage];
  if (!pools) throw new Error(`Unknown stage: ${stage}`);

  const questions = [];
  for (let i = 0; i < count; i++) {
    const globalIndex = startIndex + i;
    const topicIndex = globalIndex % pools.length;
    const timesAsked = Math.floor(globalIndex / pools.length);
    const phrasing = pick(pools[topicIndex], timesAsked);
    questions.push(phrasing.replace(/{title}/g, title));
  }
  return questions;
}

export const STAGE_LIST = Object.keys(BANK);
