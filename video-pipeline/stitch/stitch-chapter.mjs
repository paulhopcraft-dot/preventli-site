#!/usr/bin/env node
// Concatenates a chapter's per-shot .webm clips (produced by
// `capture/run.ts`, Playwright's native recordVideo) into a single
// chapter-length video, transcoded to match the exact codec/resolution the
// five already-shipped chapters use (see reference-params.json, generated
// by probe-reference.mjs — never hand-typed).
//
// Output is VIDEO-ONLY (silent) — this pipeline does not generate
// narration (no ElevenLabs calls, by design; see docs/video-pipeline.md).
// Lay the ElevenLabs voiceover over the result with mux-narration.mjs once
// it exists; that is a separate, later step, not this one.
//
// Usage (from preventli-site/):
//   node video-pipeline/stitch/stitch-chapter.mjs <chapterId>
//
// Reads:  video-pipeline/output/<chapterId>/raw/*.webm  (sorted by filename
//         — shot ids are numeric-prefixed, e.g. 01-*, 02-*, so filename
//         order IS filming order)
// Writes: video-pipeline/output/<chapterId>/<chapterId>.mp4

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PIPELINE_ROOT = path.resolve(__dirname, "..");
const REFERENCE_PARAMS_PATH = path.join(PIPELINE_ROOT, "reference-params.json");

function loadReferenceParams() {
  if (!existsSync(REFERENCE_PARAMS_PATH)) {
    console.error(
      `[stitch-chapter] ${REFERENCE_PARAMS_PATH} is missing. Run ` +
        `"node video-pipeline/stitch/probe-reference.mjs" first — stitching refuses to guess ` +
        `target codec/resolution parameters.`,
    );
    process.exit(1);
  }
  return JSON.parse(readFileSync(REFERENCE_PARAMS_PATH, "utf8"));
}

function main() {
  const chapterId = process.argv[2];
  if (!chapterId) {
    console.error("Usage: node video-pipeline/stitch/stitch-chapter.mjs <chapterId>");
    process.exit(1);
  }

  const rawDir = path.join(PIPELINE_ROOT, "output", chapterId, "raw");
  if (!existsSync(rawDir)) {
    console.error(`[stitch-chapter] ${rawDir} does not exist. Run capture/run.ts for this chapter first.`);
    process.exit(1);
  }

  const clips = readdirSync(rawDir)
    .filter((f) => f.endsWith(".webm"))
    .sort() // shot ids are numeric-prefixed -> filename sort == filming order
    .map((f) => path.join(rawDir, f));

  if (clips.length === 0) {
    console.error(`[stitch-chapter] No .webm clips found in ${rawDir}.`);
    process.exit(1);
  }

  const target = loadReferenceParams();
  console.log(`[stitch-chapter] ${chapterId}: stitching ${clips.length} clip(s) in this order:`);
  for (const c of clips) console.log(`  - ${path.basename(c)}`);

  const outDir = path.join(PIPELINE_ROOT, "output", chapterId);
  mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${chapterId}.mp4`);

  // Two-pass approach: (1) transcode each .webm clip individually to an
  // intermediate .mp4 matching the target params (recordVideo's raw output
  // resolution can drift slightly from the requested size on some
  // platforms — normalizing per-clip before concat avoids ffmpeg's concat
  // demuxer silently using the first clip's parameters for all of them),
  // (2) concat-demux the normalized clips losslessly (`-c copy`, since
  // they now already share one codec/resolution/rate).
  const tmpDir = mkdtempSync(path.join(tmpdir(), "preventli-stitch-"));
  try {
    const normalized = clips.map((clip, i) => {
      const out = path.join(tmpDir, `${String(i).padStart(3, "0")}.mp4`);
      execFileSync("ffmpeg", [
        "-y",
        "-i", clip,
        // recordVideo output has no audio track; synthesize silence at the
        // target sample rate/channel count so the container matches every
        // other chapter's stream layout even before narration is muxed in.
        // Inputs must both come before any output-side options below, or
        // ffmpeg misattributes them to the second (-f lavfi) input.
        "-f", "lavfi", "-i", `anullsrc=r=${target.audio.sampleRate}:cl=stereo`,
        "-map", "0:v:0",
        "-map", "1:a:0",
        "-vf", `scale=${target.video.width}:${target.video.height},fps=${target.video.frameRate}`,
        "-c:v", target.video.codec === "h264" ? "libx264" : target.video.codec,
        "-pix_fmt", target.video.pixFmt,
        "-preset", "medium",
        "-crf", "18",
        "-shortest",
        "-c:a", target.audio.codec === "aac" ? "aac" : target.audio.codec,
        "-ar", String(target.audio.sampleRate),
        "-ac", String(target.audio.channels),
        out,
      ], { stdio: "inherit" });
      return out;
    });

    const concatListPath = path.join(tmpDir, "concat.txt");
    writeFileSync(
      concatListPath,
      normalized.map((f) => `file '${f.replace(/'/g, "'\\''")}'`).join("\n") + "\n",
    );

    execFileSync("ffmpeg", [
      "-y",
      "-f", "concat", "-safe", "0",
      "-i", concatListPath,
      "-c", "copy",
      outFile,
    ], { stdio: "inherit" });
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }

  console.log(`[stitch-chapter] Wrote ${outFile}`);
  console.log(`[stitch-chapter] NOTE: silent (no narration track) — see mux-narration.mjs once VO exists.`);
}

main();
