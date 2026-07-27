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
  // ONE shot, not three. Found live 2026-07-27: each shot in this harness
  // gets a brand-new browser context restored from the pre-login
  // storageState snapshot (capture/lib/recording.ts) — so the server-side
  // "active client" swap that clicking "new-pre-employment-check-button"
  // triggers (swapAndNavigate() in PartnerWorkspace.tsx) does NOT carry
  // over to a later shot's fresh context. Splitting this chapter into
  // separately-runnable shots was never viable once that button existed;
  // the original 3-shot split (and its "if not already filled" fallback
  // in what was shot 03) both silently assumed continuation that the
  // harness's per-shot-context design doesn't provide. One continuous
  // shot is also the more honest capture of the real thing: a partner
  // does this in one unbroken session, not three separate page loads.
  shots: [
    {
      id: "01-select-client-and-new-check",
      title: "Select the client from the partner list, then start a new check",
      needsAuth: true,
      async run(page) {
        await page.goto(`${DEFAULT_BASE_URL}/partner/clients`, { waitUntil: "networkidle" });
        await page.getByText(CASTING.existingClient.name, { exact: false }).first().click();
        // Single button, not a "New" -> "Send a check" two-step menu — that
        // assumed shape came from the pre-existing brief and was never
        // click-verified. Found live 2026-07-27: one button,
        // data-testid="new-pre-employment-check-button".
        await page.getByTestId("new-pre-employment-check-button").waitFor({ state: "visible" });
        await page.getByTestId("new-pre-employment-check-button").click();
        // swapAndNavigate() swaps the active org server-side then routes to
        // /checks — land there before jumping to the assessment form, so
        // the org-swap has definitely committed server-side.
        await page.waitForURL(/\/checks/, { timeout: 15_000 });
        await page.waitForTimeout(1200);
      },
    },
    {
      id: "02-fill-and-send",
      title: "Fill the candidate details, pick the saved JD, create, then Send to Worker",
      needsAuth: true,
      async run(page) {
        // Split out of the single continuous shot 2026-07-27. The whole
        // chapter used to be one take slowed by one uniform factor, so the
        // narration ran ~4s ahead of the picture through the middle — the
        // voice reached "then choose the job description" while the role was
        // still being typed. Two shots let each be timed to its own slice of
        // narration, the same fix that cleaned up chapter 1.
        //
        // A fresh context restores the PRE-swap storageState, so the active
        // org has to be re-swapped before the form will resolve this client's
        // saved JDs. Done over the API rather than by re-walking the UI, so
        // the recording opens straight on the form instead of repeating
        // shot 1's navigation on camera.
        // page.request, NOT page.evaluate — page.evaluate needs the page
        // parked on the app origin, and that goto('/partner/clients') was
        // being RECORDED, replaying shot 1's workspace at the head of this
        // shot and shoving every later beat out of sync (found live
        // 2026-07-27: frame at 14s was the workspace, not the form).
        // page.request shares the context's cookie jar and performs no
        // navigation, so nothing extra lands on camera.
        const clientsRes = await page.request.get(`${DEFAULT_BASE_URL}/api/partner/clients`);
        const clientsBody = await clientsRes.json();
        const clientList: Array<{ id?: string; name?: string }> = Array.isArray(clientsBody)
          ? clientsBody
          : (clientsBody.clients ?? []);
        const orgId = clientList.find((c) => (c.name ?? "").includes(CASTING.existingClient.name))?.id;
        if (!orgId) throw new Error(`Could not resolve org id for ${CASTING.existingClient.name}`);

        // CSRF comes from GET /api/csrf-token and goes back as the
        // X-CSRF-Token header — it is NOT a readable cookie (found live
        // 2026-07-27: reading document.cookie gave nothing and the swap
        // 403'd). Mirrors client/src/lib/queryClient.ts's fetchWithCsrf.
        const tokenRes = await page.request.get(`${DEFAULT_BASE_URL}/api/csrf-token`);
        const tokenBody = await tokenRes.json().catch(() => null);
        const csrf = tokenBody?.data?.csrfToken ?? tokenBody?.csrfToken;
        const swapRes = await page.request.post(`${DEFAULT_BASE_URL}/api/partner/active-org`, {
          headers: { "Content-Type": "application/json", ...(csrf ? { "X-CSRF-Token": csrf } : {}) },
          data: { organizationId: orgId },
        });
        if (swapRes.status() >= 400) throw new Error(`active-org swap failed: HTTP ${swapRes.status()}`);

        await page.goto(`${DEFAULT_BASE_URL}/assessments/new?type=pre_employment`, {
          waitUntil: "networkidle",
        });
        // Typing is deliberately brisker than the first cut (55ms -> 30ms,
        // shorter holds): the three text fields ate ~8s of footage against
        // ~4s of narration, which is what pushed everything after them out of
        // sync. The saved-JD dropdown is where the hold belongs instead.
        // Second rebalance (2026-07-27): even after splitting the chapter,
        // the three text fields still ate ~10s of a 19.7s shot while the
        // narration allots them ~6s, so "then choose the job description"
        // still landed while the role was mid-type. Typing is faster again
        // and the reclaimed seconds are spent on the dropdown below, which is
        // the beat the narration actually dwells on.
        await page.waitForTimeout(600);
        const nameField = page.locator("#candidateName");
        await nameField.click();
        await nameField.pressSequentially(CASTING.candidate.name, { delay: 12 });
        await page.waitForTimeout(200);

        const emailField = page.locator("#candidateEmail");
        await emailField.click();
        await emailField.pressSequentially(CASTING.candidate.email, { delay: 8 });
        await page.waitForTimeout(200);

        const roleField = page.locator("#positionTitle");
        await roleField.click();
        await roleField.pressSequentially(CASTING.candidate.role, { delay: 12 });
        await page.waitForTimeout(300);

        // Proposed Start Date — a native <input type="date">; fill() with an
        // ISO value is the supported way to set one in Playwright.
        const startDate = page.locator('input[type="date"]').first();
        if (await startDate.isVisible().catch(() => false)) {
          await startDate.click();
          await startDate.fill("2026-08-17");
          await page.waitForTimeout(900);
        }

        // A shadcn/Radix Select — found live 2026-07-27: a
        // role="combobox" button trigger plus a portal-rendered listbox,
        // with a visually-hidden native <select> alongside it purely for
        // form semantics (that hidden select is what a plain text-content
        // match was actually resolving to, and neither .click() on an
        // <option> nor .selectOption() on the visible button works).
        // Correct pattern: open the trigger, click the rendered option.
        const savedJdSelect = page.getByTestId("saved-job-description-select");
        await savedJdSelect.waitFor({ state: "visible" });
        await savedJdSelect.click();
        // Hold with the dropdown OPEN so the saved job descriptions are
        // visibly listed before one is picked — the narration claims they're
        // "right there in the dropdown", so the dropdown has to be seen open.
        // Long hold with the list OPEN — this is where the narration dwells
        // ("the ones you uploaded earlier are right there in the dropdown"),
        // so it gets the seconds reclaimed from the typing above.
        await page.waitForTimeout(4200);
        await page.getByRole("option", { name: CASTING.jobDescriptions[0].title }).click();
        await page.waitForTimeout(3000); // frame the pairing on screen before submitting

        const [createResponse] = await Promise.all([
          page.waitForResponse((r) => r.url().includes("/api/assessments") && r.request().method() === "POST"),
          page.getByRole("button", { name: /create assessment/i }).click(),
        ]);
        const created = await createResponse.json().catch(() => null);
        // Nested under .assessment, not top-level — found live 2026-07-27:
        // the real response shape is { assessment: {...accessToken...},
        // worker: {...} }, not { accessToken, ... } directly.
        const accessToken = created?.assessment?.accessToken;
        if (accessToken) {
          mkdirSync(path.dirname(LAST_ASSESSMENT_STATE_PATH), { recursive: true });
          writeFileSync(
            LAST_ASSESSMENT_STATE_PATH,
            JSON.stringify(
              {
                accessToken,
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
