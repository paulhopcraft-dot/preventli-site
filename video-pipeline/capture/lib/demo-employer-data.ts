/**
 * Casting + fixture constants for the EMPLOYER onboarding-video capture
 * chapters (employer-01 / employer-02 / employer-04). Mirrors demo-data.ts,
 * which stays partner-only.
 *
 * CONTRACT NOTE: everything here traces to `server/seed-demo-employer.ts`
 * in the `preventli` repo — a seed being built in a PARALLEL preventli PR,
 * open + UNMERGED as of 2026-07-30. These credentials/org names are the
 * agreed contract between that seed and this harness: if the seed lands
 * with different values, update THIS file (single source for every
 * employer chapter) rather than the chapters.
 *
 * Per docs/onboarding-video-scripts-employer-v1.md "Casting / fixtures":
 *  - both users are `role: "admin"` on an `kind: "employer"` org (a real
 *    trial signup's shape — NOT Wallara/Lara's `role: "employer"`, which
 *    renders a different sidebar),
 *  - mid-trial (`trialEndsAt` in the future) so the TrialBanner shows,
 *  - names must not collide with Vantage RTW's ten client orgs,
 *    "Northgate Distribution Centre", or any live tenant.
 */

/**
 * Chapter employer-01's post-login workspace beats: a FRESH org with zero
 * cases and zero checks, so CasesDashboard renders the GettingStartedChecklist
 * (client/src/pages/CasesDashboard.tsx:357-359 — only when cases.length === 0)
 * and the empty unified list ("No cases or checks yet.").
 */
export const EMPLOYER_FRESH = {
  orgName: "Northwind Joinery Pty Ltd",
  loginEmail: "fresh@northwindjoinery.example.com.au",
  loginPassword: "PreventliDemo2026!",
};

/**
 * Chapters employer-02 and employer-04: an ACTIVE org that already has at
 * least one APPROVED pre-employment check (see CH4_SEEDED_CHECK) with a
 * generated report + computed risk level, plus the auto-created case record.
 */
export const EMPLOYER_ACTIVE = {
  orgName: "Harbourline Distribution Pty Ltd",
  loginEmail: "demo@harbourline.example.com.au",
  loginPassword: "PreventliDemo2026!",
};

/**
 * Chapter employer-02's candidate, created live on camera. Fictional; the
 * role matches the committed forklift-driver fixture JD so the attached PDF
 * visibly belongs with the narrated role (same role/JD-coherence rule as the
 * partner set's Coastline/PCA pairing). Re-running the chapter creates a
 * second in-progress check for the same candidate — harmless for filming,
 * same caveat as partner chapter 3 (docs/video-pipeline.md "Re-running a
 * full capture").
 */
export const CH2_CANDIDATE = {
  name: "Priya Chen",
  email: "priya.chen@example.com.au",
  role: "Forklift Driver",
  /** Relative to video-pipeline/capture/fixtures/ — committed placeholder JD. */
  jdFixture: "forklift-driver-position-description.pdf",
  /** Proposed start date typed into the native date input — any future date. */
  startDate: "2026-08-24",
};

/**
 * Chapter employer-04's payoff: seeded by seed-demo-employer.ts as an
 * already-APPROVED check (status completed, clearance cleared_unconditional,
 * reportJson present so the View Report modal has content, risk_level
 * Medium so the unified case list shows the Medium pill) plus the
 * auto-created case record (server/routes/reportReview.ts:342-352).
 */
export const CH4_SEEDED_CHECK = {
  candidateName: "Marcus Webb",
  role: "Forklift Driver",
  riskLevel: "Medium" as const,
};

/**
 * Chapter employer-01's live-site beats film the REAL production marketing
 * site (the trial form is filled but NEVER submitted — see that chapter's
 * header). Overridable for a staging run, but the default is deliberately
 * the live site: that is what a real signup sees, and nothing is submitted.
 */
export const LIVE_SITE_BASE_URL = process.env.LIVE_SITE_BASE_URL ?? "https://preventli.ai";

/**
 * What gets TYPED into the live /start-trial form (never submitted).
 * The email matches EMPLOYER_FRESH so the story is continuous: the form the
 * viewer watches being filled is "the same account" the workspace beats then
 * open locally. Fictional person; example-domain email; the password typed
 * on camera is the demo password (its characters render masked anyway —
 * app/start-trial/page.tsx:270 `type="password"`).
 */
export const TRIAL_SIGNUP = {
  company: "Northwind Joinery Pty Ltd",
  fullName: "Grace Halloran",
  workEmail: "fresh@northwindjoinery.example.com.au",
  password: "PreventliDemo2026!",
  /** Value attr of the chosen <option> — lib/trial-signup.ts EMPLOYEE_COUNT_OPTIONS ("11–50 employees"). */
  employeeCountValue: "11-50",
};
