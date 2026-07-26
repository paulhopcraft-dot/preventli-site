import type { ChapterModule } from "../lib/recording";
import { DEFAULT_BASE_URL } from "../lib/demo-data";

/**
 * Chapter 5 — "Clinical review & client notification".
 *
 * SCOPE LIMIT, load-bearing — read before assuming this chapter is fully
 * automated:
 *
 * Fixing defect #7 means showing the PARTNER's own "Reports awaiting your
 * approval" card (verified live in `PartnerReportApprovalSection`,
 * `client/src/pages/PartnerWorkspace.tsx:1266`, rendered inline on
 * `/partner/clients` whenever `reports.length > 0`) instead of Preventli's
 * internal admin queue (`/report-review`), which is what the CURRENT
 * shipped video wrongly shows.
 *
 * But everything upstream of that card — the report being DRAFTED and
 * CLINICALLY REVIEWED — is GPNet clinical staff's job, a different actor
 * (`workflow.ts`'s `"gpnet"` actor, distinct from `"partner"`) with no
 * seeded login in `server/seed-demo-partner.ts` (which only creates ONE
 * partner org + ONE partner user). This harness authenticates as the
 * partner only. It cannot drive the clinical-review side, so it cannot by
 * itself get a report into the "awaiting your approval" state.
 *
 * There's also a live, open, documented product bug in the way even if a
 * clinician account existed: the audit records `reportUrl` /
 * `questionnairePdfUrl` as NULL after submission — the report PDF fails to
 * generate — "still open as of this writing" (audit finding 3.6). So a
 * fresh capture run may find the approval card permanently empty
 * regardless of how far a human clinician gets, until that's fixed.
 *
 * What this chapter DOES do: opens the partner dashboard and captures
 * whatever state the approval card is actually in — populated (if a
 * report happens to be ready, e.g. from prior seeded/manual clinical
 * activity against the same DB) or genuinely absent. It does not fabricate
 * report data to force the card to appear, and it fails loudly rather than
 * hanging if the card never shows up, so a dry run can't be mistaken for a
 * real capture. Actually filming the approve click needs a human (or a
 * separate, not-yet-built clinician-side script) to first push at least
 * one report into "pending partner approval" — see
 * docs/video-pipeline.md "Known gaps".
 */
const chapter: ChapterModule = {
  chapterId: "05-clinical-review",
  shots: [
    {
      id: "01-partner-approval-card",
      title: "Partner's own 'Reports awaiting your approval' card (fixes defect #7)",
      needsAuth: true,
      async run(page) {
        await page.goto(`${DEFAULT_BASE_URL}/partner/clients`, { waitUntil: "networkidle" });
        const card = page.getByText(/Reports awaiting your approval/i);
        const appeared = await card.waitFor({ state: "visible", timeout: 15_000 }).then(
          () => true,
          () => false,
        );
        if (!appeared) {
          throw new Error(
            'The "Reports awaiting your approval" card never appeared. This requires a report already ' +
              "in pending-partner-approval state, which the partner-only demo login used by this harness " +
              "cannot itself produce (needs GPNet clinical review first — see this file's header comment " +
              'and docs/video-pipeline.md "Known gaps"). Not a script bug — this is the harness correctly ' +
              "refusing to fake a state that isn't real.",
          );
        }
        await page.waitForTimeout(2000);
      },
    },
    {
      id: "02-approve-report",
      title: "Approve a ready report — sends the client notification",
      needsAuth: true,
      async run(page) {
        await page.goto(`${DEFAULT_BASE_URL}/partner/clients`, { waitUntil: "networkidle" });
        const approveButton = page.getByRole("button", { name: /^approve$/i }).first();
        await approveButton.waitFor({ state: "visible", timeout: 15_000 });
        await page.waitForTimeout(1000); // frame the row before clicking
        await approveButton.click();
        await page.waitForTimeout(2000);
      },
    },
  ],
};

export default chapter;
