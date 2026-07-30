import type { ChapterModule } from "../lib/recording";
import { DEFAULT_BASE_URL } from "../lib/demo-data";
import { EMPLOYER_FRESH, LIVE_SITE_BASE_URL, TRIAL_SIGNUP } from "../lib/demo-employer-data";
import { employerAuthStatePath } from "../lib/employer-auth";
import { cursorClick, moveCursorTo, pulseCursor, ringAround } from "../lib/annotate";

/**
 * Employer chapter 1 — "Getting started".
 * Script: docs/onboarding-video-scripts-employer-v1.md, chapter 1 table.
 *
 * SCOPE NOTES (read before filming):
 *
 *  - Shots 01-02 film the LIVE marketing site (https://preventli.ai) —
 *    homepage hero CTA and the /start-trial form. The form is filled with
 *    the fictional Northwind Joinery casting and NEVER submitted: the
 *    submit beat is the cursor travelling to the button + the click-pulse
 *    animation only (annotate.ts's pulseCursor dispatches no real event),
 *    exactly the never-submitted approach the partner chapter-1 v3 footage
 *    used. No account is created; nothing is POSTed.
 *
 *  - The verification-inbox beat (script 0:36-0:42, "Inbox card ...
 *    verification link clicked") is a MANUAL/GRAPHIC BEAT, NOT CAPTURED
 *    HERE — same stylised-card treatment as partner chapter 1, which this
 *    harness also never automated (a real inbox + a fresh email per run is
 *    out of scope; see 01-getting-started.ts's scope note and
 *    docs/video-pipeline.md "Known gaps"). The editor drops the card
 *    between shots 02 and 03.
 *
 *  - Shots 03-04 run against the LOCAL app (CAPTURE_BASE_URL), logged in
 *    as EMPLOYER_FRESH via storageState (no login is ever recorded in the
 *    employer set — the script's story is "verified and signed straight
 *    in"). Requires `preventli`'s server/seed-demo-employer.ts (parallel
 *    PR, unmerged) seeded: "Northwind Joinery Pty Ltd", role=admin,
 *    kind=employer, mid-trial, ZERO cases/checks so the
 *    GettingStartedChecklist renders.
 *
 *  - KNOWN LIMITATION, flagged not hidden: the script's 0:21-0:27 beat
 *    wants the Company-size dropdown "opened — real options visible". The
 *    control is a NATIVE <select> (app/start-trial/page.tsx:195-207); its
 *    open popup is OS-rendered chrome outside the page raster, which
 *    Playwright's recordVideo cannot capture. This shot selects the option
 *    directly (the chosen label lands visibly in the closed control) and
 *    holds there; if the open-list beat is non-negotiable it needs a
 *    graphic/zoom in the edit, not this harness.
 */
const chapter: ChapterModule = {
  chapterId: "employer-01-getting-started",
  shots: [
    {
      id: "01-live-homepage-cta",
      title: "Live homepage — cursor travels to the hero 'Start Free Trial' and clicks it",
      needsAuth: false,
      async run(page) {
        // LIVE SITE. Read-only: one click on a public nav CTA.
        await page.goto(`${LIVE_SITE_BASE_URL}/`, { waitUntil: "domcontentloaded" });
        // Hero CTA — components/Hero.tsx:62-66 (this repo): an <a
        // href="/start-trial"> with text "Start Free Trial". A second CTA
        // ("Book a Demo") sits beside it; exact-name match disambiguates.
        const cta = page.getByRole("link", { name: "Start Free Trial" }).first();
        await cta.waitFor({ state: "visible" });
        // Hold on the loaded homepage before moving — framing pause.
        await page.waitForTimeout(1500);
        await cursorClick(page, cta, { durationMs: 1100 });
        // /start-trial heading — app/start-trial/page.tsx:112-114.
        await page.getByRole("heading", { name: /start your 14-day free trial/i }).waitFor({
          state: "visible",
          timeout: 15_000,
        });
        await page.waitForTimeout(1500);
      },
    },
    {
      id: "02-trial-form-never-submitted",
      title: "Fill the trial form (Northwind Joinery) — submit is SHOWN, never performed",
      needsAuth: false,
      async run(page) {
        // LIVE SITE. Fills form fields client-side only; NOTHING is submitted.
        await page.goto(`${LIVE_SITE_BASE_URL}/start-trial`, { waitUntil: "domcontentloaded" });
        await page.getByRole("heading", { name: /start your 14-day free trial/i }).waitFor({ state: "visible" });
        await page.waitForTimeout(1200);

        // Company name — #trial-company (app/start-trial/page.tsx:148-155).
        // pressSequentially, not fill: typing must be visible (same rule as
        // partner chapter 1's login shot).
        const company = page.locator("#trial-company");
        await moveCursorTo(page, company, { durationMs: 700 });
        await company.click();
        await company.pressSequentially(TRIAL_SIGNUP.company, { delay: 40 });
        await page.waitForTimeout(500);

        // "This one matters" beat (script 0:13-0:21): the single-company /
        // multi-client choice — two buttons (page.tsx:163-188). Click
        // "I manage my own workers"; it highlights green (aria-pressed
        // styling); ring it and hold.
        const employerChoice = page.getByRole("button", { name: "I manage my own workers" });
        await cursorClick(page, employerChoice, { durationMs: 900 });
        const choiceRing = await ringAround(page, employerChoice);
        await page.waitForTimeout(2600);
        await choiceRing.remove();

        // Company size — native <select id="trial-employee-count">
        // (page.tsx:192-207). selectOption, with the popup-not-capturable
        // caveat in the chapter header. Options from lib/trial-signup.ts:16-22.
        const sizeSelect = page.locator("#trial-employee-count");
        await moveCursorTo(page, sizeSelect, { durationMs: 700 });
        await sizeSelect.selectOption(TRIAL_SIGNUP.employeeCountValue);
        await page.waitForTimeout(1400);

        // Name / email / password / confirm (page.tsx:239-307). The live
        // 5-rule password checklist (page.tsx:279-294) ticks off as the
        // password is typed — it renders in-page, so it IS captured.
        const nameField = page.locator("#trial-name");
        await moveCursorTo(page, nameField, { durationMs: 600 });
        await nameField.click();
        await nameField.pressSequentially(TRIAL_SIGNUP.fullName, { delay: 35 });
        await page.waitForTimeout(300);

        const emailField = page.locator("#trial-email");
        await emailField.click();
        await emailField.pressSequentially(TRIAL_SIGNUP.workEmail, { delay: 28 });
        await page.waitForTimeout(300);

        const passwordField = page.locator("#trial-password");
        await passwordField.click();
        await passwordField.pressSequentially(TRIAL_SIGNUP.password, { delay: 45 });
        // Hold with the checklist fully ticked — that's the beat.
        await page.waitForTimeout(900);

        const confirmField = page.locator("#trial-confirm-password");
        await confirmField.click();
        await confirmField.pressSequentially(TRIAL_SIGNUP.password, { delay: 35 });
        await page.waitForTimeout(600);

        // The submit beat — SHOWN, NOT PERFORMED. Cursor travels to
        // "Start 14-day free trial" (page.tsx:330-336) and the click-pulse
        // plays, but no real click is ever dispatched: pulseCursor is
        // animation-only, so the form cannot POST and no account is
        // created. The cut to the (stylised) inbox card happens here.
        const submitButton = page.getByRole("button", { name: /start 14-day free trial/i });
        await moveCursorTo(page, submitButton, { durationMs: 1000 });
        await pulseCursor(page);
        await page.waitForTimeout(1200);
      },
    },
    // -- (stylised verification-inbox card goes here in the edit — manual/
    //     graphic beat, not captured by this harness; see chapter header) --
    {
      id: "03-workspace-first-look",
      title: "Fresh workspace: org-name title, trial banner, Getting Started checklist, empty list",
      needsAuth: true,
      storageStatePath: employerAuthStatePath(EMPLOYER_FRESH),
      async run(page) {
        // LOCAL APP from here on. An employer admin's landing route is "/"
        // (LoginPage.tsx:73), which RoleBasedDashboard resolves to
        // CasesDashboard.
        await page.goto(`${DEFAULT_BASE_URL}/`, { waitUntil: "networkidle" });

        // Trial banner — data-testid="trial-banner" (TrialBanner.tsx:24),
        // rendered by PageLayout above the page content (PageLayout.tsx:349)
        // whenever the org is mid-trial. Seed contract: trialEndsAt in the
        // future, so "N days left in your free trial" shows.
        await page.getByTestId("trial-banner").waitFor({ state: "visible" });

        // Getting Started checklist — renders only while the org has zero
        // cases (CasesDashboard.tsx:357-359); header text from
        // GettingStartedChecklist.tsx:171-173.
        const checklistHeading = page.getByText("Welcome to Preventli — let's get you set up");
        await checklistHeading.waitFor({ state: "visible" });
        await page.waitForTimeout(1800);

        // Page title is the org's own name (CasesDashboard.tsx:110-115 →
        // PageLayout's <h1>). Not asserted by exact string — the fetch is
        // async and falls back to "Preventli" — but the org-name beat is
        // what the narration names, so give it a hover.
        const title = page.getByRole("heading", { level: 1 });
        await moveCursorTo(page, title, { durationMs: 800 });
        await page.waitForTimeout(1000);

        // Hover the trial banner ("your trial's counting down at the top").
        await moveCursorTo(page, page.getByTestId("trial-banner"), { durationMs: 800 });
        await page.waitForTimeout(1400);

        // Ring the checklist — the script's explicit "Ring on the
        // checklist" direction. Anchor to the whole checklist card: the
        // heading's enclosing rounded-border container
        // (GettingStartedChecklist.tsx:162).
        const checklistCard = checklistHeading.locator(
          "xpath=ancestor::div[contains(@class, 'rounded-xl')][1]",
        );
        const ring = await ringAround(page, checklistCard, { paddingPx: 4 });
        await page.waitForTimeout(3200);
        await ring.remove();

        // "Everything to do with your people ... lives in this one list" —
        // the (empty) unified case/check list, CasesDashboard.tsx:370-376
        // (emptyMessage "No cases or checks yet.", rendered by
        // CaseListView.tsx:440-443).
        const emptyList = page.getByText("No cases or checks yet.");
        if (await emptyList.isVisible().catch(() => false)) {
          await moveCursorTo(page, emptyList, { durationMs: 900 });
        }
        await page.waitForTimeout(1600);
      },
    },
    {
      id: "04-sidebar-checks-closing-beat",
      title: "Cursor sweeps to Checks in the sidebar — closing beat",
      needsAuth: true,
      storageStatePath: employerAuthStatePath(EMPLOYER_FRESH),
      async run(page) {
        await page.goto(`${DEFAULT_BASE_URL}/`, { waitUntil: "networkidle" });
        await page.getByTestId("trial-banner").waitFor({ state: "visible" });
        await page.waitForTimeout(1200);

        // Sidebar "🩺 Checks" nav item — PageLayout.tsx:64 ({ path:
        // "/checks", label: "🩺 Checks" }), rendered as a Link in the
        // desktop sidebar (PageLayout.tsx:229-234). Targeted by href, not
        // label text: /checks/i would also match "Check-ins"
        // (PageLayout.tsx:73). NOT clicked — the script ends the chapter
        // here ("that's next — chapter two"); chapter 2 opens with the
        // click.
        const checksNav = page.locator('nav a[href="/checks"]').first();
        await checksNav.waitFor({ state: "visible" });
        await moveCursorTo(page, checksNav, { durationMs: 1300 });
        await page.waitForTimeout(2200);
      },
    },
  ],
};

export default chapter;
