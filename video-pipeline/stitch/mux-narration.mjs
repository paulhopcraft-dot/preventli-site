#!/usr/bin/env node
// Replaces a stitched chapter's silent placeholder audio track with a real
// narration file, once one exists. NOT part of TTS generation — this repo
// and this PR do not call ElevenLabs or any other voice API (no key is
// configured for this pipeline, and Paul's cloned voice is his to run, per
// the brief). This script only muxes an already-recorded narration file
// (any format ffmpeg reads) onto an already-stitched silent chapter video.
//
// Usage (from preventli-site/):
//   node video-pipeline/stitch/mux-narration.mjs <chapterVideo.mp4> <narration.mp3> <output.mp4>
//
// The output's audio track is re-encoded to match reference-params.json
// (aac, same sample rate/channels as every existing chapter) regardless of
// the input narration file's format. Video stream is copied, not
// re-encoded (`-c:v copy`) — muxing narration never touches picture
// quality.
//
// If narration is longer than the video, the video is NOT looped or
// extended — ffmpeg's `-shortest` is deliberately NOT used, so a
// too-short chapter video against a full-length narration file will
// produce a truncated end you can hear immediately in verify-take.mjs's
// output; that's a signal the chapter needs a re-shoot or a trim, not
// something for this script to paper over.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REFERENCE_PARAMS_PATH = path.join(__dirname, "..", "reference-params.json");

function main() {
  const [videoPath, narrationPath, outPath] = process.argv.slice(2);
  if (!videoPath || !narrationPath || !outPath) {
    console.error("Usage: node video-pipeline/stitch/mux-narration.mjs <chapterVideo.mp4> <narration.mp3> <output.mp4>");
    process.exit(1);
  }
  for (const [label, p] of [["video", videoPath], ["narration", narrationPath]]) {
    if (!existsSync(p)) {
      console.error(`[mux-narration] ${label} file not found: ${p}`);
      process.exit(1);
    }
  }
  if (!existsSync(REFERENCE_PARAMS_PATH)) {
    console.error(`[mux-narration] ${REFERENCE_PARAMS_PATH} missing — run probe-reference.mjs first.`);
    process.exit(1);
  }
  const target = JSON.parse(readFileSync(REFERENCE_PARAMS_PATH, "utf8"));

  execFileSync("ffmpeg", [
    "-y",
    "-i", videoPath,
    "-i", narrationPath,
    "-map", "0:v:0",
    "-map", "1:a:0",
    "-c:v", "copy",
    "-c:a", target.audio.codec === "aac" ? "aac" : target.audio.codec,
    "-ar", String(target.audio.sampleRate),
    "-ac", String(target.audio.channels),
    outPath,
  ], { stdio: "inherit" });

  console.log(`[mux-narration] Wrote ${outPath}`);
  console.log(`[mux-narration] Next: node video-pipeline/verify/verify-take.mjs ${outPath}`);
}

main();
