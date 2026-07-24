// Data for the animated workflow map — the centerpiece of the partner
// onboarding hub. Each node is one clickable stage in the end-to-end
// process; nodes are grouped by which actor performs that stage.
//
// `row`/`col` describe the node's position in the desktop flowchart grid
// (see components/welcome/WorkflowMap.tsx): row is 0-indexed top-to-bottom,
// col is 0 (left) / 1 (center) / 2 (right) within a 3-column row. `wide`
// centers a single node across the middle column plus its gutters — used
// for the final "Client notified" row, which is the end of the flow.

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
  /** Desktop flowchart row (0-indexed, top to bottom). */
  row: number;
  /** Desktop flowchart column within the row (0 = left, 1 = center, 2 = right). */
  col: 0 | 1 | 2;
  /** Centers the node across the middle column plus its gutters. */
  wide?: boolean;
};

export const ACTOR_LABEL: Record<Actor, string> = {
  partner: "You (the partner)",
  candidate: "Candidate",
  gpnet: "GPNet clinical",
  automatic: "Automatic",
};

// Tailwind-friendly color tokens per actor, used consistently across the
// legend, node fills/borders, and connectors. Kept visibly distinct from the
// spring-green brand accent (#00E676), which is reserved for hover/pulse.
export const ACTOR_COLOR: Record<Actor, string> = {
  partner: "#00BCD4", // teal
  candidate: "#B388FF", // purple
  gpnet: "#FF7043", // coral
  automatic: "#8B98A8", // gray
};

export const WORKFLOW_NODES: WorkflowNode[] = [
  // Row 1 — partner: account + workspace
  { id: "sign-up", label: "Sign up + verify", detail: "Form, then email link", actor: "partner", chapterId: "getting-started", startTimeHint: 0, row: 0, col: 0 },
  { id: "log-in", label: "Log in", detail: "app.preventli.ai", actor: "partner", chapterId: "getting-started", startTimeHint: 25, row: 0, col: 1 },
  { id: "dashboard", label: "Partner workspace", detail: "All clients, one view", actor: "partner", chapterId: "getting-started", startTimeHint: 55, row: 0, col: 2 },

  // Row 2 — partner: set up a client
  { id: "add-client", label: "Add a client", detail: "Company + contact details", actor: "partner", chapterId: "setting-up-a-client", startTimeHint: 0, row: 1, col: 0 },
  { id: "upload-jd", label: "Upload job descriptions", detail: "Saved to their JD library", actor: "partner", chapterId: "setting-up-a-client", startTimeHint: 20, row: 1, col: 1 },

  // Row 3 — partner: create + send the check
  { id: "create-check", label: "Create the check", detail: "Candidate + role + JD", actor: "partner", chapterId: "creating-and-sending-checks", startTimeHint: 0, row: 2, col: 0 },
  { id: "send-check", label: "Send to candidate", detail: "Secure link, straight away", actor: "partner", chapterId: "creating-and-sending-checks", startTimeHint: 20, row: 2, col: 1 },

  // Row 4 — candidate experience (+ automatic reminders branch)
  { id: "opens-link", label: "Opens the link", detail: "On their phone, no app", actor: "candidate", chapterId: "the-candidate-experience", startTimeHint: 0, row: 3, col: 0 },
  { id: "completes-signs", label: "Completes + e-signs", detail: "Autosaves as they go", actor: "candidate", chapterId: "the-candidate-experience", startTimeHint: 20, row: 3, col: 1 },
  { id: "reminders", label: "Automatic reminders", detail: "Up to 3, then escalate", actor: "automatic", chapterId: "the-candidate-experience", startTimeHint: 45, row: 3, col: 2 },

  // Row 5 — GPNet clinical review
  { id: "report-drafted", label: "Report drafted", detail: "Built from responses", actor: "gpnet", chapterId: "clinical-review", startTimeHint: 0, row: 4, col: 0 },
  { id: "clinical-review", label: "GPNet clinical review", detail: "Checked before release", actor: "gpnet", chapterId: "clinical-review", startTimeHint: 20, row: 4, col: 1 },
  { id: "approved", label: "Approved", detail: "Case record created", actor: "gpnet", chapterId: "clinical-review", startTimeHint: 45, row: 4, col: 2 },

  // Row 6 — outcome, end of the flow
  { id: "client-notified", label: "Client notified", detail: "Fitness-for-role outcome emailed", actor: "gpnet", chapterId: "clinical-review", startTimeHint: 65, row: 5, col: 1, wide: true },
];
