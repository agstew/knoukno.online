// Templated question generator. Each stage has a pool of underlying
// questions, and each underlying question has several phrasings so the
// same ground gets covered a different way every time it is asked. Each
// topic also carries one example answer shown as a guide, not copied.

const BANK = {
  law: [
    {
      phrasings: [
        "For {title}, which legal entity are you registering as, and why is that the right structure?",
        "What entity type will {title} operate under, and what made you choose it over the alternatives?",
        "Which structure - sole proprietor, LLC, corporation, or partnership - fits {title}, and what is your reasoning?",
      ],
      example:
        "Rivertown Coffee Co. is registering as a single-member LLC. It keeps my personal assets separate from the business, costs little to maintain in my state, and still lets me file taxes as a sole proprietor until the business is big enough to need a different structure.",
    },
    {
      phrasings: [
        "Who has the authority to sign contracts and legal documents on behalf of {title}?",
        "For {title}, who is the signer of record, and what happens if that person is unavailable?",
      ],
      example:
        "I am the sole signer for Rivertown Coffee Co. My business partner holds a limited power of attorney so she can sign routine vendor contracts if I am unreachable for more than 48 hours.",
    },
    {
      phrasings: [
        "What licenses and permits does {title} need to legally operate in your city and industry?",
        "Which specific licences or permits must {title} hold before opening, and who issues them?",
      ],
      example:
        "Rivertown Coffee Co. needs a general business license and a food service permit from the county health department, plus a sign permit from the city since we're adding exterior signage.",
    },
    {
      phrasings: [
        "What insurance will your lease or industry require {title} to carry?",
        "What coverage does {title} need to satisfy a landlord, lender, or regulator?",
      ],
      example:
        "My lease requires $1M in general liability coverage, and the health department requires product liability coverage since we serve food. I'm getting both through a small-business bundle policy.",
    },
    {
      phrasings: [
        "If you had to step away from {title} for a month, what happens to the business?",
        "What is the continuity plan for {title} if you are unexpectedly unavailable for thirty days?",
      ],
      example:
        "My shift lead has access to the POS admin account and vendor contacts, and I've written down the weekly ordering checklist so she could keep Rivertown Coffee Co. running for a month without me.",
    },
  ],
  location: [
    {
      phrasings: [
        "Where will {title} be located, and what does that location cost against the revenue you expect?",
        "What is the rent for {title}'s space, and how does it compare to your projected revenue?",
      ],
      example:
        "Rivertown Coffee Co. will be at 214 Main St. Rent is $2,800/month, about 9% of the $31,000 in monthly revenue I'm projecting, which keeps us under the 10% rule I used to screen locations.",
    },
    {
      phrasings: [
        "What does local zoning allow for {title} at this location?",
        "Does the zoning at your chosen site actually permit what {title} plans to do there?",
      ],
      example:
        "The site is zoned C-2 commercial, which explicitly allows food and beverage retail, so Rivertown Coffee Co. doesn't need a variance before opening.",
    },
    {
      phrasings: [
        "How long does the lease lock {title} into this location?",
        "What is the term of the lease for {title}, and what does breaking it early cost?",
      ],
      example:
        "It's a 3-year lease with a one-time termination fee equal to 3 months' rent if Rivertown Coffee Co. needs to exit early.",
    },
    {
      phrasings: [
        "If your first-choice location for {title} falls through, what is your second choice?",
        "What is {title}'s backup location plan if the primary site does not work out?",
      ],
      example:
        "If 214 Main St falls through, my backup for Rivertown Coffee Co. is a smaller space two blocks over on Elm St - slightly less foot traffic but $600/month cheaper.",
    },
  ],
  hiring: [
    {
      phrasings: [
        "What type of person does {title} need for its first hire, not just a headcount?",
        "Describe the kind of person - not just the role - {title} needs to hire first.",
      ],
      example:
        "Rivertown Coffee Co.'s first hire needs to be a dependable morning barista who can open alone, handle cash counts accurately, and stay calm during the 7-9am rush without needing constant supervision.",
    },
    {
      phrasings: [
        "What can {title} afford to pay this first hire, and how was that number set?",
        "What is the budget for {title}'s first hire, and how does it compare to market rate?",
      ],
      example:
        "I can pay $16/hour, which matches the local average for baristas with experience and fits within the 28% labor-cost target I built into Rivertown Coffee Co.'s first-year budget.",
    },
    {
      phrasings: [
        "How will you know within thirty days whether the first hire at {title} is working out?",
        "What signals in the first month tell you a new hire at {title} is or is not working?",
      ],
      example:
        "Within 30 days I'll know if the hire is working out based on register accuracy, whether regulars mention them positively, and whether I still need to be on-site for every opening shift.",
    },
    {
      phrasings: [
        "Will {title} use contractors or employees for this role, and why?",
        "Is this role at {title} better filled by a contractor or an employee, and what drove that choice?",
      ],
      example:
        "Rivertown Coffee Co. will hire this as a W-2 employee, not a contractor, because the role requires set hours and direct supervision, which contractor classification rules wouldn't allow.",
    },
    {
      phrasings: [
        "What training does {title} owe a new hire, and what part of the job are you not ready to hand over yet?",
        "What must {title} teach a new hire, and which responsibilities will you keep for yourself for now?",
      ],
      example:
        "I'll train the new hire on espresso standards, POS use, and opening checklists over their first week, but I'm keeping vendor ordering and cash deposits to myself for now.",
    },
  ],
  people: [
    {
      phrasings: [
        "Who are the people who come to {title}, described in one sentence?",
        "How would you describe {title}'s customer to a stranger in a single sentence?",
      ],
      example:
        "Rivertown Coffee Co.'s customer is a downtown office worker in their late 20s to 40s who wants a fast, high-quality coffee on their way to work.",
    },
    {
      phrasings: [
        "What problem brings customers to {title} in the first place?",
        "What specific problem does {title} solve for the people who walk in?",
      ],
      example:
        "Customers come to Rivertown Coffee Co. because the nearest chain coffee shop is an 8-minute walk and always has a long line during the morning rush.",
    },
    {
      phrasings: [
        "How do customers find {title} for the first time?",
        "What is the first-touch channel that brings a new customer to {title}?",
      ],
      example:
        "Most first-time customers find Rivertown Coffee Co. by walking past the storefront, with the rest coming from Instagram posts and word of mouth from existing regulars.",
    },
    {
      phrasings: [
        "What makes a customer come back to {title} a second time?",
        "Why would someone return to {title} after their first visit or purchase?",
      ],
      example:
        "Customers come back to Rivertown Coffee Co. because the barista remembers their order by the second visit and the line moves faster than anywhere else nearby.",
    },
  ],
};

function pick(arr, seed) {
  return arr[seed % arr.length];
}

/**
 * Generate `count` questions for a stage, continuing from `startIndex`
 * (how many questions have already been asked in this stage). Topics cycle
 * through the underlying question pool, and the phrasing varies each time a
 * topic comes back around. Each result includes an example answer.
 */
export function generateQuestions(stage, title, count, startIndex = 0) {
  const pools = BANK[stage];
  if (!pools) throw new Error(`Unknown stage: ${stage}`);

  const questions = [];
  for (let i = 0; i < count; i++) {
    const globalIndex = startIndex + i;
    const topicIndex = globalIndex % pools.length;
    const timesAsked = Math.floor(globalIndex / pools.length);
    const topic = pools[topicIndex];
    const phrasing = pick(topic.phrasings, timesAsked);
    questions.push({
      text: phrasing.replace(/{title}/g, title),
      example: topic.example,
    });
  }
  return questions;
}

export const STAGE_LIST = Object.keys(BANK);
