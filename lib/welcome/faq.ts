export type FaqItem = { question: string; answer: string };

// Copy approved by Paul — do not edit without sign-off.
export const WELCOME_FAQ: FaqItem[] = [
  {
    question: "What does the candidate experience?",
    answer:
      "A secure link by email — no account, no app. A guided, plain-English questionnaire that works on their phone. Most candidates take around 5–10 minutes, and it autosaves, so they can stop and finish later.",
  },
  {
    question: "How fast do results come back?",
    answer: "Within one business day of the candidate completing their check.",
  },
  {
    question: "What does the client receive?",
    answer:
      "The full report and the candidate's signed questionnaire — the complete picture behind the outcome, so your client can see exactly what the assessment was based on.",
  },
  {
    question: "What happens if something is flagged?",
    answer:
      "Flags always come with a reason and a recommended next step — never an unexplained \"no\". Where a flag needs a closer look, it may call for a physical examination with a doctor. We arrange that and manage it through to an answer.",
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
    question: "How is candidate privacy protected?",
    answer:
      "The report is de-identified before it goes for clinical review — the reviewing clinician assesses the information without the candidate's identity attached, so what's sent stays private. Data is encrypted in transit and at rest, access is role-restricted, and activity is logged.",
  },
  {
    question: "Where do I get help?",
    answer:
      "Email support@preventli.ai — we're quick, and a real person answers. You'll also find your Preventli contact's direct details in your welcome email.",
  },
];
