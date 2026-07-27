#!/usr/bin/env node
/**
 * Generate narration with Paul's cloned voice, time each SHOT to the slice of
 * narration that describes it, concat, and mux.
 *
 * Why per-shot and not per-chapter: an earlier version slowed the whole
 * stitched chapter by one uniform factor to fit its narration. That drifts —
 * chapter 1's login shot is 7.2s of raw footage against ~7s of "this is where
 * you sign in", but its workspace shot is only 1.8s of footage against ~12s of
 * "your workspace opens... down the left are your clients... anything needing
 * you is flagged". Uniform slowing left the voice describing the workspace
 * while the login page was still on screen (verified 2026-07-27 by extracting
 * a frame at the 8s mark). Each shot now gets its own factor so the words land
 * on the picture they describe.
 *
 * `segments` below are wall-clock narration boundaries measured from a
 * faster-whisper transcript of the generated audio, NOT guesses. Re-measure if
 * a script changes: python video-pipeline/_transcribe_check.py
 *
 * "Preventli" is written phonetically ("Prevent-lee") because ElevenLabs
 * otherwise says "Prevently" — approved by Paul 2026-07-27.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";

const VOICE_ID = "SQgBt2rKZOakldhklsvv"; // "Paul latest" (cloned)
const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error("ELEVENLABS_API_KEY not set");
  process.exit(1);
}

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "video-pipeline", "output");
const NARR = path.join(OUT, "narration");
mkdirSync(NARR, { recursive: true });

const CHAPTERS = [
  {
    id: "01-getting-started",
    // Paul, 2026-07-27: the previous opening said "this is where you sign in
    // — Prevent-lee dot A I slash login" over footage of an EMAIL being typed
    // into the form. Naming a web address describes navigating to a URL; the
    // picture showed filling in credentials. The capture records the page
    // only — Playwright cannot record browser chrome, so there is no address
    // bar to type into and no honest way to show a URL being entered without
    // drawing a fake one. So the words now describe what is actually on
    // screen: signing in with an email and password.
    script:
      "Signing in takes your work email and password — " +
      "no separate app, and nothing to install. " +
      "Your workspace opens to an overview of all your cases. " +
      "Down the left are all your clients. " +
      "Beside the client list is every case, for every client — " +
      "filter, sort, review, approve. " +
      "Anything needing you is flagged right here. You never have to go hunting.",
    // shot 1 = login form + typing, shot 2 = workspace. Re-measure with
    // video-pipeline/_transcribe_check.py after any script change.
    segments: [7.4],
  },
  {
    id: "02-setting-up-a-client",
    script:
      "Setting up a new client takes about a minute. " +
      "At the top of your client list, click the Add button. " +
      "Enter the client company name, " +
      "then add the client's contact details — " +
      "including the email address their reports should go to. " +
      "That notification email is the important one: " +
      "without it, an approved report has nowhere to be sent, " +
      "and the form won't warn you until it fails. " +
      "Then you're asked for the job descriptions " +
      "you'll be checking candidates against for this client. " +
      "You can select several P D Fs at once, and each one becomes its own entry " +
      "in that client's library. " +
      "Press Upload, rather than Done — pressing Done here closes the box " +
      "without saving the files you just chose. " +
      "Load them once, and they're there for every future check.",
    // FIVE shots since 2026-07-27, after a frame check found ~2s of drift
    // through the contact-details stretch: the voice reached "that
    // notification email is the important one" at 13.7s while the cursor was
    // still in the PRIMARY CONTACT email and the notification field sat
    // visibly empty below it. Splitting the dialog in two lets the company
    // name and the contact/notification pair each hold their own slice.
    //
    // Marks are the measured narration boundaries (faster-whisper transcript
    // of this chapter's generated audio):
    //   1 workspace, "click the Add button"        0.0 –  5.9
    //   2 company name                             5.9 –  9.9
    //   3 contact + notification email             9.9 – 22.2
    //   4 JD upload                               22.2 – 40.8
    //   5 checks table                            40.8 – end
    segments: [5.9, 9.9, 22.2, 40.8],
  },
  {
    id: "03-creating-and-sending-checks",
    script:
      "Pick your client from the list on the left, then start a new check. " +
      "Fill in the candidate's name, their email address, " +
      "the role they're going for, and their proposed start date. " +
      "Then choose the job description the check is assessed against. " +
      "The ones you uploaded earlier are right there in the dropdown, " +
      "so the questions match the real demands of that role. " +
      "Create the assessment, review the details, then send it to the worker. " +
      "Nothing is emailed until you press Send to Worker.",
    // Two shots since 2026-07-27: "pick your client, then start a new check"
    // over shot 1, everything from the form onward over shot 2.
    segments: [3.9],
  },
  {
    id: "04-candidate-experience",
    // Rewritten 2026-07-27: the old script was 18s against 44s of footage,
    // leaving 26 seconds of silence, and claimed "matched to the real demands
    // of the role" over pages that never showed the job-specific questions.
    // With OpenRouter now wired in, the JD extraction runs and that page does
    // appear — but the script no longer leans on the claim alone, it walks
    // the sections the candidate actually passes through.
    script:
      "This is what your candidate sees. " +
      "No account, no app — just a secure link that works on their phone. " +
      "It autosaves as they go, so they can stop and pick it up later. " +
      "The first pages are the basics: who they are, and their work history. " +
      "Then the privacy policy and consent, which they have to tick to continue. " +
      "After that comes the health section — " +
      "occupational history, any pre-existing conditions they need to disclose, " +
      "and a functional capacity page covering pain, lifting, standing and sleep. " +
      "There's a mental health section too, using standard wellbeing questions. " +
      "And where the job description lists specific physical demands, " +
      "those become their own questions, so the check is matched to the real role " +
      "rather than a generic tick box. " +
      "At the very end they sign electronically, submit, " +
      "and it lands straight back in your workspace ready for review.",
    // 1: readable opening pages | 2: fast-forward + signature. Footage is
    // longer than narration here, so shot 2 keeps natural speed and the audio
    // is padded with trailing silence rather than the video being sped up.
    segments: [10.6],
  },
];

function dur(file) {
  return parseFloat(
    execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file])
      .toString()
      .trim(),
  );
}

async function synth(chapter) {
  const mp3 = path.join(NARR, `${chapter.id}.mp3`);
  if (existsSync(mp3) && process.env.REUSE_AUDIO === "1") {
    console.log(`[narrate] reusing ${path.basename(mp3)}`);
    return mp3;
  }
  console.log(`[narrate] synthesizing ${chapter.id}...`);
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        text: chapter.script,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true },
      }),
    },
  );
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 300)}`);
  writeFileSync(mp3, Buffer.from(await res.arrayBuffer()));
  return mp3;
}

/** Slow one shot to a target duration; never speed up, freeze-pad the excess. */
function fitShot(src, targetSec, outFile) {
  const d = dur(src);
  let factor = targetSec / d;
  let pad = 0;
  if (factor < 1.0) {
    // Footage already outruns its narration slice — keep natural speed and let
    // the chapter run long rather than fast-forwarding the picture.
    factor = 1.0;
  }
  if (factor > 4.0) {
    pad = targetSec - d * 4.0;
    factor = 4.0;
  }
  const vf =
    pad > 0.05
      ? `setpts=${factor.toFixed(4)}*PTS,tpad=stop_mode=clone:stop_duration=${pad.toFixed(2)},fps=30`
      : `setpts=${factor.toFixed(4)}*PTS,fps=30`;
  execFileSync("ffmpeg", [
    "-v", "error", "-y", "-i", src, "-an", "-vf", vf,
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "veryfast", "-crf", "20",
    "-vsync", "cfr", "-r", "30", outFile,
  ]);
  return { factor, pad, out: dur(outFile) };
}

function buildChapter(chapter, audioFile) {
  const rawDir = path.join(OUT, chapter.id, "raw");
  const shots = readdirSync(rawDir).filter((f) => f.endsWith(".webm")).sort();
  const aDur = dur(audioFile);
  const bounds = [0, ...chapter.segments, aDur];

  // If the segment count doesn't match the shot count, fall back to giving each
  // shot an equal share — loud, not silent, so a stale `segments` list can't
  // quietly produce a misaligned video.
  let targets;
  if (chapter.segments.length + 1 === shots.length) {
    targets = shots.map((_, i) => bounds[i + 1] - bounds[i]);
  } else {
    console.warn(
      `[narrate] ${chapter.id}: ${shots.length} shots but ${chapter.segments.length} segment marks — ` +
        `falling back to equal split. Re-measure segments if this isn't intended.`,
    );
    targets = shots.map(() => aDur / shots.length);
  }

  const fitted = [];
  shots.forEach((s, i) => {
    const src = path.join(rawDir, s);
    const outFile = path.join(NARR, `${chapter.id}.shot${i}.mp4`);
    const r = fitShot(src, targets[i], outFile);
    console.log(
      `[narrate]   ${s}: ${dur(src).toFixed(1)}s -> target ${targets[i].toFixed(1)}s ` +
        `(x${r.factor.toFixed(2)}${r.pad > 0.05 ? `, +${r.pad.toFixed(1)}s freeze` : ""}) = ${r.out.toFixed(1)}s`,
    );
    fitted.push(outFile);
  });

  const listFile = path.join(NARR, `${chapter.id}.concat.txt`);
  writeFileSync(listFile, fitted.map((f) => `file '${f.replace(/\\/g, "/")}'`).join("\n"));
  const silent = path.join(NARR, `${chapter.id}.fitted.mp4`);
  execFileSync("ffmpeg", [
    "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", listFile,
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "veryfast", "-crf", "20", "-r", "30",
    silent,
  ]);

  const vDur = dur(silent);
  const final = path.join(NARR, `${chapter.id}-NARRATED.mp4`);
  execFileSync("ffmpeg", [
    "-v", "error", "-y", "-i", silent, "-i", audioFile,
    "-map", "0:v:0", "-map", "1:a:0",
    "-af", `apad=whole_dur=${vDur.toFixed(2)}`,
    "-c:v", "copy", "-c:a", "aac", "-b:a", "128k", "-ar", "48000", "-ac", "2",
    "-shortest", final,
  ]);
  console.log(`[narrate] ${chapter.id}: video ${vDur.toFixed(1)}s / audio ${aDur.toFixed(1)}s -> ${final}`);
  return final;
}

const results = [];
for (const ch of CHAPTERS) {
  const audio = await synth(ch);
  results.push(buildChapter(ch, audio));
}
console.log("\n[narrate] DONE:");
results.forEach((r) => console.log("  " + r));
