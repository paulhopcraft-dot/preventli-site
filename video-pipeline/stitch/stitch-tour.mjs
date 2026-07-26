#!/usr/bin/env node
// Concatenates already-stitched chapter .mp4s (see stitch-chapter.mjs) plus
// intro.mp4 into one "full tour" file, matching the site's own stitched
// video (the one the 2026-07-26 audit examined). All inputs are expected
// to already share codec/resolution/rate — stitch-chapter.mjs guarantees
// this for freshly re-recorded chapters; existing public/welcome/*.mp4
// files already match per reference-params.json. Lossless concat
// (`-c copy`), no re-encode.
//
// Usage (from preventli-site/):
//   node video-pipeline/stitch/stitch-tour.mjs \
//     [--chapter <id>=<path>]...  # override any chapter with a freshly
//                                 # re-recorded file; omitted chapters fall
//                                 # back to the current public/welcome/*.mp4
//
// Example — only chapter 2 was re-recorded this round:
//   node video-pipeline/stitch/stitch-tour.mjs \
//     --chapter 02-setting-up-a-client=video-pipeline/output/02-setting-up-a-client/02-setting-up-a-client.mp4

import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");

const CHAPTER_DEFAULTS = {
  intro: path.join(REPO_ROOT, "public", "welcome", "intro.mp4"),
  "01-getting-started": path.join(REPO_ROOT, "public", "welcome", "getting-started.mp4"),
  "02-setting-up-a-client": path.join(REPO_ROOT, "public", "welcome", "setting-up-a-client.mp4"),
  "03-creating-and-sending-checks": path.join(REPO_ROOT, "public", "welcome", "creating-and-sending-checks.mp4"),
  "04-candidate-experience": path.join(REPO_ROOT, "public", "welcome", "the-candidate-experience.mp4"),
  "05-clinical-review": path.join(REPO_ROOT, "public", "welcome", "clinical-review.mp4"),
};
const ORDER = Object.keys(CHAPTER_DEFAULTS);

function parseOverrides(argv) {
  const overrides = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--chapter" && argv[i + 1]) {
      const [id, filePath] = argv[i + 1].split("=");
      overrides[id] = filePath;
      i++;
    }
  }
  return overrides;
}

function main() {
  const overrides = parseOverrides(process.argv.slice(2));
  for (const id of Object.keys(overrides)) {
    if (!ORDER.includes(id)) {
      console.error(`[stitch-tour] Unknown chapter id "${id}". Valid ids: ${ORDER.join(", ")}`);
      process.exit(1);
    }
  }

  const files = ORDER.map((id) => overrides[id] ?? CHAPTER_DEFAULTS[id]);
  for (const f of files) {
    if (!existsSync(f)) {
      console.error(`[stitch-tour] Missing input: ${f}`);
      process.exit(1);
    }
  }

  console.log("[stitch-tour] Order:");
  ORDER.forEach((id, i) => console.log(`  ${i + 1}. ${id} <- ${files[i]}${overrides[id] ? "  (override)" : ""}`));

  const tmpDir = mkdtempSync(path.join(tmpdir(), "preventli-tour-"));
  try {
    const listPath = path.join(tmpDir, "concat.txt");
    writeFileSync(listPath, files.map((f) => `file '${f.replace(/'/g, "'\\''")}'`).join("\n") + "\n");

    const outFile = path.join(REPO_ROOT, "video-pipeline", "output", "preventli-partner-onboarding-full.mp4");
    execFileSync("ffmpeg", ["-y", "-f", "concat", "-safe", "0", "-i", listPath, "-c", "copy", outFile], {
      stdio: "inherit",
    });
    console.log(`[stitch-tour] Wrote ${outFile}`);
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
}

main();
