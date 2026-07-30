import type { ChapterModule } from "../lib/recording";
import { DEFAULT_BASE_URL } from "../lib/demo-data";
import { CH4_SEEDED_CHECK, EMPLOYER_ACTIVE } from "../lib/demo-employer-data";
import { employerAuthStatePath } from "../lib/employer-auth";
import { cursorClick, moveCursorTo, ringAround } from "../lib/annotate";

/**
 * Employer chapter 4 — "Review & your report".
 * Script: docs/onboarding-video-scripts-employer-v1.md, chapter 4 table.
 * (Chapter 3, the candidate experience, is REUSED from the partner set —
 * no employer-03 file exists on purpose.)
 *
 * GRAPHIC BEATS, NOT CAPTURED HERE: the chapter's two opening beats
 * (0:00-0:07 dark explainer card "answers go through clinical review", and
 * 0:07-0:13 the "our side" clinical-review context shot) are graphics /
 * manual treatment, same as partner chapter 5's dark-card opening — this
 * harness has no clinician actor and the beat is explicitly framed as NOT
 * the employer's screen. The outro card (0:40-0:45) is likewise a graphic.
 * Captured shots below cover 0:13-0:40 only.
 *
 * Logged in as EMPLOYER_ACTIVE ("Harbourline Distribution Pty Ltd").
 * Depends on `preventli`'s server/seed-demo-employer.ts (parallel PR,
 * unmerged) seeding CH4_SEEDED_CHECK ("Marcus Webb", Forklift Driver) as an
 * already-APPROVED check: status completed + clearance
 * cleared_unconditional (the "✓ Approved" badge, ChecksPage.tsx:459) +
 * reportJson populated (so View Report opens a real report, not the
 * "Report not yet generated" fallback, ChecksPage.tsx:1296-1301) + a
 * computed Medium risk_level + the auto-created case record
 * (server/routes/reportReview.ts:342-352).
 *
 * RISK-PILL PLACEMENT, verified against source and narrower than the
 * script's claim: the /checks table (ChecksPage.tsx:423-502) has
 * Worker/Status/Clearance/Date/Report columns and NO risk pill — its row
 * type carries clearanceLevel only. The Low/Medium/High pill next to the
 * worker's name lives on the UNIFIED case list at "/"
 * (CaseListView.tsx:477-485, data-testid case-list-risk-badge-*). So the
 * "risk rating next to your candidate's name" beat lands in shot 03 (the
 * Cases list), and shot 01 rings the /checks row with its "✓ Approved"
 * clearance badge instead. If the narration must keep risk-on-/checks
 * word-for-word, that's a script edit or a product change — flag, don't
 * fake (script's own verification table already marks the employer list
 * as unclicked CODE-level evidence).
 */
const chapter: ChapterModule = {
  chapterId: "employer-04-review-report",
  shots: [
    // -- (dark explainer card + "our side" clinical-review context shot go
    //     here in the edit — graphics, not captured; see chapter header) --
    {
      id: "01-checks-list-approved-row",
      title: "Checks list: the approved check's row — ring it",
      needsAuth: true,
      storageStatePath: employerAuthStatePath(EMPLOYER_ACTIVE),
      async run(page) {
        await page.goto(`${DEFAULT_BASE_URL}/checks`, { waitUntil: "networkidle" });
        // Pre-Employment tab is the default (ChecksPage.tsx:978-982).
        await page.getByTestId("checks-tab-pre_employment").waitFor({ state: "visible" });

        // The seeded approved row — data-testid="check-row-<id>"
        // (ChecksPage.tsx:435), matched by candidate name since the seed's
        // row id isn't knowable here. Clearance column shows "✓ Approved"
        // for cleared_unconditional (:459).
        const row = page
          .locator('[data-testid^="check-row-"]')
          .filter({ hasText: CH4_SEEDED_CHECK.candidateName })
          .first();
        await row.waitFor({ state: "visible" });
        await page.waitForTimeout(1400);

        await moveCursorTo(page, row, { durationMs: 1000 });
        const ring = await ringAround(page, row, { paddingPx: 4 });
        // Long hold — this is the "the result lands right here in your
        // workspace" beat.
        await page.waitForTimeout(3600);
        await ring.remove();
        await page.waitForTimeout(600);
      },
    },
    {
      id: "02-view-report-modal",
      title: "Open View Report — clearance, summary, conditions",
      needsAuth: true,
      storageStatePath: employerAuthStatePath(EMPLOYER_ACTIVE),
      async run(page) {
        // Self-contained: re-derives the list state (fresh context per shot).
        await page.goto(`${DEFAULT_BASE_URL}/checks`, { waitUntil: "networkidle" });
        const row = page
          .locator('[data-testid^="check-row-"]')
          .filter({ hasText: CH4_SEEDED_CHECK.candidateName })
          .first();
        await row.waitFor({ state: "visible" });
        await page.waitForTimeout(1000);

        // "View Report" — the row's Report-column button (ChecksPage.tsx:
        // 483-494; the assessment-row branch, enabled because reportJson is
        // seeded). Scoped to the row so other rows' buttons can't match.
        const viewReport = row.getByRole("button", { name: /view report/i });
        await viewReport.waitFor({ state: "visible" });
        await cursorClick(page, viewReport, { durationMs: 1100 });

        // Report modal — DialogTitle "Pre-Employment Check Report"
        // (ChecksPage.tsx:1199, CHECK_LABELS from shared/check-categories.
        // ts:26), then the clearance banner ("AI Recommendation: …",
        // :1205-1214), the Summary section (:1215-1218), and — when the
        // seed provides conditions — "Conditions / Restrictions"
        // (:1243-1248).
        await page.getByRole("heading", { name: /pre-employment check report/i }).waitFor({
          state: "visible",
          timeout: 15_000,
        });
        await page.getByText(/AI Recommendation:/i).waitFor({ state: "visible" });
        await page.waitForTimeout(1800);

        // Walk the beats the narration names: clearance → summary →
        // conditions. Hovers, not rings — the modal is already the frame.
        await moveCursorTo(page, page.getByText(/AI Recommendation:/i), { durationMs: 800 });
        await page.waitForTimeout(1600);
        const summary = page.getByRole("heading", { name: "Summary" });
        if (await summary.isVisible().catch(() => false)) {
          await moveCursorTo(page, summary, { durationMs: 800 });
          await page.waitForTimeout(1600);
        }
        const conditions = page.getByRole("heading", { name: /conditions \/ restrictions/i });
        if (await conditions.isVisible().catch(() => false)) {
          await conditions.scrollIntoViewIfNeeded();
          await moveCursorTo(page, conditions, { durationMs: 800 });
          await page.waitForTimeout(1600);
        }
        // Approved footer — "✓ This candidate has been approved"
        // (ChecksPage.tsx:1290-1294, status completed + not not_cleared).
        const approvedFooter = page.getByText(/this candidate has been approved/i);
        if (await approvedFooter.isVisible().catch(() => false)) {
          await approvedFooter.scrollIntoViewIfNeeded();
          await page.waitForTimeout(1400);
        }
        await page.waitForTimeout(800);
      },
    },
    {
      id: "03-cases-list-auto-created-case",
      title: "Cases list: the auto-created case record, Medium risk pill beside the name",
      needsAuth: true,
      storageStatePath: employerAuthStatePath(EMPLOYER_ACTIVE),
      async run(page) {
        // The unified case/check list at "/" (CasesDashboard → CaseListView).
        await page.goto(`${DEFAULT_BASE_URL}/`, { waitUntil: "networkidle" });

        // The auto-created case row — data-testid="case-list-row-<id>"
        // (CaseListView.tsx:467), matched by worker name. This is where the
        // Low/Medium/High risk pill actually renders, right beside the name
        // (CaseListView.tsx:477-485) — see the chapter header's
        // risk-pill-placement note.
        const row = page
          .locator('[data-testid^="case-list-row-"]')
          .filter({ hasText: CH4_SEEDED_CHECK.candidateName })
          .first();
        await row.waitFor({ state: "visible", timeout: 15_000 });
        await page.waitForTimeout(1200);

        await moveCursorTo(page, row, { durationMs: 1000 });
        const ring = await ringAround(page, row, { paddingPx: 4 });
        // "A case record is created automatically, so everything about this
        // person stays in one place" — long hold with the Medium pill in
        // frame.
        await page.waitForTimeout(3600);
        await ring.remove();
        await page.waitForTimeout(800);
      },
    },
    // -- (outro card goes here in the edit — graphic, not captured) --
  ],
};

export default chapter;
