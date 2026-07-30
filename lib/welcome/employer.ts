// Employer-audience data for the onboarding hub at /employer-onboarding —
// a single company that signed up directly ("I manage my own workers"),
// not a partner managing client orgs.
//
// The employer flow has FOUR stages, not five: there is no "set up a client"
// step (an employer IS the org), and the product has no standalone JD-upload
// surface for employers — the job description is attached while creating a
// check (and silently saved to the org's library for next time), so that
// teaching lives inside the create-and-send chapter. See
// docs/onboarding-video-scripts-employer-v1.md for the full shot-level
// scripts and per-shot verification status.

import type { Chapter } from "./chapters";
import { ACTOR_LABEL, type WorkflowMapConfig } from "./workflow";
import type { FaqItem } from "./faq";

export const EMPLOYER_CHAPTERS: Chapter[] = [
  {
    // Footage pending — scripted in docs/onboarding-video-scripts-employer-v1.md
    // (signup copy verified against the live /start-trial page 2026-07-30).
    // The lightbox shows its built-in "video on its way" placeholder until
    // `src` is set.
    id: "employer-getting-started",
    index: 1,
    title: "Getting started",
    description:
      "Start your free trial, verify your email, and find your way around your workspace.",
    poster: "/welcome/video-placeholder.svg",
  },
  {
    // Footage pending — same NewAssessmentPage flow the partner chapter 3
    // films, reached from the employer's own workspace. Includes the JD
    // attach + saved-to-library beat and the create-vs-send two-step.
    id: "employer-creating-checks",
    index: 2,
    title: "Creating and sending checks",
    description:
      "Create a pre-employment check, attach the job description, and send the secure link to your candidate.",
    poster: "/welcome/video-placeholder.svg",
  },
  {
    // Shared with the partner hub on purpose: the candidate experience is
    // audience-neutral, so both pages play the same file, and the shared
    // chapter id means watched-state carries across hubs harmlessly.
    id: "the-candidate-experience",
    index: 3,
    title: "The candidate experience",
    description: "What the candidate sees, and how automatic reminders keep things moving.",
    src: "/welcome/the-candidate-experience.mp4",
    poster: "/welcome/the-candidate-experience-poster.jpg",
  },
  {
    // Footage pending. Employers have no approval gate — clinical review
    // approves and the report lands in their workspace (/checks). The
    // narration deliberately promises neither an email nor a timeframe; see
    // the honesty constraints in the scripts doc.
    id: "employer-clinical-review",
    index: 4,
    title: "Review & your report",
    description:
      "How your candidate's answers are clinically reviewed, and where the report lands in your workspace.",
    poster: "/welcome/video-placeholder.svg",
  },
];

export function getEmployerChapter(id: string): Chapter | undefined {
  return EMPLOYER_CHAPTERS.find((c) => c.id === id);
}

export const EMPLOYER_MAP: WorkflowMapConfig = {
  groups: [
    {
      id: "get-set-up",
      chapterId: "employer-getting-started",
      title: "Get set up",
      summary: "Sign up, verify your email, and find your way around your workspace.",
      actor: "partner",
      row: 0,
      col: 0,
      stages: [
        { label: "Sign up + verify", actor: "partner" },
        { label: "Log in", actor: "partner" },
        { label: "Your workspace", actor: "partner" },
      ],
    },
    {
      id: "create-and-send",
      chapterId: "employer-creating-checks",
      title: "Create and send the check",
      summary: "Candidate, role and job description — then you choose when it sends.",
      actor: "partner",
      row: 0,
      col: 1,
      stages: [
        { label: "Create the check", actor: "partner" },
        { label: "Attach the job description", actor: "partner" },
        { label: "Send to candidate", actor: "partner" },
      ],
    },
    {
      id: "candidate-completes",
      chapterId: "the-candidate-experience",
      title: "The candidate completes it",
      summary: "On their phone, no app. It autosaves, and reminders chase them if they stall.",
      actor: "candidate",
      row: 0,
      col: 2,
      stages: [
        { label: "Opens the link", actor: "candidate" },
        { label: "Completes + e-signs", actor: "candidate" },
        { label: "Automatic reminders", actor: "automatic" },
      ],
    },
    {
      id: "reviewed-and-report",
      chapterId: "employer-clinical-review",
      title: "Reviewed, approved — report to you",
      summary: "GPNet clinicians check every report before it lands in your workspace.",
      actor: "gpnet",
      row: 1,
      col: 1,
      stages: [
        { label: "Report drafted", actor: "gpnet" },
        { label: "Clinical review", actor: "gpnet" },
        { label: "Approved", actor: "gpnet" },
        { label: "In your workspace", actor: "gpnet" },
      ],
    },
  ],
  actorLabels: {
    ...ACTOR_LABEL,
    partner: "You (the employer)",
  },
  subheading:
    "Four stages, four short videos. Click a stage to watch it, or take the full tour from start to finish.",
  rowArrows: [
    { id: "ra-r0-a", gridColumn: "2 / 3", gridRow: "1 / 2" },
    { id: "ra-r0-b", gridColumn: "4 / 5", gridRow: "1 / 2" },
  ],
  // Single second-row box sits centered; the elbow drops from the top-right
  // box to the middle column.
  elbowPath: "M 84 0 L 84 50 L 50 50 L 50 100",
};

// Derived from the partner FAQ (approved copy). Three answers reworded for a
// direct employer — "your client" becomes "you" — flagged for Paul's sign-off
// in the PR; everything else is verbatim.
export const EMPLOYER_FAQ: FaqItem[] = [
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
    question: "What do I receive?",
    answer:
      "The full report and the candidate's signed questionnaire — the complete picture behind the outcome, so you can see exactly what the assessment was based on.",
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
      "It's released to you on approval — full report plus the original questionnaire — and kept on file in your workspace for future reference, whenever it's needed.",
  },
  {
    question: "What if the candidate doesn't complete the check?",
    answer:
      "The system reminds them automatically — up to three times, no more than once a day — then escalates so you know. You're never silently waiting.",
  },
  {
    question: "How is candidate privacy protected?",
    answer:
      "Candidate health information is only ever seen by the clinical team reviewing it, and it is de-identified when sent for independent medical review. Nothing reaches you until a clinician has signed it off. Data is encrypted in transit and at rest, access is role-restricted, and activity is logged.",
  },
  {
    question: "Where do I get help?",
    answer:
      "Email support@preventli.ai — we're quick, and a real person answers. You'll also find your Preventli contact's direct details in your welcome email.",
  },
];
