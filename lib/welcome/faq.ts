export type FaqItem = { question: string; answer: string };

// Copy approved by Paul — do not edit without sign-off.
export const WELCOME_FAQ: FaqItem[] = [
  {
    question: "What does the candidate experience?",
    answer:
      "A secure link by email — no account, no app. A guided, plain-English questionnaire that works on their phone. Typically 10–15 minutes, and it autosaves, so they can stop and finish later.",
  },
  {
    question: "How fast do results come back?",
    answer: "Within one business day of the candidate completing their check.",
  },
  {
    question: "How much does it cost?",
    answer:
      "$40 per completed check. If a check isn't completed, it isn't reviewed — and it isn't invoiced.",
  },
  {
    question: "Who sees what?",
    answer:
      "Your client receives the fitness-for-role outcome: whether the candidate can safely perform the role, with what capacity and constraints. They do not receive the candidate's private medical detail beyond that.",
  },
  {
    question: "What happens if something is flagged?",
    answer:
      "Flags always come with a reason and a recommended next step — never an unexplained \"no\". Where more clinical depth is needed, we arrange it and manage it through to an answer.",
  },
  {
    question: "Who reviews the checks?",
    answer:
      "Every report goes through GPNet clinical review before release. Where a treating GP is holding things up, we can arrange an independent medical review — we make contact, set the plan, and follow it through, so it doesn't stall on your desk.",
  },
  {
    question: "What happens to the report afterwards?",
    answer:
      "It's sent to your client on approval — full report plus the original questionnaire — and kept on file in your workspace for future reference, whenever it's needed.",
  },
  {
    question: "What if the candidate doesn't complete the check?",
    answer:
      "The system reminds them automatically — up to three times, no more than once a day — then escalates so you know. You're never silently waiting.",
  },
  {
    question: "How is candidate data protected?",
    answer:
      "Candidate data is encrypted in transit and at rest, access is role-restricted, and activity is logged.",
  },
  {
    question: "Where do I get help?",
    answer: "Ask Alex first — fastest answer, day or night. Anything else: support@preventli.ai.",
  },
];
