#!/usr/bin/env node
// Probes the existing shipped chapter videos with ffprobe and writes the
// measured codec/resolution/rate parameters to reference-params.json.
//
// This is the source of truth `stitch-chapter.mjs` and `stitch-tour.mjs`
// transcode new footage to, so a re-recorded chapter is byte-compatible
// with the four chapters that are NOT being touched in this round. Never
// hand-edit reference-params.json — re-run this script instead, so the
// numbers always trace back to a real `ffprobe` measurement of a real file.
//
// Usage:
//   node video-pipeline/stitch/probe-reference.mjs
//
// Requires: ffprobe on PATH (ships with the ffmpeg Windows build already
// installed on this machine — `ffprobe -version` to confirm).

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const WELCOME_DIR = path.join(REPO_ROOT, "public", "welcome");
const OUT_FILE = path.join(__dirname, "..", "reference-params.json");

function probeOne(file) {
  const raw = execFileSync(
    "ffprobe",
    [
      "-v", "error",
      "-print_format", "json",
      "-show_streams",
      "-show_format",
      file,
    ],
    { encoding: "utf8" },
  );
  const parsed = JSON.parse(raw);
  const video = parsed.streams.find((s) => s.codec_type === "video");
  const audio = parsed.streams.find((s) => s.codec_type === "audio");
  return {
    file: path.basename(file),
    durationSec: Number(parsed.format.duration),
    video: video && {
      codec: video.codec_name,
      width: video.width,
      height: video.height,
      pixFmt: video.pix_fmt,
      frameRate: video.r_frame_rate,
      bitRate: video.bit_rate ? Number(video.bit_rate) : null,
    },
    audio: audio && {
      codec: audio.codec_name,
      sampleRate: audio.sample_rate ? Number(audio.sample_rate) : null,
      channels: audio.channels,
      bitRate: audio.bit_rate ? Number(audio.bit_rate) : null,
    },
  };
}

function mostCommon(values) {
  const counts = new Map();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

function main() {
  if (!existsSync(WELCOME_DIR)) {
    console.error(`[probe-reference] ${WELCOME_DIR} does not exist.`);
    process.exit(1);
  }
  const files = readdirSync(WELCOME_DIR)
    .filter((f) => f.endsWith(".mp4"))
    .map((f) => path.join(WELCOME_DIR, f));

  if (files.length === 0) {
    console.error("[probe-reference] No .mp4 files found under public/welcome/.");
    process.exit(1);
  }

  const probes = files.map(probeOne);

  const target = {
    generatedAt: new Date().toISOString(),
    generatedFrom: probes.map((p) => p.file),
    // The value every existing chapter agrees on, so a re-recorded chapter
    // encodes to match them exactly. If chapters ever disagree, this picks
    // the majority value and `stitch-chapter.mjs` will warn, not guess.
    video: {
      codec: mostCommon(probes.map((p) => p.video.codec)),
      width: mostCommon(probes.map((p) => p.video.width)),
      height: mostCommon(probes.map((p) => p.video.height)),
      pixFmt: mostCommon(probes.map((p) => p.video.pixFmt)),
      frameRate: mostCommon(probes.map((p) => p.video.frameRate)),
    },
    audio: {
      codec: mostCommon(probes.map((p) => p.audio?.codec).filter(Boolean)),
      sampleRate: mostCommon(probes.map((p) => p.audio?.sampleRate).filter(Boolean)),
      channels: mostCommon(probes.map((p) => p.audio?.channels).filter(Boolean)),
    },
    perFile: probes,
  };

  writeFileSync(OUT_FILE, JSON.stringify(target, null, 2) + "\n");
  console.log(`[probe-reference] Wrote ${OUT_FILE}`);
  console.log(
    `[probe-reference] Target: ${target.video.width}x${target.video.height} ` +
      `${target.video.codec}/${target.video.pixFmt} @ ${target.video.frameRate}fps, ` +
      `audio ${target.audio.codec} ${target.audio.sampleRate}Hz x${target.audio.channels}ch`,
  );
}

main();
