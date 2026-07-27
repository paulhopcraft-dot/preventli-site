import type { ChapterModule } from "../lib/recording";
import { DEFAULT_BASE_URL } from "../lib/demo-data";

/**
 * Chapter 5 — "Clinical review & client notification".
 *
 * REWRITTEN 2026-07-27 against the real approval screen shipped in
 * preventli #348 (`/partner/approvals/:id`, client/src/pages/
 * PartnerApprovalPage.tsx). The previous version predated that screen and
 * could only film the inline "awaiting your approval" card, then click a
 * bare Approve button — which is no longer how a partner signs a report off.
 *
 * What the current screen does, and what this chapter films:
 *   - the check awaiting the partner, on their own workspace
 *   - the candidate's questionnaire and the clinical report, each in its own
 *     tab, both readable before anything is sent
 *   - the recipient email the report will go to (prefilled from the client
 *     org's contact — the field chapter 2 insists on filling in)
 *   - a note that travels WITH the send to the client
 *   - the confirm step: nothing is emailed until it is explicitly confirmed
 *
 * PREREQUISITE, and the reason this chapter was blocked until now: the screen
 * only renders for an assessment with `reportStatus = "pending_partner_review"`
 * and a non-null `reportUrl`. Producing that for real needs the GPNet clinical
 * side — a different actor with no seeded login (server/seed-demo-partner.ts
 * creates one partner org and one partner user) — and report-PDF generation is
 * separately broken (audit finding 3.6). The capture DB is therefore prepared
 * by `_seed-ch5-approval.ts` in the preventli video-capture worktree, which
 * sets that state and writes clearly-labelled SAMPLE documents.
 *
 * This chapter still fails loudly rather than hanging if the state is absent,
 * so a dry run can never be mistaken for a real capture.
 */
const APPROVAL_ID = "assessment-demo-partner-stonebridge-security-services";

const chapter: ChapterModule = {
  chapterId: "05-clinical-review",
  shots: [
    {
      id: "01-approval-card-on-workspace",
      title: "The partner's own 'awaiting your approval' card, on their workspace",
      needsAuth: true,
      async run(page) {
        await page.goto(`${DEFAULT_BASE_URL}/partner/clients`, { waitUntil: "networkidle" });
        const card = page.getByText(/awaiting your approval/i).first();
        const appeared = await card.waitFor({ state: "visible", timeout: 15_000 }).then(
          () => true,
          () => false,
        );
        if (!appeared) {
          throw new Error(
            'The "awaiting your approval" card never appeared. It needs an assessment with ' +
              'reportStatus = "pending_partner_review" and a report on file. Run ' +
              "_seed-ch5-approval.ts in the preventli video-capture worktree first. " +
              "Failing loudly rather than filming an empty workspace.",
          );
        }
        await card.scrollIntoViewIfNeeded();
        await page.waitForTimeout(2600);
      },
    },
    {
      id: "02-read-both-documents",
      title: "Open the check — read the candidate's questionnaire, then the clinical report",
      needsAuth: true,
      async run(page) {
        await page.goto(`${DEFAULT_BASE_URL}/partner/approvals/${APPROVAL_ID}`, {
          waitUntil: "networkidle",
        });
        await page.getByTestId("partner-approval-page").waitFor({ state: "visible", timeout: 15_000 });
        await page.waitForTimeout(1800);

        // Questionnaire first — what the candidate actually answered.
        await page.getByTestId("approval-tab-questionnaire").click();
        await page.getByTestId("approval-questionnaire-frame").waitFor({ state: "visible", timeout: 15_000 });
        await page.waitForTimeout(3200);

        // Then the clinical report — the thing being signed off.
        await page.getByTestId("approval-tab-report").click();
        await page.getByTestId("approval-report-frame").waitFor({ state: "visible", timeout: 15_000 });
        await page.waitForTimeout(3400);
      },
    },
    {
      id: "03-recipient-note-and-send",
      title: "Check the recipient, add a note that travels with it, then confirm the send",
      needsAuth: true,
      async run(page) {
        await page.goto(`${DEFAULT_BASE_URL}/partner/approvals/${APPROVAL_ID}`, {
          waitUntil: "networkidle",
        });
        await page.getByTestId("partner-approval-page").waitFor({ state: "visible", timeout: 15_000 });

        // Recipient — prefilled from the client org's contact email.
        const recipient = page.getByTestId("approval-recipient");
        await recipient.scrollIntoViewIfNeeded();
        await page.waitForTimeout(2200);

        // The note goes to the client with the report — typed per-character so
        // it is visibly written, not pasted in one frame.
        const note = page.getByTestId("approval-note");
        await note.click();
        // Clear first: the field prefills from any note already stored on the
        // assessment, so re-running the capture appended and produced visibly
        // duplicated text on camera (found live 2026-07-27).
        await note.fill("");
        await note.pressSequentially(
          "Cleared for work, no restrictions. Standard manual-handling induction recommended.",
          { delay: 22 },
        );
        await page.waitForTimeout(1800);

        await page.getByTestId("approval-send").click();

        // Two-step by design: nothing is emailed until the confirm.
        const confirm = page.getByTestId("approval-confirm-send");
        await confirm.waitFor({ state: "visible", timeout: 10_000 });
        await page.waitForTimeout(2200);
        await confirm.click();
        await page.waitForTimeout(3000);
      },
    },
  ],
};

export default chapter;
