import path from "node:path";
import type { ChapterModule } from "../lib/recording";
import { DEFAULT_BASE_URL } from "../lib/demo-data";
import { CH2_CANDIDATE, EMPLOYER_ACTIVE } from "../lib/demo-employer-data";
import { employerAuthStatePath } from "../lib/employer-auth";
import { cursorClick, moveCursorTo, ringAround } from "../lib/annotate";

const FIXTURES_DIR = path.join(__dirname, "..", "fixtures");

/**
 * Employer chapter 2 — "Creating and sending checks".
 * Script: docs/onboarding-video-scripts-employer-v1.md, chapter 2 table.
 *
 * Logged in as EMPLOYER_ACTIVE ("Harbourline Distribution Pty Ltd") via
 * storageState — opens already signed in (standing rule 1). Requires
 * `preventli`'s server/seed-demo-employer.ts (parallel PR, unmerged).
 *
 * Same NewAssessmentPage flow the partner chapter-03 capture drove live on
 * its first real run (PR #24) — created→sent two-step state machine, POST
 * /api/assessments via waitForResponse — minus the partner-only active-org
 * swap (an employer session is always scoped to its own org, so no
 * /api/partner/active-org dance and no cross-shot swap coupling; each shot
 * here is fully self-contained via page.goto).
 *
 * SELECTOR DRIFT NOTE (why this file does NOT copy chapter-03 verbatim):
 * NewAssessmentPage's role control was reworked upstream since the partner
 * capture — the freeform "#positionTitle" input + separate
 * "saved-job-description-select" that 03-creating-and-sending-checks.ts
 * drives no longer exist on preventli main. The role is now ONE shadcn
 * Select (data-testid="role-select", NewAssessmentPage.tsx:452-475) whose
 * options are saved JDs plus "Other — type a role"
 * (role-select-other, :471-473); picking Other reveals the free-text input
 * (data-testid="role-manual-input", :482-491) and the JD attach block
 * (:518-580). When the JD library is empty, manual mode auto-activates with
 * zero clicks (:136-142). This chapter's fill shot handles both states.
 *
 * The JD teaching lives HERE for employers (no standalone JD surface / no
 * "setting up a client" chapter): the attached PDF is silently saved to the
 * org's JD library after creation (saveJdFileToLibrary,
 * NewAssessmentPage.tsx:189-223, fired at :272-274) — which is exactly the
 * "next time you hire for this role, it's already in the dropdown" line.
 */
const chapter: ChapterModule = {
  chapterId: "employer-02-creating-checks",
  shots: [
    {
      id: "01-sidebar-to-checks-hub",
      title: "Sidebar Checks → the checks hub → click New Assessment under Pre-Employment",
      needsAuth: true,
      storageStatePath: employerAuthStatePath(EMPLOYER_ACTIVE),
      async run(page) {
        await page.goto(`${DEFAULT_BASE_URL}/`, { waitUntil: "networkidle" });
        await page.waitForTimeout(1000);

        // Sidebar "🩺 Checks" item — PageLayout.tsx:64, targeted by href
        // (text /checks/i would also match "Check-ins", PageLayout.tsx:73).
        const checksNav = page.locator('nav a[href="/checks"]').first();
        await checksNav.waitFor({ state: "visible" });
        await cursorClick(page, checksNav, { durationMs: 1100 });

        // Checks hub — ChecksPage.tsx:1058, PageLayout title "Health
        // Checks"; the Pre-Employment tab is the default
        // (ChecksPage.tsx:978-982 initialTab fallback "pre_employment").
        await page.waitForURL(/\/checks/, { timeout: 15_000 });
        await page.getByTestId("checks-tab-pre_employment").waitFor({ state: "visible" });
        await page.waitForTimeout(1600);

        // "New Assessment" — the pre-employment card's header button, a
        // Link to /assessments/new?type=pre_employment (ChecksPage.tsx:
        // 394-396; href + label from CATEGORY_CONFIG.pre_employment,
        // :162-163). Scoped by href so the other tabs' identically-shaped
        // buttons can never match.
        const newAssessment = page
          .locator('a[href="/assessments/new?type=pre_employment"]')
          .first();
        await newAssessment.waitFor({ state: "visible" });
        await cursorClick(page, newAssessment, { durationMs: 1100 });

        // New-check form — PageLayout title "New Pre-Employment Check"
        // (NewAssessmentPage.tsx:412 with CHECK_META label, :57).
        await page.waitForURL(/\/assessments\/new/, { timeout: 15_000 });
        await page.locator("#candidateName").waitFor({ state: "visible" });
        await page.waitForTimeout(1400);
      },
    },
    {
      id: "02-fill-attach-create-send",
      title: "Fill candidate details, attach the JD PDF, Create Assessment, then Send to Worker",
      needsAuth: true,
      storageStatePath: employerAuthStatePath(EMPLOYER_ACTIVE),
      async run(page) {
        // Self-contained: lands straight on the form (shot 01 already showed
        // the navigation on camera — repeating it here would replay it at
        // the head of this shot, the exact desync partner chapter 3 hit).
        await page.goto(`${DEFAULT_BASE_URL}/assessments/new?type=pre_employment`, {
          waitUntil: "networkidle",
        });
        await page.waitForTimeout(800);

        // Candidate name/email — #candidateName / #candidateEmail
        // (NewAssessmentPage.tsx:429-446). Brisk typing: partner ch3
        // learned the text fields must not eat the narration's seconds.
        const nameField = page.locator("#candidateName");
        await moveCursorTo(page, nameField, { durationMs: 700 });
        await nameField.click();
        await nameField.pressSequentially(CH2_CANDIDATE.name, { delay: 14 });
        await page.waitForTimeout(250);

        const emailField = page.locator("#candidateEmail");
        await emailField.click();
        await emailField.pressSequentially(CH2_CANDIDATE.email, { delay: 10 });
        await page.waitForTimeout(250);

        // Role — the shadcn role Select (data-testid="role-select",
        // NewAssessmentPage.tsx:457). Two possible states (see header):
        //  - JD library empty → manual mode auto-active, the free-text
        //    input (role-manual-input) is already visible;
        //  - library has entries → open the Select and pick
        //    "Other — type a role" (Radix portal option — click the
        //    rendered option role, the same pattern PR #24 proved for
        //    portal-rendered shadcn Selects).
        const manualRole = page.getByTestId("role-manual-input");
        if (!(await manualRole.isVisible().catch(() => false))) {
          const roleSelect = page.getByTestId("role-select");
          await roleSelect.waitFor({ state: "visible" });
          await cursorClick(page, roleSelect, { durationMs: 700 });
          await page.waitForTimeout(900);
          await page.getByRole("option", { name: "Other — type a role" }).click();
        }
        await manualRole.waitFor({ state: "visible" });
        await moveCursorTo(page, manualRole, { durationMs: 600 });
        await manualRole.click();
        await manualRole.pressSequentially(CH2_CANDIDATE.role, { delay: 14 });
        await page.waitForTimeout(400);

        // Proposed start date — native <input type="date"> (#startDate,
        // NewAssessmentPage.tsx:505-511); fill() with an ISO value is the
        // supported Playwright way (same as partner ch3).
        const startDate = page.locator("#startDate");
        if (await startDate.isVisible().catch(() => false)) {
          await startDate.fill(CH2_CANDIDATE.startDate);
          await page.waitForTimeout(400);
        }

        // Attach the JD PDF — "a PDF straight off your desktop". The
        // "Attach document" button (NewAssessmentPage.tsx:568-576) fronts a
        // hidden <input id="jdFile" type="file"> (:560-567); Playwright
        // sets files on the hidden input directly, no native picker (same
        // technique as partner chapter 2's batch upload). Cursor shows the
        // button being the thing acted on, then the staged-file chip with
        // the filename appears (:545-557) — hold on it, it's the "this is
        // what drives the role-specific questions" beat.
        const attachButton = page.getByRole("button", { name: /attach document/i });
        await attachButton.waitFor({ state: "visible" });
        await moveCursorTo(page, attachButton, { durationMs: 900 });
        await page
          .locator('input#jdFile[type="file"]')
          .setInputFiles(path.join(FIXTURES_DIR, CH2_CANDIDATE.jdFixture));
        await page.getByText(CH2_CANDIDATE.jdFixture).waitFor({ state: "visible" });
        await page.waitForTimeout(2800);

        // Create Assessment — creates, does NOT send (the two-step is the
        // point of the next beats). Response captured the same way partner
        // ch3 does, purely as a success gate here.
        const createButton = page.getByRole("button", { name: /create assessment/i });
        const [createResponse] = await Promise.all([
          page.waitForResponse(
            (r) => r.url().includes("/api/assessments") && r.request().method() === "POST",
          ),
          cursorClick(page, createButton, { durationMs: 900 }),
        ]);
        if (createResponse.status() >= 400) {
          throw new Error(`Create Assessment failed: HTTP ${createResponse.status()}`);
        }

        // Ready-to-send card — CardTitle "Ready to send"
        // (NewAssessmentPage.tsx:358), with Candidate / Email / Position
        // rows (:364-376) and the Job Description row with the attached
        // filename (:377-385, renders because jdFile is set). Ring the
        // whole card per the script's "Ring anchored to the card".
        await page.getByText("Ready to send", { exact: true }).waitFor({ state: "visible", timeout: 15_000 });
        const card = page
          .getByText("Ready to send", { exact: true })
          .locator("xpath=ancestor::div[contains(@class, 'rounded')][1]");
        const cardRing = await ringAround(page, card, { paddingPx: 6 });
        await page.waitForTimeout(3200);
        await cardRing.remove();

        // Ring the "Not now" / "Send to Worker" PAIR (NewAssessmentPage.
        // tsx:390-403) — the shipped set's worst ring defect (3.6/3.7 in
        // the realignment doc) was missing exactly this pair. Anchor to
        // their shared flex row via the "Not now" button's parent.
        const notNow = page.getByRole("button", { name: /not now/i });
        const sendToWorker = page.getByRole("button", { name: /send to worker/i });
        await notNow.waitFor({ state: "visible" });
        await sendToWorker.waitFor({ state: "visible" });
        const buttonRow = notNow.locator("xpath=parent::div");
        const pairRing = await ringAround(page, buttonRow, { paddingPx: 6 });
        await page.waitForTimeout(2400);
        await pairRing.remove();

        // "That's the step that actually emails your candidate the secure
        // link" — the real send.
        await cursorClick(page, sendToWorker, { durationMs: 800 });

        // Sent confirmation — "Questionnaire sent!" + "A secure link has
        // been emailed to…" (NewAssessmentPage.tsx:328-334).
        await page.getByText(/Questionnaire sent!/i).waitFor({ state: "visible", timeout: 15_000 });
        await page.waitForTimeout(2400);
      },
    },
  ],
};

export default chapter;
