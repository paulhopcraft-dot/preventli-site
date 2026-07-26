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
        await page.getByLabel(/email/i).fill(PARTNER.loginEmail);
        await page.getByLabel(/password/i).fill(PARTNER.loginPassword);
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
        await page.waitForTimeout(1000);
      },
    },
  ],
};

export default chapter;
