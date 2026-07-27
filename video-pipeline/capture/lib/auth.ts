import type { Browser } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { DEFAULT_BASE_URL, PARTNER, VIEWPORT } from "./demo-data";
import { AUTH_STATE_PATH } from "./recording";

/**
 * Logs in once, UNRECORDED, and saves storageState so every shot after
 * chapter 1's own (recorded) login shot can start already authenticated —
 * this is what fixes defect #1 in the audit ("chapter 2 opens by
 * redundantly re-showing login"). Chapter 1 performs its own real,
 * recorded UI login in a separate fresh context (see
 * capture/chapters/01-getting-started.ts) — this helper is deliberately
 * NOT reused there, so chapter 1's footage is genuine, not a replay.
 *
 * Deterministic: waits for a specific post-login element, not a timeout.
 */
export async function ensureAuthenticatedState(browser: Browser): Promise<string> {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    baseURL: DEFAULT_BASE_URL,
    // See the matching note in recording.ts — same rate-limiter bypass.
    extraHTTPHeaders: process.env.E2E_TEST_SECRET
      ? { "x-e2e-test-secret": process.env.E2E_TEST_SECRET }
      : undefined,
  });
  const page = await context.newPage();
  try {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await page.getByLabel(/email/i).fill(PARTNER.loginEmail);
    // Not getByLabel — real a11y bug found live 2026-07-27, first run: the
    // <label for="..."> on LoginPage.tsx's password field points at a
    // wrapping <div>, not the <input> itself, so there is no programmatic
    // label association at all (confirmed via DOM dump). Separately, the
    // "Show password" toggle button's own aria-label also contains
    // "password" and was winning a loose /password/i match. Targeting the
    // input directly sidesteps both; the label bug itself is a real product
    // defect (screen readers get no association either) worth its own fix,
    // not something to patch from here.
    await page.locator('input[type="password"]').fill(PARTNER.loginPassword);
    await page.getByRole("button", { name: /sign in/i }).click();
    // Partner workspace is the deterministic "logged in" signal — no
    // wall-clock waits. VERIFY (unproven, see docs/video-pipeline.md):
    // the exact post-login route was read from source
    // (client/src/pages/PartnerWorkspace.tsx) as "/partner/clients", not
    // click-verified against a running instance.
    await page.waitForURL(/\/partner\/clients/, { timeout: 30_000 });
  } finally {
    mkdirSync(path.dirname(AUTH_STATE_PATH), { recursive: true });
    await context.storageState({ path: AUTH_STATE_PATH });
    await context.close();
  }
  return AUTH_STATE_PATH;
}
