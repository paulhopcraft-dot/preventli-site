import { existsSync, readFileSync } from "node:fs";
import type { Page } from "@playwright/test";
import type { ChapterModule } from "../lib/recording";
import { CASTING, DEFAULT_BASE_URL } from "../lib/demo-data";
import { LAST_ASSESSMENT_STATE_PATH } from "./03-creating-and-sending-checks";

/**
 * Chapter 4 — "The candidate experience".
 *
 * REWRITTEN 2026-07-27 after activating the generic pre-employment
 * `check_form_templates` row (organization_id IS NULL) — Paul's call, after
 * we found the candidate form's page count isn't a fixed constant: it
 * depends on (a) whether a check_form_template row is active for the org
 * (most orgs have none, and get the fixed 8-step legacy PreEmploymentForm),
 * and (b) once one IS active, one page's question count scales with however
 * much detail is in that specific job description (the "Role requirements"
 * page — appendJdRequirementsPage in shared/formDefinition.ts). Two real
 * checks against two different JDs can legitimately have different page
 * counts; that isn't a bug.
 *
 * With the generic template now active, "Send a check" against the seeded
 * Coastline Aged Care Group / Priya Nair pairing renders DynamicCheckForm
 * (client/src/pages/PublicCheckRouter.tsx), not the old 8-step wizard this
 * chapter's previous version drove. DynamicCheckForm's fields have no
 * stable id/data-testid attributes (verified live 2026-07-27 — every input
 * is a bare <input>, choice questions are plain <button> elements, not
 * role="radio"), and its page count is JD-dependent by design, so this
 * chapter is written as a GENERIC, ADAPTIVE walker rather than a fixed
 * per-page script like chapters 1-3: fill whatever's empty on the current
 * page, answer whatever's unanswered, click Next/Submit, repeat. This is
 * deliberately less precise than the click-verified fixed-selector chapters
 * — flagged, not hidden — because the alternative (hardcoding today's exact
 * page sequence) would silently break the next time someone edits the JD or
 * the generic template definition.
 */

// Patterns, not exact strings — every page of this form has its own
// full-sentence option wording (found live 2026-07-27: "No" on the
// Occupational Health page, "I have no pre-existing injuries..." on the
// Health Disclosure page), so an exact-string list needs a new entry per
// page discovered. Matching by keyword instead scales to pages not yet
// seen. Every pattern here is a deliberately SAFE/negative/capable default
// answer, not a random pick — this is synthetic capture data, not a real
// candidate's answers.
const SAFE_ANSWER_PATTERNS = [
  /^no$/i,
  /^not applicable$/i,
  /^woman$/i,
  /prefer not to say/i,
  /yes,?\s*i can perform this/i,
  /i have no pre-existing/i,
  /no limitations/i,
  // Functional Capacity page (pain/mobility self-report) — found live
  // 2026-07-27: each question lists best-to-worst options, so the FIRST
  // option in every group here is consistently the "no limitation" answer.
  /^not likely$/i,
  /lift heavy weights without extra pain/i,
  /pain does not prevent me walking/i,
  /i can sit in any chair/i,
  /i can stand as long as i want without pain/i,
  /my sleep is never disturbed/i,
  // Mental Health Function page (Kessler-10 style) — each of ~10 identical
  // 5-point scales and 3 binary questions repeats the same option text
  // across many rows; matching by text (not position) answers all of them.
  /^none of the time$/i,
  /^not affected$/i,
];

const EXCLUDED_BUTTON_TEXTS = /^(next|back|previous|submit|cancel|close)$/i;

// Exported for the debug/reconnaissance script only (not imported by any
// other chapter or by run.ts) — lets ad-hoc investigation reuse the exact
// same logic as the real capture instead of a hand-copied approximation
// that can silently drift from it.
export async function fillVisibleEmptyInputs(page: Page): Promise<void> {
  const inputs = await page
    .locator('input[type="text"], input[type="email"], input[type="number"], input[type="tel"]')
    .all();
  for (const input of inputs) {
    if (!(await input.isVisible().catch(() => false))) continue;
    const existing = await input.inputValue().catch(() => "");
    if (existing) continue;
    const type = await input.getAttribute("type");
    const placeholder = (await input.getAttribute("placeholder")) ?? "";
    // Several fields on this form (e.g. "What role are you applying for?",
    // "Company Name") have NO placeholder text at all — the question sits
    // in a <label> above the input instead. Found live 2026-07-27: relying
    // on placeholder alone left the candidate typing "N/A" for their own
    // role and employer. Falls back to the nearest preceding label's text
    // when the placeholder gives no match.
    const label = await input
      .evaluate((el) => el.closest("div")?.querySelector("label")?.textContent ?? "")
      .catch(() => "");
    const hint = `${placeholder} ${label}`;
    let value = "N/A";
    if (type === "email" || /email/i.test(hint)) value = CASTING.candidate.email;
    else if (type === "number" || /age|year/i.test(hint)) value = "34";
    else if (/company/i.test(hint)) value = CASTING.existingClient.name;
    else if (/phone|mobile/i.test(hint)) value = "0400 000 000";
    else if (/role|position/i.test(hint)) value = CASTING.candidate.role;
    await input.fill(value).catch(() => {});
  }
}

export async function fillVisibleEmptyTextareas(page: Page): Promise<void> {
  const textareas = await page.locator("textarea").all();
  for (const ta of textareas) {
    if (!(await ta.isVisible().catch(() => false))) continue;
    const existing = await ta.inputValue().catch(() => "");
    if (!existing) await ta.fill("No limitations.").catch(() => {});
  }
}

/**
 * Consent/acknowledgement checkboxes (e.g. the privacy-policy page's "I have
 * read and agree to the above.") — found live 2026-07-27: plain
 * <input type="checkbox">, missed entirely by the button/text-input fillers
 * above, which silently blocked the privacy page's Next click every pass.
 */
/**
 * Signature pad — found live 2026-07-27: a plain <canvas
 * class="cursor-crosshair">, drawn on with pointer/mouse events, not a text
 * or file input. No fill/click API applies; draws a simple zigzag stroke by
 * dragging the mouse across the canvas, same as a real candidate would.
 */
async function drawSignatureIfPresent(page: Page): Promise<void> {
  const canvas = page.locator("canvas").first();
  if (!(await canvas.isVisible().catch(() => false))) return;
  const box = await canvas.boundingBox();
  if (!box) return;
  const midY = box.y + box.height / 2;
  const startX = box.x + box.width * 0.15;
  const endX = box.x + box.width * 0.85;
  await page.mouse.move(startX, midY);
  await page.mouse.down();
  const steps = 6;
  for (let i = 1; i <= steps; i++) {
    const x = startX + ((endX - startX) * i) / steps;
    const y = midY + (i % 2 === 0 ? -20 : 20);
    await page.mouse.move(x, y, { steps: 3 });
  }
  await page.mouse.up();
}

export async function checkVisibleUncheckedCheckboxes(page: Page): Promise<void> {
  const boxes = await page.locator('input[type="checkbox"]').all();
  for (const box of boxes) {
    if (!(await box.isVisible().catch(() => false))) continue;
    if (!(await box.isChecked().catch(() => true))) {
      await box.check().catch(() => {});
    }
  }
}

/**
 * Native <select> dropdowns — found live 2026-07-27 on the Functional
 * Capacity (pain-scale) page: 0-10 pain-level selects defaulting to a
 * "Select…" placeholder option, missed entirely by every other filler here
 * (they only handle plain <input>/<button>/<textarea>). Picks "0" (no
 * pain) if that's a real option; otherwise the first non-placeholder
 * option, so this degrades sanely on a select this heuristic doesn't
 * recognise rather than leaving it on the placeholder forever.
 */
export async function selectVisibleEmptyNativeSelects(page: Page): Promise<void> {
  const selects = await page.locator("select").all();
  for (const select of selects) {
    if (!(await select.isVisible().catch(() => false))) continue;
    const current = await select.inputValue().catch(() => "");
    const options = await select.locator("option").allTextContents().catch(() => []);
    if (current && !/^select/i.test(current)) continue; // already has a real value
    if (options.includes("0")) {
      await select.selectOption("0").catch(() => {});
      continue;
    }
    const firstReal = options.find((o) => !/^select/i.test(o.trim()) && o.trim() !== "");
    if (firstReal) await select.selectOption({ label: firstReal }).catch(() => {});
  }
}

/**
 * Choice questions on this form render as plain <button> elements (verified
 * live — no role="radio", no aria-checked), so "already answered" can't be
 * detected via ARIA state, and clicking one can conditionally reveal or
 * remove other fields elsewhere on the page (found live 2026-07-27),
 * invalidating a single up-front element list. Multi-pass: re-query and
 * re-click on every pass until a pass finds nothing new to click, so
 * newly-revealed fields from an earlier click in the same pass still get
 * answered. Clicking an already-selected option on this UI is harmless
 * (re-selecting the same choice), so repeat passes are safe.
 */
export async function answerSafeChoiceButtons(page: Page): Promise<void> {
  for (let pass = 0; pass < 5; pass++) {
    const allButtons = await page.getByRole("button").all();
    let clickedAny = false;
    for (const btn of allButtons) {
      const text = (await btn.innerText().catch(() => "")).trim();
      if (!text || EXCLUDED_BUTTON_TEXTS.test(text)) continue;
      if (!SAFE_ANSWER_PATTERNS.some((p) => p.test(text))) continue;
      if (await btn.isVisible().catch(() => false)) {
        await btn.click().catch(() => {});
        clickedAny = true;
      }
    }
    if (!clickedAny) break;
  }
}

async function logCurrentPage(page: Page): Promise<void> {
  const text = await page.locator("body").innerText().catch(() => "");
  const match = text.match(/Page \d+ of \d+/i);
  if (match) console.log(`[chapter-04] ${match[0]}`);
}

const chapter: ChapterModule = {
  chapterId: "04-candidate-experience",
  shots: [
    {
      id: "01-full-candidate-flow",
      title: "Candidate opens the link, walks the JD-driven form, submits",
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

        const MAX_PAGES = 40; // safety cap, not an expected count
        for (let i = 0; i < MAX_PAGES; i++) {
          const submitted = await page.getByText(/have been submitted/i).isVisible().catch(() => false);
          if (submitted) break;

          await logCurrentPage(page);
          await fillVisibleEmptyInputs(page);
          await fillVisibleEmptyTextareas(page);
          await answerSafeChoiceButtons(page);
          await checkVisibleUncheckedCheckboxes(page);
          await selectVisibleEmptyNativeSelects(page);
          await drawSignatureIfPresent(page);
          await page.waitForTimeout(1800); // hold long enough to read on camera

          const submitBtn = page.getByRole("button", { name: /submit/i }).first();
          const nextBtn = page.getByRole("button", { name: /^next$/i }).first();

          if (await submitBtn.isVisible().catch(() => false)) {
            await submitBtn.click();
            await page
              .getByText(/have been submitted/i)
              .waitFor({ state: "visible", timeout: 20_000 })
              .catch(() => {});
            break;
          }
          if (await nextBtn.isVisible().catch(() => false)) {
            await nextBtn.click();
            continue;
          }

          console.warn("[chapter-04] No Next or Submit button found — stopping. Check the page for a validation error.");
          break;
        }
        await page.waitForTimeout(1500);
      },
    },
  ],
};

export default chapter;
