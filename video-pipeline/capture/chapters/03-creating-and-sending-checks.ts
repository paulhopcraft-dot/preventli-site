import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { ChapterModule } from "../lib/recording";
import { CASTING, DEFAULT_BASE_URL } from "../lib/demo-data";

/**
 * Chapter 4 needs the candidate's magic-link token to open
 * `/check/:token` as an unauthenticated candidate would. The partner UI
 * never displays it (by design — `GET /api/assessments` explicitly
 * excludes accessToken, per server/routes/assessments.ts:307), but the
 * `POST /api/assessments` response the "Create Assessment" click triggers
 * DOES include it (NewAssessmentPage.tsx's own `AssessmentDraft.accessToken`
 * field is populated straight from that response). Shot 03 below intercepts
 * that one response with Playwright's `waitForResponse` and writes it here
 * so chapter 4 can pick it up — this is the ONLY link between chapters in
 * this harness; every other chapter/shot is independently runnable.
 */
export const LAST_ASSESSMENT_STATE_PATH = path.join(
  __dirname, "..", "..", "output", ".state", "last-assessment.json",
);

/**
 * Chapter 3 — "Creating and sending checks".
 *
 * Casts the seeded Coastline Aged Care Group / Priya Nair / "Personal Care
 * Assistant" pairing (server/seed-demo-partner.ts), per
 * docs/partner-onboarding-chapter2-rerecord-brief.md's "what happens next,
 * in chapter 3" section (items 8-9 of that doc).
 *
 * DEVIATION FROM THE BRIEF, documented not silent: that doc expects the
 * "Saved job description" dropdown to list THREE titles, because its
 * chapter-2 shot list assumed the batch-of-3 upload would land on
 * Coastline itself. This harness's chapter 2 uploads the batch of 3 to a
 * freshly-created client instead (see 02-setting-up-a-client.ts for why),
 * so Coastline still has exactly the ONE JD the seed gives it
 * ("Personal Care Assistant — Position Description"). The dropdown will
 * show one option, not three. This still proves the real thing the brief
 * cares about — a saved JD picked from the library, visibly paired with a
 * matching role/candidate — just with one entry instead of three.
 *
 * Fixes:
 *  - Item 8 (brief): picks the saved JD from the dropdown, same role name
 *    as the badge, same JD title — visibly paired.
 *  - Item 9 (brief): films the send confirmation as a genuine two-step
 *    ("Create Assessment" only creates; a separate "Send to Worker" click
 *    is the real send) — the workflow map's "Secure link, straight away"
 *    copy is misleading and this shot is why.
 *  - Item 10 (brief): does NOT film or narrate JD-driven extracted
 *    requirements. `requirementsExtractionStatus` is intentionally left
 *    alone here — this shot only proves the JD is attached, not that its
 *    contents were parsed into questions.
 */
const chapter: ChapterModule = {
  chapterId: "03-creating-and-sending-checks",
  shots: [
    {
      id: "01-select-client-and-open-new-check",
      title: "Select Coastline Aged Care Group, open New -> Send a check",
      needsAuth: true,
      async run(page) {
        await page.goto(`${DEFAULT_BASE_URL}/partner/clients`, { waitUntil: "networkidle" });
        await page.getByText(CASTING.existingClient.name, { exact: false }).first().click();
        await page.getByTestId("new-action-button").waitFor({ state: "visible" });
        await page.getByTestId("new-action-button").click();
        await page.getByTestId("new-action-check").click();
        // swapAndNavigate() (PartnerWorkspace.tsx) swaps the active org
        // server-side then routes to /checks — land there before jumping
        // straight to the assessment form, so the org-swap has definitely
        // committed server-side (NewAssessmentPage has no orgId of its own
        // in the URL; it trusts the swapped session).
        await page.waitForURL(/\/checks/, { timeout: 15_000 });
      },
    },
    {
      id: "02-new-check-form-with-saved-jd",
      title: "Fill candidate details; pick the saved PCA job description",
      needsAuth: true,
      async run(page) {
        await page.goto(`${DEFAULT_BASE_URL}/assessments/new?type=pre_employment`, {
          waitUntil: "networkidle",
        });
        await page.locator("#candidateName").fill(CASTING.candidate.name);
        await page.locator("#candidateEmail").fill(CASTING.candidate.email);
        await page.locator("#positionTitle").fill(CASTING.candidate.role);

        const savedJdSelect = page.getByTestId("saved-job-description-select");
        await savedJdSelect.waitFor({ state: "visible" });
        await savedJdSelect.click();
        await page
          .getByText(CASTING.jobDescriptions[0].title, { exact: false })
          .first()
          .click();
        await page.waitForTimeout(1000); // frame the pairing on screen before submitting
      },
    },
    {
      id: "03-create-then-two-step-send",
      title: '"Create Assessment" only creates; "Send to Worker" is the real send',
      needsAuth: true,
      async run(page) {
        // Continues shot 02's state if run as part of a full chapter take;
        // re-fill from scratch if run standalone.
        const nameField = page.locator("#candidateName");
        if (!(await nameField.inputValue().catch(() => ""))) {
          await page.goto(`${DEFAULT_BASE_URL}/assessments/new?type=pre_employment`, {
            waitUntil: "networkidle",
          });
          await page.locator("#candidateName").fill(CASTING.candidate.name);
          await page.locator("#candidateEmail").fill(CASTING.candidate.email);
          await page.locator("#positionTitle").fill(CASTING.candidate.role);
          const savedJdSelect = page.getByTestId("saved-job-description-select");
          await savedJdSelect.click();
          await page.getByText(CASTING.jobDescriptions[0].title, { exact: false }).first().click();
        }

        const [createResponse] = await Promise.all([
          page.waitForResponse((r) => r.url().includes("/api/assessments") && r.request().method() === "POST"),
          page.getByRole("button", { name: /create assessment/i }).click(),
        ]);
        const created = await createResponse.json().catch(() => null);
        if (created?.accessToken) {
          mkdirSync(path.dirname(LAST_ASSESSMENT_STATE_PATH), { recursive: true });
          writeFileSync(
            LAST_ASSESSMENT_STATE_PATH,
            JSON.stringify(
              {
                accessToken: created.accessToken,
                candidateName: CASTING.candidate.name,
                capturedAt: new Date().toISOString(),
              },
              null,
              2,
            ),
          );
        } else {
          console.warn(
            "[chapter-03] Create-assessment response had no accessToken — chapter 4 will not have a link to open. " +
              "Response body: " + JSON.stringify(created),
          );
        }
        await page.getByText("Ready to send", { exact: true }).waitFor({ state: "visible", timeout: 15_000 });

        // Frame both buttons on screen for narration before clicking either.
        await page.getByRole("button", { name: /not now/i }).waitFor({ state: "visible" });
        await page.getByRole("button", { name: /send to worker/i }).waitFor({ state: "visible" });
        await page.waitForTimeout(1500);

        await page.getByRole("button", { name: /send to worker/i }).click();
        await page.getByText(/Questionnaire sent!/i).waitFor({ state: "visible", timeout: 15_000 });
      },
    },
  ],
};

export default chapter;
