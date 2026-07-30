import type { Browser } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { DEFAULT_BASE_URL, VIEWPORT } from "./demo-data";
import { AUTH_STATE_PATH } from "./recording";

/**
 * Employer-account twin of auth.ts's ensureAuthenticatedState — logs in
 * once, UNRECORDED, and saves storageState so every employer shot starts
 * already authenticated. The employer set never records a login at all:
 * chapter employer-01's on-camera entry point is the trial-signup form
 * (filmed on the live site, never submitted) + a stylised inbox card, per
 * docs/onboarding-video-scripts-employer-v1.md — "verified and signed
 * straight in", so there is no login beat to film.
 *
 * Kept separate from auth.ts rather than parameterising it because the two
 * differ in their deterministic "logged in" signal: a partner lands on
 * /partner/clients, while an employer admin lands on "/" (LoginPage.tsx:73
 * — the role !== partner/employer_checks fallback), and "/" is also the
 * URL of the login page's own origin, so we wait on a post-login ELEMENT
 * (the sidebar nav) instead of a URL.
 */

export interface EmployerAccount {
  loginEmail: string;
  loginPassword: string;
}

/** One storage state per employer account, alongside the partner one. */
export function employerAuthStatePath(account: EmployerAccount): string {
  const slug = account.loginEmail.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  return path.join(path.dirname(AUTH_STATE_PATH), `employer-${slug}.json`);
}

export async function ensureEmployerAuthState(
  browser: Browser,
  account: EmployerAccount,
): Promise<string> {
  const statePath = employerAuthStatePath(account);
  const context = await browser.newContext({
    viewport: VIEWPORT,
    baseURL: DEFAULT_BASE_URL,
    // Same sanctioned E2E rate-limiter bypass as recording.ts / auth.ts.
    extraHTTPHeaders: process.env.E2E_TEST_SECRET
      ? { "x-e2e-test-secret": process.env.E2E_TEST_SECRET }
      : undefined,
  });
  const page = await context.newPage();
  try {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await page.getByLabel(/email/i).fill(account.loginEmail);
    // Not getByLabel — the password field's <label for> points at a wrapping
    // div, not the input (real a11y bug, found live 2026-07-27; see the full
    // note in auth.ts).
    await page.locator('input[type="password"]').fill(account.loginPassword);
    await page.getByRole("button", { name: /sign in/i }).click();
    // Deterministic "logged in" signal: an employer admin is routed to "/"
    // (LoginPage.tsx:64-76), which renders CasesDashboard inside PageLayout —
    // wait for the sidebar's Checks nav link (PageLayout.tsx:64, the
    // "🩺 Checks" item, href="/checks"), which only exists post-login.
    await page.locator('nav a[href="/checks"]').first().waitFor({ state: "visible", timeout: 30_000 });
  } finally {
    mkdirSync(path.dirname(statePath), { recursive: true });
    await context.storageState({ path: statePath });
    await context.close();
  }
  return statePath;
}
