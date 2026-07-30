import { chromium, type Browser, type BrowserContext, type Page } from "@playwright/test";
import { existsSync, mkdirSync, readdirSync, renameSync } from "node:fs";
import path from "node:path";
import { VIEWPORT } from "./demo-data";

export interface Shot {
  /** Two-digit-prefixed, filesystem-safe id, e.g. "01-open-workspace". Determines stitch order. */
  id: string;
  title: string;
  /** If true, the context is created with the saved partner storageState (already logged in, no login screen recorded). */
  needsAuth: boolean;
  /**
   * Optional override for WHICH saved storageState a needsAuth shot loads.
   * Defaults to AUTH_STATE_PATH (the partner state, unchanged behaviour for
   * the five partner chapters). The employer chapters point this at the
   * per-account states written by employer-auth.ts — run.ts establishes
   * those before any shot that needs them.
   */
  storageStatePath?: string;
  run: (page: Page) => Promise<void>;
}

export interface ChapterModule {
  chapterId: string;
  shots: Shot[];
}

const OUTPUT_ROOT = path.resolve(__dirname, "..", "..", "output");
export const AUTH_STATE_PATH = path.join(OUTPUT_ROOT, ".auth", "partner-storage-state.json");

export function chapterRawDir(chapterId: string): string {
  return path.join(OUTPUT_ROOT, chapterId, "raw");
}

/**
 * Runs one shot in its own browser context, with Playwright's native
 * `recordVideo` (context option — not a third-party screen recorder).
 * Closing the context is what finalizes the .webm file to disk; Playwright
 * names it with an internal hash, so we rename it to `<shot.id>.webm`
 * immediately after so `stitch-chapter.mjs` can glob+sort deterministically.
 */
export async function runShot(browser: Browser, chapterId: string, shot: Shot): Promise<string> {
  const rawDir = chapterRawDir(chapterId);
  mkdirSync(rawDir, { recursive: true });

  const before = new Set(existsSync(rawDir) ? readdirSync(rawDir) : []);

  const contextOptions: Parameters<Browser["newContext"]>[0] = {
    viewport: VIEWPORT,
    recordVideo: { dir: rawDir, size: VIEWPORT },
    // A capture session hits the app's API far more than a real user does
    // (every shot, every retry) and trips the general 200-req/15min rate
    // limiter (server/middleware/security.ts) partway through a session —
    // found live 2026-07-27. The server already has a sanctioned E2E
    // bypass (isE2ETestRequest) gated on this header; only takes effect if
    // E2E_TEST_SECRET is set in the environment running this script, and
    // has zero effect on production (nothing sets that var there).
    extraHTTPHeaders: process.env.E2E_TEST_SECRET
      ? { "x-e2e-test-secret": process.env.E2E_TEST_SECRET }
      : undefined,
  };
  if (shot.needsAuth) {
    const statePath = shot.storageStatePath ?? AUTH_STATE_PATH;
    if (!existsSync(statePath)) {
      throw new Error(
        `Shot "${shot.id}" needs an authenticated session but ${statePath} does not exist. ` +
          `Run the auth setup first (capture/run.ts does this automatically before any needsAuth shot).`,
      );
    }
    contextOptions.storageState = statePath;
  }

  const context: BrowserContext = await browser.newContext(contextOptions);
  const page = await context.newPage();

  let error: unknown;
  try {
    await shot.run(page);
  } catch (err) {
    error = err;
  } finally {
    await context.close(); // finalizes the video file
  }

  const after = existsSync(rawDir) ? readdirSync(rawDir) : [];
  const newFile = after.find((f) => !before.has(f) && f.endsWith(".webm"));
  if (!newFile) {
    throw new Error(
      `Shot "${shot.id}" finished but no new .webm appeared in ${rawDir}. ` +
        (error ? `Shot also threw: ${String(error)}` : "Recording likely failed silently."),
    );
  }
  const finalName = `${shot.id}.webm`;
  const finalPath = path.join(rawDir, finalName);
  renameSync(path.join(rawDir, newFile), finalPath);

  if (error) {
    // Keep the recording (useful to see what went wrong on screen) but
    // still fail the run — a shot whose action threw is not a usable take.
    throw new Error(`Shot "${shot.id}" action failed (recording saved to ${finalPath}): ${String(error)}`);
  }

  return finalPath;
}

export async function launchBrowser(headed: boolean): Promise<Browser> {
  return chromium.launch({ headless: !headed });
}
