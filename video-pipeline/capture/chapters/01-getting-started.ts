import type { ChapterModule } from "../lib/recording";
import { DEFAULT_BASE_URL, PARTNER } from "../lib/demo-data";

/**
 * Chapter 1 — "Getting started".
 *
 * SCOPE NOTE (read before re-filming): `chapters.ts`'s comment for this
 * chapter describes trial signup (preventli.ai -> "Start free trial" ->
 * partner choice -> company size -> name/email/password) AS WELL AS login
 * and the workspace tour. This harness only automates the login + workspace
 * shots. Trial signup needs a fresh email each run and a real inbox to
 * click the verification link, which this pipeline deliberately does not
 * attempt (no mailbox access, and a hard-coded signup email would collide
 * on every re-run since accounts aren't deleted). Re-filming the signup
 * portion is a separate, still-manual beat — see docs/video-pipeline.md
 * "Known gaps". None of the 6 confirmed defects require re-shooting signup.
 *
 * This is also the ONLY chapter that shows login — every other chapter
 * loads an already-authenticated storageState (see capture/lib/auth.ts),
 * which is what fixes defect #1 ("chapter 2 opens by redundantly
 * re-showing login").
 */
const chapter: ChapterModule = {
  chapterId: "01-getting-started",
  shots: [
    {
      id: "01-login",
      title: "Real UI login (the only chapter that shows this)",
      needsAuth: false,
      async run(page) {
        await page.goto(`${DEFAULT_BASE_URL}/login`, { waitUntil: "domcontentloaded" });
        // Hold on the empty login form before touching it, so the viewer sees
        // the starting state rather than a pre-filled box.
        await page.waitForTimeout(1200);

        // pressSequentially, NOT fill — found 2026-07-27 watching the cut with
        // narration over it: fill() sets the input's value in a single frame,
        // so the credentials simply appear and the narration ("this is where
        // you sign in") describes typing that is never visible. Typing
        // per-character is the whole point of this shot.
        const emailField = page.getByLabel(/email/i);
        await emailField.click();
        await emailField.pressSequentially(PARTNER.loginEmail, { delay: 45 });
        await page.waitForTimeout(500);

        // Not getByLabel — see the a11y-bug note in capture/lib/auth.ts.
        const passwordField = page.locator('input[type="password"]');
        await passwordField.click();
        await passwordField.pressSequentially(PARTNER.loginPassword, { delay: 45 });
        await page.waitForTimeout(800);

        await page.getByRole("button", { name: /sign in/i }).click();
        await page.waitForURL(/\/partner\/clients/, { timeout: 30_000 });
        // Hold a beat on the freshly-loaded workspace so the cut from
        // "login" to "workspace" isn't jarring once narration is laid over
        // it. This is a deliberate framing pause, not a correctness wait —
        // flagged per the "no wall-clock-dependent assertions" rule so
        // reviewers can tell the difference from a real wait-condition.
        await page.waitForTimeout(1500);
      },
    },
    {
      id: "02-workspace-tour",
      title: "Partner workspace: all clients, one view",
      needsAuth: true,
      async run(page) {
        await page.goto(`${DEFAULT_BASE_URL}/partner/clients`, { waitUntil: "networkidle" });
        await page.getByTestId("sidebar-all-clients").waitFor({ state: "visible" });
        await page.getByTestId("sidebar-all-clients").click();
        await page.waitForTimeout(1500);

        // Real movement across the things the narration names, rather than a
        // 1.8s still that then has to be stretched 4x and freeze-padded
        // (Paul, 2026-07-27: the back half of chapter 1 was a frozen frame).
        // Each hover is a beat the voice-over can land on: clients rail,
        // then the risk filter, then the rows themselves.
        const clientRail = page.getByText("Coastline Aged Care Group", { exact: false }).first();
        if (await clientRail.isVisible().catch(() => false)) {
          await clientRail.hover();
          await page.waitForTimeout(1600);
        }

        const riskFilter = page.getByText(/all risk levels/i).first();
        if (await riskFilter.isVisible().catch(() => false)) {
          await riskFilter.hover();
          await page.waitForTimeout(1600);
        }

        const riskSort = page.getByTestId("sort-riskLevel");
        if (await riskSort.isVisible().catch(() => false)) {
          await riskSort.hover();
          await page.waitForTimeout(1400);
        }

        // Settle on the rows themselves — the "anything needing you is
        // flagged right here" beat.
        const firstRow = page.getByText(/ready to review/i).first();
        if (await firstRow.isVisible().catch(() => false)) {
          await firstRow.hover();
          await page.waitForTimeout(2000);
        }
        await page.waitForTimeout(1200);
      },
    },
  ],
};

export default chapter;
