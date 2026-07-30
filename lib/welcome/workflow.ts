// Data for the workflow map — the centerpiece of the onboarding hubs.
//
// One group == one chapter video == one clickable box. This 1:1 mapping is
// deliberate: an earlier version exposed all 14 individual stages as separate
// click targets, but several stages share a single chapter video, so clicking
// a second stage in the same row replayed the video the user had just
// watched. Testers read that as broken. Stages are now shown *inside* their
// group as plain, non-interactive labels — the group is the only click target.
//
// `row`/`col` describe the box's position in the desktop grid (see
// components/welcome/WorkflowMap.tsx): boxes across the top row, then
// the flow drops down-left into a second row.
//
// The map is audience-parameterised: /partner-onboarding renders PARTNER_MAP
// (this file); /employer-onboarding renders EMPLOYER_MAP
// (lib/welcome/employer.ts). Connector arrows and the elbow path are
// position-coupled to the groups, so they live in the same per-audience
// config rather than the component.

export type Actor = "partner" | "candidate" | "gpnet" | "automatic";

export type WorkflowStage = {
  label: string;
  actor: Actor;
};

export type WorkflowGroup = {
  id: string;
  /** Chapter video (see chapters.ts) this box's lightbox plays. */
  chapterId: string;
  title: string;
  summary: string;
  /** Drives the box's border/fill colour and its actor chip. */
  actor: Actor;
  stages: WorkflowStage[];
  /** Desktop grid row (0 = top row, 1 = second row). */
  row: 0 | 1;
  /** Desktop grid column within the row (0 = left, 1 = center, 2 = right). */
  col: 0 | 1 | 2;
};

export type RowArrowSpec = {
  id: string;
  gridColumn: string;
  gridRow: string;
};

export type WorkflowMapConfig = {
  groups: WorkflowGroup[];
  /** Legend + actor chips — audience-specific ("You (the partner)" vs "You (the employer)"). */
  actorLabels: Record<Actor, string>;
  /** The "N stages, N short videos…" line under the section heading. */
  subheading: string;
  /** Straight same-row connectors between adjacent boxes. */
  rowArrows: RowArrowSpec[];
  /** SVG path for the down-left elbow from the top row into the second row. */
  elbowPath: string;
};

export const ACTOR_LABEL: Record<Actor, string> = {
  partner: "You (the partner)",
  candidate: "Candidate",
  gpnet: "GPNet clinical",
  automatic: "Automatic",
};

// Tailwind-friendly color tokens per actor, used consistently across the
// legend, box fills/borders, and connectors. Kept visibly distinct from the
// spring-green brand accent (#00E676), which is reserved for hover/pulse.
export const ACTOR_COLOR: Record<Actor, string> = {
  partner: "#00BCD4", // teal
  candidate: "#B388FF", // purple
  gpnet: "#FF7043", // coral
  automatic: "#8B98A8", // gray
};

export const WORKFLOW_GROUPS: WorkflowGroup[] = [
  {
    id: "get-set-up",
    chapterId: "getting-started",
    title: "Get set up",
    summary: "Sign up, verify your email, and find your way around your workspace.",
    actor: "partner",
    row: 0,
    col: 0,
    stages: [
      { label: "Sign up + verify", actor: "partner" },
      { label: "Log in", actor: "partner" },
      { label: "Partner workspace", actor: "partner" },
    ],
  },
  {
    id: "add-your-client",
    chapterId: "setting-up-a-client",
    title: "Add your client",
    summary: "Company details, then the job descriptions you'll be checking against.",
    actor: "partner",
    row: 0,
    col: 1,
    stages: [
      { label: "Add a client", actor: "partner" },
      { label: "Upload job descriptions", actor: "partner" },
    ],
  },
  {
    id: "create-and-send",
    chapterId: "creating-and-sending-checks",
    title: "Create and send the check",
    summary: "Candidate, role and JD — the secure link goes out straight away.",
    actor: "partner",
    row: 0,
    col: 2,
    stages: [
      { label: "Create the check", actor: "partner" },
      { label: "Send to candidate", actor: "partner" },
    ],
  },
  {
    id: "candidate-completes",
    chapterId: "the-candidate-experience",
    title: "The candidate completes it",
    summary: "On their phone, no app. It autosaves, and reminders chase them if they stall.",
    actor: "candidate",
    row: 1,
    col: 0,
    stages: [
      { label: "Opens the link", actor: "candidate" },
      { label: "Completes + e-signs", actor: "candidate" },
      { label: "Automatic reminders", actor: "automatic" },
    ],
  },
  {
    id: "reviewed-and-notified",
    chapterId: "clinical-review",
    title: "Reviewed, approved, client notified",
    summary: "GPNet clinicians check every report before anything reaches your client.",
    actor: "gpnet",
    row: 1,
    col: 1,
    stages: [
      { label: "Report drafted", actor: "gpnet" },
      { label: "Clinical review", actor: "gpnet" },
      { label: "Approved", actor: "gpnet" },
      { label: "Client notified", actor: "gpnet" },
    ],
  },
];

export const PARTNER_MAP: WorkflowMapConfig = {
  groups: WORKFLOW_GROUPS,
  actorLabels: ACTOR_LABEL,
  subheading:
    "Five stages, five short videos. Click a stage to watch it, or take the full tour from start to finish.",
  rowArrows: [
    { id: "ra-r0-a", gridColumn: "2 / 3", gridRow: "1 / 2" },
    { id: "ra-r0-b", gridColumn: "4 / 5", gridRow: "1 / 2" },
    { id: "ra-r1-a", gridColumn: "2 / 3", gridRow: "3 / 4" },
  ],
  // The flow leaves the top-right box and returns to the left of the second
  // row. x values are percentages across the full grid width (roughly the
  // 16 / 50 / 84 centers of the three box columns).
  elbowPath: "M 84 0 L 84 50 L 16 50 L 16 100",
};
