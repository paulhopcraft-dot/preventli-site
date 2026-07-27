import { existsSync, readFileSync } from "node:fs";
import type { ChapterModule } from "../lib/recording";
import { CASTING, DEFAULT_BASE_URL } from "../lib/demo-data";
import { LAST_ASSESSMENT_STATE_PATH } from "./03-creating-and-sending-checks";

/**
 * Chapter 4 — "The candidate experience".
 *
 * IMPORTANT, VERIFIED FINDING (2026-07-27) THAT CHANGES THIS CHAPTER'S
 * SCOPE FROM WHAT THE AUDIT DESCRIBES — read before touching this file:
 *
 * The audit's chapter-4 findings (stale "Page 9 of 9" counter, missing
 * 90-question JD-driven middle, 26 role-fit questions from JD extraction)
 * are about `DynamicCheckForm.tsx`, which `PublicCheckRouter.tsx` only
 * renders when an assessment's server response carries a non-null
 * `formDefinition` — i.e. the assessment was created against a
 * `check_form_templates` row. A real search of `preventli` at
 * `origin/main` (aa9be4c) — every route file, `server/routes/assessments.ts`
 * (the handler `POST /api/assessments`, i.e. the "Send a check" flow chapter
 * 3 uses, actually calls) in full, and every `.ts`/`.tsx` file repo-wide for
 * "checkFormTemplates" — found NO code path that attaches a formDefinition
 * to an assessment created this way. The only three hits repo-wide are
 * `server/storage.ts`, `shared/schema.ts`, and a unit test — no route, no
 * UI. Assessments created through "Send a check" instead populate the
 * legacy `preEmploymentAssessments` row, which `PublicCheckRouter` renders
 * with `PreEmploymentForm.tsx` — an 8-STEP wizard ("Step X of 8":
 * Personal Information, Work History, Occupational Health, Medical
 * Conditions, Functional Capacity, Psychological Wellbeing, Family &
 * Vaccination, Lifestyle & Review), not the paginated JD-driven flow.
 *
 * CONSEQUENCE: this harness cannot film the DynamicCheckForm/10-page/
 * 26-question flow, because — as far as this search could establish — no
 * currently-live partner UI path reaches it. If it's reachable some other
 * way (an admin-only creation path, a not-yet-merged PR, something this
 * search missed), re-point this chapter at it once that path is confirmed;
 * until then, treat "defect #4 (stale page counter)" as NOT fixable by
 * re-filming, because the counter this shot can actually reach
 * (PreEmploymentForm's "Step X of 8") isn't the one the audit flagged.
 * Defect #6 (missing substantive middle) — this chapter DOES fix, by
 * filming real content across all 8 steps instead of only the first and
 * last. See docs/video-pipeline.md "Known gaps" for the full writeup.
 *
 * Requires chapter 3 to have run first in the same capture session/DB
 * state (see LAST_ASSESSMENT_STATE_PATH) — this is the one cross-chapter
 * dependency in the whole harness.
 */
const chapter: ChapterModule = {
  chapterId: "04-candidate-experience",
  // ONE shot, not three — same architectural fix as chapter 3. Found live
  // 2026-07-27: each shot gets its own fresh, unnavigated browser context
  // (capture/lib/recording.ts), so shot 02 as originally written opened on
  // a blank page and immediately waited for "Step 2 of 8", which could
  // never appear. All three original shots assumed continuation the
  // harness never provided.
  shots: [
    {
      id: "01-full-candidate-flow",
      title: "Candidate opens the link, fills all 8 steps, submits",
      needsAuth: false, // deliberately: candidates are never logged-in partner users
      async run(page) {
        if (!existsSync(LAST_ASSESSMENT_STATE_PATH)) {
          throw new Error(
            `${LAST_ASSESSMENT_STATE_PATH} not found. Run chapter 03 first — its "Create Assessment" shot ` +
              `captures the candidate's access token, which this chapter needs to open /check/:token.`,
          );
        }
        const state = JSON.parse(readFileSync(LAST_ASSESSMENT_STATE_PATH, "utf8")) as { accessToken: string };

        await page.goto(`${DEFAULT_BASE_URL}/check/${state.accessToken}`, { waitUntil: "networkidle" });
        await page.getByText(/Step 1 of 8/i).waitFor({ state: "visible", timeout: 15_000 });

        // firstName/lastName/roleAppliedFor are pre-filled server-side from
        // the assessment (PreEmploymentForm.tsx ~line 285); email,
        // companyName, age and gender are not, and step 1 hard-requires
        // them (validateCurrentStep, case 1) before "Next" will advance.
        await page.locator("#email").fill(CASTING.candidate.email);
        await page.locator("#companyName").fill(CASTING.existingClient.name);
        await page.locator("#age").fill("34");
        await page.locator("#woman").check();
        await page.waitForTimeout(1000);
        await page.getByRole("button", { name: /^next$/i }).click();

        // UNVERIFIED ASSUMPTION (flagged, not silently relied on): steps
        // 2-7 have no required-field validation — confirmed by reading
        // `validateCurrentStep`'s switch statement, which only has a
        // `case 1` and a comment "// Add validation for other steps as
        // needed" for the rest. If a live run finds a step DOES block
        // "Next", the fix is in that switch case in
        // client/src/pages/PreEmploymentForm.tsx, not in this script.
        for (let step = 2; step <= 7; step++) {
          await page.getByText(new RegExp(`Step ${step} of 8`, "i")).waitFor({ state: "visible", timeout: 10_000 });
          // Hold on each step long enough to read on camera.
          await page.waitForTimeout(2500);
          await page.getByRole("button", { name: /^next$/i }).click();
        }

        await page.getByText(/Step 8 of 8/i).waitFor({ state: "visible", timeout: 10_000 });
        await page.waitForTimeout(2000);
        await page.getByRole("button", { name: /submit assessment/i }).click();
        await page
          .getByText(/submitted successfully/i)
          .waitFor({ state: "visible", timeout: 20_000 });
        await page.waitForTimeout(1500);
      },
    },
  ],
};

export default chapter;
