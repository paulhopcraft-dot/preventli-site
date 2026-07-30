#!/usr/bin/env -S npx tsx
/**
 * Capture harness CLI. Drives the `preventli` partner UI with Playwright
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
 * (default http://localhost:5000), seeded with server/seed-demo-partner.ts.
 * See docs/video-pipeline.md for the full prerequisite chain — this script
 * does not start the app or the database for you.
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { launchBrowser, runShot, type ChapterModule } from "./lib/recording";
import { ensureAuthenticatedState } from "./lib/auth";
import { DEFAULT_BASE_URL } from "./lib/demo-data";

const CHAPTER_IDS = [
  "01-getting-started",
  "02-setting-up-a-client",
  "03-creating-and-sending-checks",
  "04-candidate-experience",
  "05-clinical-review",
] as const;

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
    // Auth is captured once per run (not per chapter) — every needsAuth
    // shot across every chapter reuses the same storageState, so a full
    // "all" run only ever shows the real login UI once, in chapter 1.
    console.log("[capture] Establishing authenticated session (unrecorded)...");
    await ensureAuthenticatedState(browser);

    const chaptersToRun = target === "all" ? CHAPTER_IDS : [target];
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
