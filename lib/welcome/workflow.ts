// Data for the animated workflow map — the centerpiece of the partner
// onboarding hub. Each node is one clickable stage in the end-to-end
// process; nodes are grouped by which actor performs that stage.

export type Actor = "partner" | "candidate" | "gpnet" | "automatic";

export type WorkflowNode = {
  id: string;
  label: string;
  detail: string;
  actor: Actor;
  /** Chapter video (see chapters.ts) this node's lightbox plays. */
  chapterId: string;
  /**
   * TODO(video): seconds into the chapter this stage starts at, once real
   * files support deep-linking. Purely a hint for later — unused today.
   */
  startTimeHint?: number;
  /** "Ask Alex" spans the full width and uses the always-available style. */
  fullWidth?: boolean;
};

export const ACTOR_LABEL: Record<Actor, string> = {
  partner: "Partner (you)",
  candidate: "Candidate",
  gpnet: "GPNet clinical",
  automatic: "Automatic",
};

// Tailwind-friendly color tokens per actor, used consistently across the
// legend, node borders/dots, and the connector pulse.
export const ACTOR_COLOR: Record<Actor, string> = {
  partner: "#00BCD4", // teal
  candidate: "#B388FF", // purple
  gpnet: "#FF7043", // coral
  automatic: "#8B98A8", // gray
};

export const WORKFLOW_NODES: WorkflowNode[] = [
  { id: "sign-up", label: "Sign up + verify", detail: "Create your partner account and verify your email.", actor: "partner", chapterId: "getting-started", startTimeHint: 0 },
  { id: "log-in", label: "Log in", detail: "Log in to your partner workspace.", actor: "partner", chapterId: "getting-started", startTimeHint: 25 },
  { id: "dashboard", label: "Partner workspace", detail: "Your dashboard — every client, check, and case in one place.", actor: "partner", chapterId: "getting-started", startTimeHint: 55 },
  { id: "add-client", label: "Add a client", detail: "Add a client company you're running checks for.", actor: "partner", chapterId: "setting-up-a-client", startTimeHint: 0 },
  { id: "upload-jd", label: "Upload job descriptions", detail: "Upload the job descriptions checks get assessed against.", actor: "partner", chapterId: "setting-up-a-client", startTimeHint: 20 },
  { id: "create-check", label: "Create the check", detail: "Choose the check type and the candidate you're sending it to.", actor: "partner", chapterId: "creating-and-sending-checks", startTimeHint: 0 },
  { id: "send-check", label: "Send to candidate", detail: "The secure link goes out by email — no account or app needed.", actor: "partner", chapterId: "creating-and-sending-checks", startTimeHint: 20 },
  { id: "opens-link", label: "Opens the link", detail: "The candidate opens a secure, guided, plain-English questionnaire on their phone.", actor: "candidate", chapterId: "the-candidate-experience", startTimeHint: 0 },
  { id: "completes-signs", label: "Completes + e-signs", detail: "Typically 10–15 minutes. It autosaves, so they can finish later.", actor: "candidate", chapterId: "the-candidate-experience", startTimeHint: 20 },
  { id: "reminders", label: "Automatic reminders", detail: "Up to three reminders, no more than once a day, then it escalates to you.", actor: "automatic", chapterId: "the-candidate-experience", startTimeHint: 45 },
  { id: "report-drafted", label: "Report drafted", detail: "The report is drafted from the completed questionnaire.", actor: "automatic", chapterId: "clinical-review", startTimeHint: 0 },
  { id: "clinical-review", label: "GPNet clinical review", detail: "Every report goes through GPNet clinical review before release.", actor: "gpnet", chapterId: "clinical-review", startTimeHint: 20 },
  { id: "approved", label: "Approved", detail: "The report is approved and ready to send.", actor: "gpnet", chapterId: "clinical-review", startTimeHint: 45 },
  { id: "client-notified", label: "Client notified", detail: "Your client receives the fitness-for-role outcome automatically.", actor: "automatic", chapterId: "notification-and-alex", startTimeHint: 0 },
  { id: "ask-alex", label: "Ask Alex any time", detail: "Fastest answer, day or night — ask Alex anything about a case or the process.", actor: "automatic", chapterId: "notification-and-alex", startTimeHint: 20, fullWidth: true },
];
