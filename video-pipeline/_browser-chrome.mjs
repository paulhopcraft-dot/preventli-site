#!/usr/bin/env node
/**
 * Draw a browser address bar across the top of chapter 1's login shot, with
 * the URL typing itself in.
 *
 * Why this exists: Playwright's recordVideo captures the PAGE only — there is
 * no browser chrome in the footage, so there was nowhere for a URL to appear.
 * The narration named "preventli.ai/login" over footage of an email being
 * typed into the form, which Paul correctly called out as describing one thing
 * while showing another (2026-07-27). Option B of the two fixes offered: draw
 * the address bar rather than reword around the gap.
 *
 * This IS a graphic composited on top of real footage — it is not a recording
 * of a real browser window. Flagged here so nobody later mistakes it for
 * captured chrome.
 *
 * Approach: scale the real page footage down to sit below a drawn bar, then
 * reveal the URL one character at a time with a sequence of drawtext filters
 * gated on `between(t, ...)`, so it reads as typing rather than appearing.
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const URL_TEXT = "preventli.ai/login";
const BAR_H = 64; // address-bar strip height at 1080p
const W = 1920;
const H = 1080;
/** Seconds before typing starts, and per-character cadence. */
const TYPE_START = 0.35;
const CPS = 22; // characters per second

const [, , inFile, outFile] = process.argv;
if (!inFile || !outFile) {
  console.error("usage: _browser-chrome.mjs <in.mp4> <out.mp4>");
  process.exit(1);
}

function findFont() {
  return [
    "C:/Windows/Fonts/segoeui.ttf",
    "C:/Windows/Fonts/arial.ttf",
    "C:/Windows/Fonts/calibri.ttf",
    "C:/Windows/Fonts/tahoma.ttf",
  ].find((c) => existsSync(c));
}

const font = findFont();
if (!font) {
  console.error("No usable system font found for the address bar text.");
  process.exit(1);
}
const fontEsc = font.replace(/:/g, "\\:");

// Page footage sits below the bar; scale it to fill the remaining height.
const pageH = H - BAR_H;
const filters = [
  `[0:v]scale=${W}:${pageH}:force_original_aspect_ratio=decrease,pad=${W}:${pageH}:(ow-iw)/2:(oh-ih)/2:color=0xF7F8FA[page]`,
  // Bar background + a rounded-ish "URL field" plate.
  `color=c=0xE9EDF2:s=${W}x${BAR_H}:d=1[barbg]`,
  `[barbg]drawbox=x=150:y=14:w=${W - 320}:h=36:color=0xFFFFFF@1:t=fill,` +
    `drawbox=x=150:y=14:w=${W - 320}:h=36:color=0xD3D9E0@1:t=2[barplate]`,
];

// Traffic-light dots + a padlock glyph substitute, drawn as small boxes.
filters.push(
  `[barplate]drawbox=x=28:y=26:w=12:h=12:color=0xFF5F57@1:t=fill,` +
    `drawbox=x=52:y=26:w=12:h=12:color=0xFEBC2E@1:t=fill,` +
    `drawbox=x=76:y=26:w=12:h=12:color=0x28C840@1:t=fill,` +
    `drawbox=x=168:y=24:w=10:h=14:color=0x5F6B7A@1:t=fill[barready]`,
);

// One drawtext per prefix length, each visible only in its own time slice, so
// the URL appears to type itself.
const textFilters = [];
for (let i = 1; i <= URL_TEXT.length; i++) {
  const prefix = URL_TEXT.slice(0, i).replace(/([\\':%])/g, "\\$1");
  const start = (TYPE_START + (i - 1) / CPS).toFixed(3);
  const end = i === URL_TEXT.length ? 9999 : (TYPE_START + i / CPS).toFixed(3);
  textFilters.push(
    `drawtext=fontfile='${fontEsc}':text='${prefix}':x=192:y=22:fontsize=22:` +
      `fontcolor=0x1F2933:enable='between(t,${start},${end})'`,
  );
}
filters.push(`[barready]${textFilters.join(",")}[bar]`);
filters.push(`[bar][page]vstack=inputs=2[outv]`);

execFileSync(
  "ffmpeg",
  [
    "-v", "error", "-y",
    "-i", inFile,
    "-filter_complex", filters.join(";"),
    "-map", "[outv]", "-map", "0:a?",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "veryfast", "-crf", "20", "-r", "30",
    "-c:a", "copy",
    outFile,
  ],
  { stdio: "inherit" },
);
console.log(`[chrome] wrote ${path.basename(outFile)}`);
