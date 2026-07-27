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
        // Hold on the empty dialog first so the viewer sees the form's
        // starting state, then type per-character rather than fill()-ing in a
        // single invisible frame (Paul, 2026-07-27: "you don't even show any
        // of the entry fields").
        // Trimmed 2026-07-27: at 1800/55ms/1600 this shot ran 7.7s against a
        // 4.0s narration slice ("Enter the client company name,"). Shots are
        // never sped up, so the overrun pushed every later beat late. These
        // holds keep the dialog readable while fitting the line.
        await page.waitForTimeout(800);
        const nameField = page.getByTestId("field-name");
        await nameField.click();
        await nameField.pressSequentially(NEW_CLIENT.name, { delay: 35 });
        await page.waitForTimeout(700);
      },
    },
    {
      id: "03-contact-and-notification-email",
      title: "Fill the primary contact and the notification email the reports go to",
      needsAuth: true,
      async run(page) {
        // Split out of the name shot 2026-07-27. Verified by frame that the
        // combined shot drifted ~2s through this stretch: at 15s the voice
        // said "that notification email is the important one" while the
        // cursor was still in the PRIMARY CONTACT email and the notification
        // field sat visibly empty below it. Giving the contact fields their
        // own shot lets them be timed to their own slice of narration.
        //
        // A fresh context means the dialog isn't open, so it is re-opened and
        // the name re-entered quickly (fill, not per-character) — that part is
        // already covered by the previous shot and doesn't need re-narrating.
        await page.goto(`${DEFAULT_BASE_URL}/partner/clients`, { waitUntil: "networkidle" });
        await page.getByTestId("add-client-button").click();
        await page.getByTestId("field-name").fill(NEW_CLIENT.name);
        await page.waitForTimeout(150);

        // Primary contact + notification email — Paul, 2026-07-27: showing
        // ONLY the company name is technically accurate (it's the sole
        // required field) but it's bad guidance. Without a client contact
        // email the approved report has nowhere to go, and the form does not
        // warn about it; the send just fails later. A "normal setup" on
        // camera therefore fills the contact and notification email too.
        const contactName = page.locator("#contactName");
        await contactName.scrollIntoViewIfNeeded();
        await contactName.click();
        // Lead-in deliberately brisk, hold saved for the notification field.
        // Measured 2026-07-27: at the previous pacing the notification field
        // wasn't reached until ~16.9s, while the narration names it at
        // 13.7–16.5s ("that notification email is the important one") — the
        // one line Paul specifically asked to land. Contact name/email are
        // supporting detail and are typed faster so the money shot arrives
        // on cue.
        await contactName.pressSequentially(NEW_CLIENT.contactName, { delay: 25 });
        await page.waitForTimeout(300);

        const contactEmail = page.locator("#contactEmail");
        await contactEmail.click();
        await contactEmail.pressSequentially(NEW_CLIENT.contactEmail, { delay: 16 });
        await page.waitForTimeout(400);

        const notifyEmails = page.getByTestId("field-notification-emails");
        await notifyEmails.scrollIntoViewIfNeeded();
        await notifyEmails.click();
        await notifyEmails.pressSequentially(NEW_CLIENT.contactEmail, { delay: 32 });
        await page.waitForTimeout(2200);

        await page.getByTestId("submit-client").click();
        // Deterministic wait: the post-create step (createdClientId set)
        // renders the JD-upload dialog with this exact copy.
        await page.getByText(/Add job description PDFs for this client now/i).waitFor({ state: "visible" });
        // Hold on the empty dialog long enough to actually read it — this
        // shot previously ended the instant it appeared, giving a viewer
        // zero time to see it (Paul's feedback 2026-07-27: "I can't even
        // see where to add the job descriptions").
        await page.waitForTimeout(2500);
      },
    },
    {
      id: "04-batch-upload-two-step-trap",
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
        // Hold on the 3 staged files before hovering the trap button — the
        // previous 1200ms combined hold wasn't enough to read three rows of
        // filenames. Bumped 2026-07-27 per the same feedback as above.
        await page.waitForTimeout(2000);
        await page.getByTestId("jd-step-done").hover();
        await page.waitForTimeout(2000);

        // Click the real save action.
        await page.getByTestId("jd-upload-submit").click();
        // .first() — an aria-live status region echoes the same toast text,
        // so the plain text locator matches twice (strict-mode violation,
        // found live 2026-07-27). Confirmed the echoed toast itself reads
        // "3 file(s)" — the batch upload is working as intended.
        await page.getByText(/Job descriptions uploaded/i).first().waitFor({ state: "visible", timeout: 15_000 });

        // Only now, with the upload visibly succeeded, close the dialog.
        await page.getByTestId("jd-step-done").click();
      },
    },
    {
      id: "05-clients-table-risk-column",
      title: "Clients/checks table — confirm current Risk column, not the video's missing one",
      needsAuth: true,
      async run(page) {
        await page.goto(`${DEFAULT_BASE_URL}/partner/clients`, { waitUntil: "networkidle" });
        await page.getByTestId("sidebar-all-clients").click();
        // Not a "Risk" text wait — found live 2026-07-27: this table's
        // header is WORKER/TYPE/CLIENT/LAST ACTIVITY/NEXT ACTION with no
        // literal "Risk" column at all. Risk shows as an inline pill next
        // to the worker's name, but only once a check has a computed risk
        // level — every row in a freshly seeded tenant is still "Waiting
        // on worker", before that exists. Waiting on a column header that
        // is always present instead.
        // Case-insensitive, not exact: the header is CSS `uppercase`
        // (visually "NEXT ACTION") but the DOM text content is "Next
        // action" — an exact-match locator against the rendered casing
        // never matches. Found live 2026-07-27.
        await page.getByText(/next action/i).waitFor({ state: "visible" });
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
