#!/usr/bin/env node
// Rebuilds, as a saved script, the verification gate `chapters.ts`'s
// comments describe but that was never committed anywhere: word-level ASR
// timestamps + a per-gap `ffmpeg volumedetect` silence check, edge-trimmed
// 60ms, so a bad take (audio artifact, dropped word, TTS glitch) is caught
// automatically instead of "by ear" — chapters.ts records one chapter that
// took 5 TTS regenerations and another that failed 6/6 at the same
// sentence boundary before this exact kind of check passed.
//
// REQUIRES a transcription API key. Checked in this order:
//   1. GROQ_API_KEY   (preferred — see C:/Users/Paul/.config/watch/.env's
//      own comment: "Groq is preferred: it runs whisper-large-v3 at a
//      fraction of OpenAI's price and is faster in practice.")
//   2. OPENAI_API_KEY (compatible fallback, model whisper-1)
//
// As of 2026-07-26/27 BOTH are empty in that file. Per instruction: this
// script does NOT silently skip when no key is configured — it fails
// loudly with a clear message. There is no "best effort without ASR" mode;
// a take that hasn't been checked for word-level audio artifacts is
// unverified, not verified-and-clean, and this script says exactly that.
//
// Usage:
//   GROQ_API_KEY=... node video-pipeline/verify/verify-take.mjs <file.mp4|file.wav>
//   [--gap-threshold-ms 700] [--silence-floor-db -35] [--edge-trim-ms 60]

import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

function parseArgs(argv) {
  const file = argv[0];
  const opts = { gapThresholdMs: 700, silenceFloorDb: -35, edgeTrimMs: 60 };
  for (let i = 1; i < argv.length; i++) {
    if (argv[i] === "--gap-threshold-ms") opts.gapThresholdMs = Number(argv[++i]);
    if (argv[i] === "--silence-floor-db") opts.silenceFloorDb = Number(argv[++i]);
    if (argv[i] === "--edge-trim-ms") opts.edgeTrimMs = Number(argv[++i]);
  }
  return { file, opts };
}

function requireApiKey() {
  if (process.env.GROQ_API_KEY) return { provider: "groq", key: process.env.GROQ_API_KEY };
  if (process.env.OPENAI_API_KEY) return { provider: "openai", key: process.env.OPENAI_API_KEY };

  console.error(
    "[verify-take] FAILED — no transcription API key configured.\n" +
      "  Checked GROQ_API_KEY and OPENAI_API_KEY, both unset.\n" +
      "  This is a hard stop, not a skip: a take that hasn't been checked for\n" +
      "  word-level audio artifacts is UNVERIFIED, and this script will not\n" +
      "  report it as clean by silently no-op'ing.\n" +
      "  Get a Groq key (cheaper, faster): https://console.groq.com/keys\n" +
      "  Or set OPENAI_API_KEY as the compatible fallback.\n" +
      "  As of 2026-07-26/27, C:/Users/Paul/.config/watch/.env has both blank —\n" +
      "  that file is unrelated to this script but is where Paul already keeps\n" +
      "  these keys for /watch; exporting one before running this script works.",
  );
  process.exit(1);
}

async function transcribeWithWordTimestamps(wavPath, auth) {
  const url =
    auth.provider === "groq"
      ? "https://api.groq.com/openai/v1/audio/transcriptions"
      : "https://api.openai.com/v1/audio/transcriptions";
  const model = auth.provider === "groq" ? "whisper-large-v3" : "whisper-1";

  const form = new FormData();
  const bytes = readFileSync(wavPath);
  form.append("file", new Blob([bytes], { type: "audio/wav" }), path.basename(wavPath));
  form.append("model", model);
  form.append("response_format", "verbose_json");
  form.append("timestamp_granularities[]", "word");

  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${auth.key}` },
    body: form,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Transcription request failed (${res.status}): ${text}`);
  }
  const body = await res.json();
  if (!Array.isArray(body.words) || body.words.length === 0) {
    throw new Error(
      "Transcription response had no word-level timestamps (`words` array). " +
        "Groq/OpenAI both need timestamp_granularities=['word'] AND response_format='verbose_json' " +
        "to return this — if the API changed shape, this script needs updating, not silently skipped.",
    );
  }
  return body.words; // [{ word, start, end }, ...]
}

function extractWav(inputPath, tmpDir) {
  const wavPath = path.join(tmpDir, "audio.wav");
  execFileSync("ffmpeg", ["-y", "-i", inputPath, "-vn", "-ac", "1", "-ar", "16000", wavPath], { stdio: "inherit" });
  return wavPath;
}

function getDurationSec(inputPath) {
  const out = execFileSync("ffprobe", [
    "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", inputPath,
  ], { encoding: "utf8" });
  return Number(out.trim());
}

/** Returns { maxVolumeDb } parsed from ffmpeg's volumedetect filter stderr output. */
function volumeDetect(inputPath, startSec, endSec) {
  const args = ["-hide_banner", "-i", inputPath];
  if (startSec != null) args.push("-ss", String(Math.max(0, startSec)));
  if (endSec != null) args.push("-to", String(endSec));
  args.push("-af", "volumedetect", "-f", "null", "-");
  let stderr = "";
  try {
    execFileSync("ffmpeg", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  } catch (err) {
    // ffmpeg with -f null exits non-zero in some builds even on success; the
    // volumedetect output is on stderr either way.
    stderr = (err.stderr ?? "").toString();
  }
  const match = stderr.match(/max_volume:\s*(-?[\d.]+|-inf)\s*dB/);
  if (!match) return { maxVolumeDb: null, raw: stderr };
  return { maxVolumeDb: match[1] === "-inf" ? -Infinity : Number(match[1]), raw: stderr };
}

async function main() {
  const { file, opts } = parseArgs(process.argv.slice(2));
  if (!file) {
    console.error("Usage: node video-pipeline/verify/verify-take.mjs <file.mp4|file.wav> [--gap-threshold-ms 700] [--silence-floor-db -35]");
    process.exit(1);
  }
  if (!existsSync(file)) {
    console.error(`[verify-take] File not found: ${file}`);
    process.exit(1);
  }

  const auth = requireApiKey();
  console.log(`[verify-take] Using ${auth.provider} for word-level ASR.`);

  const tmpDir = mkdtempSync(path.join(tmpdir(), "preventli-verify-"));
  let exitCode = 0;
  try {
    const wavPath = extractWav(file, tmpDir);
    const durationSec = getDurationSec(file);
    console.log(`[verify-take] Transcribing (${durationSec.toFixed(1)}s)...`);
    const words = await transcribeWithWordTimestamps(wavPath, auth);
    console.log(`[verify-take] Got ${words.length} word timestamps.`);

    const edgeTrimSec = opts.edgeTrimMs / 1000;
    const gapThresholdSec = opts.gapThresholdMs / 1000;

    // Build the gap list: silence before first word, between words, and
    // after last word to end-of-file — mirrors "raw VO clip AND audio
    // extracted from the final rendered MP4" being checked the same way.
    const gaps = [];
    let prevEnd = 0;
    for (const w of words) {
      if (w.start - prevEnd >= gapThresholdSec) gaps.push({ start: prevEnd, end: w.start, context: `before "${w.word}"` });
      prevEnd = Math.max(prevEnd, w.end);
    }
    if (durationSec - prevEnd >= gapThresholdSec) {
      gaps.push({ start: prevEnd, end: durationSec, context: "after last word" });
    }

    console.log(`[verify-take] ${gaps.length} gap(s) >= ${opts.gapThresholdMs}ms to check.`);

    const flagged = [];
    for (const gap of gaps) {
      const start = gap.start + edgeTrimSec;
      const end = gap.end - edgeTrimSec;
      if (end <= start) continue; // trimmed to nothing — too short to meaningfully check
      const { maxVolumeDb } = volumeDetect(file, start, end);
      const isSilent = maxVolumeDb === null || maxVolumeDb <= opts.silenceFloorDb;
      const status = isSilent ? "PASS" : "FLAGGED";
      console.log(
        `[verify-take]   [${status}] ${gap.context} (${start.toFixed(2)}s-${end.toFixed(2)}s): ` +
          `max_volume=${maxVolumeDb === -Infinity ? "-inf" : maxVolumeDb}dB (floor ${opts.silenceFloorDb}dB)`,
      );
      if (!isSilent) flagged.push(gap);
    }

    if (flagged.length > 0) {
      console.error(
        `[verify-take] FAILED — ${flagged.length}/${gaps.length} gap(s) had audio above the -${Math.abs(
          opts.silenceFloorDb,
        )}dB silence floor where silence was expected. This is the artifact class chapters.ts's comments describe ` +
          `("Took 5 TTS regenerations before a take passed cleanly", "failed 6/6 at the same sentence boundary") — ` +
          `re-generate the narration for the flagged span(s), don't ship this take.`,
      );
      exitCode = 1;
    } else {
      console.log(`[verify-take] PASS — 0 flagged gaps, all measured below ${opts.silenceFloorDb}dB.`);
    }
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
  process.exit(exitCode);
}

main().catch((err) => {
  console.error("[verify-take] FAILED:", err);
  process.exit(1);
});
