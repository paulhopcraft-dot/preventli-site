import path from "node:path";
import type { ChapterModule } from "../lib/recording";
import { DEFAULT_BASE_URL, NEW_CLIENT } from "../lib/demo-data";

const FIXTURES_DIR = path.join(__dirname, "..", "fixtures");

/**
 * Chapter 2 — "Setting up a client".
 *
 * Follows docs/partner-onboarding-chapter2-rerecord-brief.md's shot list,
 * with one deliberate deviation from its literal casting instruction — see
 * the note on shot 02 below. Selectors verified 2026-07-27 by reading
 * `preventli` at `origin/main` (aa9be4c): client/src/components/partner/
 * ClientSetupForm.tsx and JobDescriptionUpload.tsx. NOT click-verified
 * against a running instance — see docs/video-pipeline.md "What's unproven".
 *
 * Fixes:
 *  - Defect #1 (redundant re-login): this chapter's context loads with
 *    needsAuth: true and opens straight on /partner/clients. No login UI
 *    is ever rendered here.
 *  - Defect #2 (only one JD uploaded): shot 03 selects 3 files at once.
 *  - Defect #3 (two-step upload trap silently discards files): shot 03
 *    narrates and clicks "Upload N file(s)" (jd-upload-submit), never the
 *    green "Done" (jd-step-done) until after the real save succeeded.
 */
const chapter: ChapterModule = {
  chapterId: "02-setting-up-a-client",
  shots: [
    {
      id: "01-open-workspace",
      title: "Open already inside the workspace — no login shown",
      needsAuth: true,
      async run(page) {
        await page.goto(`${DEFAULT_BASE_URL}/partner/clients`, { waitUntil: "networkidle" });
        await page.getByTestId("add-client-button").waitFor({ state: "visible" });
      },
    },
    {
      id: "02-add-client-dialog",
      title: "Add a client — only the name is required",
      needsAuth: true,
      async run(page) {
        await page.goto(`${DEFAULT_BASE_URL}/partner/clients`, { waitUntil: "networkidle" });
        await page.getByTestId("add-client-button").click();
        // DEVIATION FROM THE BRIEF'S LITERAL CASTING, documented not silent:
        // the brief's shot list names "Coastline Aged Care Group" as the
        // client to type here, but server/seed-demo-partner.ts already
        // seeds a client with that exact name (with Priya Nair's in-progress
        // check attached) — typing it again here would create a confusing
        // SECOND "Coastline Aged Care Group" org rather than reusing the
        // seeded one, and the seed is idempotent/additive so a second run
        // of this shot would create a third, etc. Using a distinct new name
        // (NEW_CLIENT, "Northgate Distribution Centre") demonstrates the
        // exact same UI mechanic (only-name-required) without the
        // duplicate-org side effect. The Coastline + Priya Nair + PCA-JD
        // pairing the brief cares about for role/JD coherence is used
        // in chapter 3 instead, where it's already correctly seeded.
        await page.getByTestId("field-name").fill(NEW_CLIENT.name);
        await page.getByTestId("submit-client").click();
        // Deterministic wait: the post-create step (createdClientId set)
        // renders the JD-upload dialog with this exact copy.
        await page.getByText(/Add job description PDFs for this client now/i).waitFor({ state: "visible" });
      },
    },
    {
      id: "03-batch-upload-two-step-trap",
      title: "Batch-upload 3 JDs; narrate the staged-vs-saved trap; click Upload, not Done",
      needsAuth: true,
      async run(page) {
        // Continues from shot 02's state. Re-run standalone by re-creating
        // the client first if filming this shot in isolation (see
        // docs/video-pipeline.md "Re-running a single shot").
        await page.goto(`${DEFAULT_BASE_URL}/partner/clients`, { waitUntil: "networkidle" });
        const alreadyOpen = await page.getByTestId("jd-upload-select-files").isVisible().catch(() => false);
        if (!alreadyOpen) {
          await page.getByTestId("add-client-button").click();
          await page.getByTestId("field-name").fill(NEW_CLIENT.name);
          await page.getByTestId("submit-client").click();
          await page.getByTestId("jd-upload-select-files").waitFor({ state: "visible" });
        }

        const files = [
          "warehouse-operator-position-description.pdf",
          "forklift-driver-position-description.pdf",
          "logistics-coordinator-position-description.pdf",
        ].map((f) => path.join(FIXTURES_DIR, f));

        await page.getByTestId("jd-upload-select-files").click();
        // The visible button opens a hidden <input type=file multiple>;
        // Playwright can set files on it directly without a native file
        // picker dialog (see JobDescriptionUpload.tsx's hidden input).
        await page.locator('input[type="file"][accept*="pdf"]').setInputFiles(files);

        // Three staged rows now show, each with an editable title + an
        // Upload button below reading "Upload 3 file(s)" — and separately,
        // in the dialog footer, the bright-green "Done" button
        // (jd-step-done) that looks like the natural next step but
        // actually discards everything staged. Hover it briefly so the
        // recording visibly frames the trap for narration, WITHOUT
        // clicking it.
        await page.getByTestId("jd-title-input-0").waitFor({ state: "visible" });
        await page.getByTestId("jd-step-done").hover();
        await page.waitForTimeout(1200);

        // Click the real save action.
        await page.getByTestId("jd-upload-submit").click();
        await page.getByText(/Job descriptions uploaded/i).waitFor({ state: "visible", timeout: 15_000 });

        // Only now, with the upload visibly succeeded, close the dialog.
        await page.getByTestId("jd-step-done").click();
      },
    },
    {
      id: "04-clients-table-risk-column",
      title: "Clients/checks table — confirm current Risk column, not the video's missing one",
      needsAuth: true,
      async run(page) {
        await page.goto(`${DEFAULT_BASE_URL}/partner/clients`, { waitUntil: "networkidle" });
        await page.getByTestId("sidebar-all-clients").click();
        await page.getByText("Risk", { exact: true }).first().waitFor({ state: "visible" });
        await page.waitForTimeout(1500);
      },
    },
    // "Ask Alex" closing beat (item 8 in the brief) is deliberately NOT
    // implemented here — the brief marks it BLOCKED (Alex gives a factually
    // wrong answer to "How do I add a job description?" as of 2026-07-26).
    // Do not add this shot until that's independently resolved; see
    // docs/video-pipeline.md "Known gaps".
  ],
};

export default chapter;
