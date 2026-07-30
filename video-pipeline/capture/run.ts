#!/usr/bin/env -S npx tsx
/**
 * Capture harness CLI. Drives the `preventli` UI (partner chapters 01-05,
 * employer chapters employer-01/02/04) with Playwright
 * and records one .webm per shot (Playwright's native `recordVideo` context
 * option — see capture/lib/recording.ts). Deterministic: fixed 1920x1080
 * viewport, fixed seed data (capture/lib/demo-data.ts), no wall-clock waits
 * (every shot waits on a selector/URL, not a sleep) — so two runs against
 * the same seeded DB produce comparable footage.
 *
 * Usage (from preventli-site/):
 *   npx tsx video-pipeline/capture/run.ts <chapterId> [--shot <shotId>] [--headed]
 *   npx tsx video-pipeline/capture/run.ts all
 *
 * Requires: the `preventli` app running and reachable at CAPTURE_BASE_URL
 * (default http://localhost:5000), seeded with server/seed-demo-partner.ts
 * (partner chapters) and/or server/seed-demo-employer.ts (employer
 * chapters; parallel preventli PR, unmerged — see lib/demo-employer-data.ts).
 * See docs/video-pipeline.md for the full prerequisite chain — this script
 * does not start the app or the database for you.
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { launchBrowser, runShot, type ChapterModule } from "./lib/recording";
import { ensureAuthenticatedState } from "./lib/auth";
import { ensureEmployerAuthState } from "./lib/employer-auth";
import { DEFAULT_BASE_URL } from "./lib/demo-data";
import { EMPLOYER_ACTIVE, EMPLOYER_FRESH } from "./lib/demo-employer-data";

const CHAPTER_IDS = [
  "01-getting-started",
  "02-setting-up-a-client",
  "03-creating-and-sending-checks",
  "04-candidate-experience",
  "05-clinical-review",
  // Employer set (docs/onboarding-video-scripts-employer-v1.md). Employer
  // chapter 3 is the partner set's 04-candidate-experience, reused as-is —
  // no employer-03 file exists on purpose.
  "employer-01-getting-started",
  "employer-02-creating-checks",
  "employer-04-review-report",
] as const;

/**
 * Which saved auth states a run needs, derived from the chapters selected —
 * so an employer-only run never attempts the partner login (whose seed may
 * not be present) and vice versa. Employer chapter 1's post-signup beats use
 * the FRESH account; chapters 2 and 4 use the ACTIVE one.
 */
function authNeedsFor(chapterIds: readonly string[]): {
  partner: boolean;
  employerFresh: boolean;
  employerActive: boolean;
} {
  return {
    partner: chapterIds.some((id) => !id.startsWith("employer-")),
    employerFresh: chapterIds.includes("employer-01-getting-started"),
    employerActive:
      chapterIds.includes("employer-02-creating-checks") ||
      chapterIds.includes("employer-04-review-report"),
  };
}

async function loadChapter(chapterId: string): Promise<ChapterModule> {
  const mod = await import(`./chapters/${chapterId}`);
  if (!mod.default || !Array.isArray(mod.default.shots)) {
    throw new Error(`chapters/${chapterId}.ts must default-export { chapterId, shots }`);
  }
  return mod.default as ChapterModule;
}

async function preflight(): Promise<void> {
  let reachable = false;
  try {
    const res = await fetch(DEFAULT_BASE_URL, { method: "GET" });
    reachable = res.status < 500;
  } catch {
    reachable = false;
  }
  if (!reachable) {
    console.error(
      `[capture] Cannot reach ${DEFAULT_BASE_URL}. The preventli app must already be running ` +
        `(npm run dev in the preventli repo) before you run this script. ` +
        `See docs/video-pipeline.md "Prerequisites".`,
    );
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const target = args[0];
  const headed = args.includes("--headed");
  const shotFilterIdx = args.indexOf("--shot");
  const shotFilter = shotFilterIdx >= 0 ? args[shotFilterIdx + 1] : undefined;

  if (!target || (target !== "all" && !(CHAPTER_IDS as readonly string[]).includes(target))) {
    console.error(`Usage: npx tsx video-pipeline/capture/run.ts <${CHAPTER_IDS.join("|")}|all> [--shot <id>] [--headed]`);
    process.exit(1);
  }

  await preflight();

  const browser = await launchBrowser(headed);
  try {
    const chaptersToRun = target === "all" ? CHAPTER_IDS : [target];

    // Auth is captured once per run (not per chapter) — every needsAuth
    // shot reuses a saved storageState, so a full "all" run only ever shows
    // the real login UI once, in (partner) chapter 1. Only the states the
    // selected chapters actually need are established, so a partner-seeded
    // DB doesn't have to hold the employer seed or vice versa.
    const authNeeds = authNeedsFor(chaptersToRun);
    if (authNeeds.partner) {
      console.log("[capture] Establishing authenticated partner session (unrecorded)...");
      await ensureAuthenticatedState(browser);
    }
    if (authNeeds.employerFresh) {
      console.log(`[capture] Establishing authenticated employer session (${EMPLOYER_FRESH.loginEmail}, unrecorded)...`);
      await ensureEmployerAuthState(browser, EMPLOYER_FRESH);
    }
    if (authNeeds.employerActive) {
      console.log(`[capture] Establishing authenticated employer session (${EMPLOYER_ACTIVE.loginEmail}, unrecorded)...`);
      await ensureEmployerAuthState(browser, EMPLOYER_ACTIVE);
    }
    for (const chapterId of chaptersToRun) {
      const chapter = await loadChapter(chapterId);
      const shots = shotFilter ? chapter.shots.filter((s) => s.id === shotFilter) : chapter.shots;
      if (shots.length === 0) {
        console.error(`[capture] No shot matching "${shotFilter}" in chapter ${chapterId}`);
        process.exit(1);
      }
      for (const shot of shots) {
        console.log(`[capture] ${chapterId} :: ${shot.id} — ${shot.title}`);
        const outPath = await runShot(browser, chapterId, shot);
        console.log(`[capture]   -> ${outPath}`);
      }
    }
  } finally {
    await browser.close();
  }

  console.log("[capture] Done. Next: node video-pipeline/stitch/stitch-chapter.mjs <chapterId>");
}

main().catch((err) => {
  console.error("[capture] FAILED:", err);
  process.exit(1);
});
