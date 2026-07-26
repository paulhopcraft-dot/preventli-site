# Chapter 2 ("Setting up a client") re-record — brief + blocker

Date: 2026-07-26
Status: **Blocked on production pipeline access.** No video changed. Copy/data
fixes for this same audit landed separately in this PR (see `lib/welcome/workflow.ts`).

## Why this doc exists

A 2026-07-26 audit against live production found the v3 chapter videos (shipped
2026-07-25 night, commit `9344a597`) still have real defects — confirmed against
the running app, not guessed. This doc is the shot list + casting + sequencing
brief for whoever re-records `setting-up-a-client.mp4` next, so none of this has
to be re-derived. It intentionally does **not** attempt the re-record itself.

## Pipeline research (read this before attempting a rebuild)

Asked to locate the existing chapter-video production pipeline before touching
anything. Searched `preventli-site`, `preventli` (including the two files
literally named `capture.md` / `analyze-video.ps1` / `transcribe-video.ps1`
called out in the brief), every `.claude/worktrees/*` under both repos, all
branches/tags across both repos' full git history, and the `session-4-preventli-web.md`
journal. Conclusion: **no runnable, documented pipeline script exists.**

What actually exists:

- `preventli/analyze-video.ps1` + `transcribe-video.ps1` + `.claude/commands/capture.md`
  — a **different, unrelated tool**: downloads a YouTube video, transcribes it
  with local Whisper, and preps it for a "is this relevant to our roadmap" PRD
  writeup. Name collision only; nothing to do with producing these chapters.
- The real production method, reconstructed from commit messages (`a115985`,
  `2066586`, `9344a597`) and `session-4-preventli-web.md:3155-3158` (worktree
  `responding-re-keegan-644c8c`, 2026-07-24, "Partner onboarding hub SHIPPED"):
  1. **Footage**: real screen capture against a local dev instance of the
     `preventli` app, seeded with a fictional demo-partner tenant so no real
     partner/candidate data is ever on screen.
  2. **Voiceover**: ElevenLabs TTS, Paul's own cloned voice ("Paul's EL voice"
     per the journal). `ELEVENLABS_API_KEY` is present in this machine's user
     env and has full `text_to_speech` access (Paul widened it 2026-07-23 —
     see journal line ~3119 for a different video, same key). Synthesis was
     requested "with-timestamps" (word-level timing in the API response).
  3. **Verification gate** (referenced in `chapters.ts` comments): word-level
     timestamps + per-gap `ffmpeg volumedetect`, edge-trimmed 60ms, run against
     both the raw VO clip and the audio extracted from the final rendered MP4.
     `ffmpeg` is on PATH; the actual gate script is **not** committed anywhere
     — every rebuild commit describes it as freshly iterated in-session ("Took
     5 TTS regenerations before a take passed cleanly"), not invoked from a
     saved tool.
  4. **Composition**: `ffmpeg`, ad hoc.
- **Demo tenant**: "Vantage RTW Partners" (`org-demo-partner`), seeded by
  `server/seed-demo-partner.ts` — this file only exists on branch
  `claude/preventli-onboarding-video-8a9c5d` in the `preventli` repo (**PR #312,
  open, unmerged**, worktree `preventli/.claude/worktrees/responding-re-keegan-644c8c`).
  It creates 10 fictional client orgs against a **local dev DB on WSL Postgres
  port 5433**. As of this audit, WSL itself is installed but **stopped**
  (`wsl.exe -l -v` shows `Ubuntu` = Stopped), so there is no live local
  environment to capture fresh footage against right now — it would need to be
  started, the app run locally (`npm run dev` in `preventli`), and PR #312
  merged or checked out first.

Net: the pieces (voice, key, ffmpeg, seed data) all exist and are individually
usable, but there is no single "run this to rebuild a chapter" tool, and the
capture environment is currently down. Per instruction, stopping here rather
than assembling a new pipeline from these parts inside this session — that's a
multi-hour, human-in-the-loop production task (prior rebuilds took multiple
TTS takes and live iteration), not a mechanical fix to a marketing-site repo.

## What must be true before filming starts

1. WSL/Ubuntu started, Postgres reachable on `5433`.
2. `preventli` PR #312 (`claude/preventli-onboarding-video-8a9c5d`) merged or
   checked out, `server/seed-demo-partner.ts` run against that local DB.
3. `preventli` running locally (`npm run dev`) on a commit at least as new as
   `main @ b3079cf6` (real "New check" button, PR #306) — v3 already required
   this; nothing older.
4. **New for this rebuild**: the seed data's `coastline-aged-care-group` client
   currently seeds only **one** JD (see Casting below). The batch-upload beat
   (item 4) needs three. Either add two more role-coherent JD entries to that
   client in `seed-demo-partner.ts` (e.g. a Registered Nurse and a Support
   Worker position description — same care-sector family as PCA, so all three
   read as things one aged-care employer would actually post), or generate
   three simple placeholder PDFs with those titles and upload them live during
   the recording (the upload dialog doesn't require them to be seeded — see
   item 4 below).
5. Confirm live, immediately before filming, that JD requirement extraction is
   still broken (`requirementsExtractionStatus`) — if the sibling PR fixing it
   in `preventli` has landed, item 10 below changes from "do not film" to
   "film it, it's real now."

## Casting — use this pairing, don't invent one

Coordinator's new requirement: the role on the check and the JD selected must
visibly belong together (example given: a Carer role + a PCA job description).
`server/seed-demo-partner.ts` already has an exact fit, no invention needed:

- **Client**: Coastline Aged Care Group (Geelong, VIC)
- **Candidate/worker**: Priya Nair, role "Personal Care Assistant"
- **Existing JD**: "Personal Care Assistant — Position Description" — manual
  handling, 2-person patient transfers, extended standing/walking, occasional
  bending/kneeling, possible overnight shifts

This is a materially better choice than the vet-clinic org used for the
coordinator's plumbing-verification test earlier today (a vet clinic hiring
"Carers"/PCAs doesn't read as coherent) — don't reuse that org's client/JD
names in the actual footage. Add two sibling JDs to the same client so the
batch-of-3 in item 4 is *also* internally coherent (e.g. "Registered Nurse —
Position Description", "Support Worker — Position Description").

## Shot list for `setting-up-a-client.mp4`

In filming order. Each item tags which confirmed-live defect it fixes.

1. **Open already inside the workspace** — no login screen, no typing
   `demo@vantagertw.example.com.au` again. Chapter 1 already covered login;
   this chapter starts on the partner workspace / client list. *(fixes #3 —
   redundant login)*
2. Click **Add a client**. Fill the dialog: Name = "Coastline Aged Care Group"
   (only required field — say so on camera), optionally Employee count. Don't
   burn screen time on every optional field.
3. Submit → `"Coastline Aged Care Group created"` dialog appears with "Add job
   description PDFs for this client now, or skip and add them later from
   'Edit client'." + **Select PDF files** + **Done**.
4. Click **Select PDF files** → select **three** files: "Personal Care
   Assistant — Position Description", "Registered Nurse — Position
   Description", "Support Worker — Position Description". *(fixes #4 — batch
   upload; also delivers the new role-coherence requirement)*
5. **Show the two-step explicitly, on screen, don't skip it**: after selecting,
   the three files appear *staged* — each with an editable title field and an
   ×. Nothing has saved yet. Narrate this plainly: "These are staged, not
   saved yet." Point out both buttons: the small **Upload 3 file(s)** button
   (the real save action) and the separate, bigger, brighter-green **Done**
   button sitting right below it that looks like the obvious next step but
   actually **discards the staged files**. Click **Upload 3 file(s)**, not
   Done. Show the success state (toast / library list) confirming all three
   saved. *(fixes #5 — the two-step upload trap; this is the single
   highest-value fix in the whole chapter, per the brief: it was hit live
   during testing — 3 files appeared staged, API returned zero, because Done
   was clicked instead of Upload)*
6. Only **now**, with the JD upload box/dialog physically on screen, narrate
   what job descriptions are for and why uploading them up front pays off
   later ("saved to this client's library, so next time you create a check for
   them you just pick one instead of re-uploading"). *(fixes #6 — narration
   timing; previously this narration ran before any JD UI was visible)*
7. If the chapter revisits the workspace/clients overview table at any point
   (open question — confirm the exact on-screen moment when filming; the brief
   groups this under chapter 2 but the table may actually live in chapter 1's
   footage), make sure the columns shown are **Worker, Type, Client, Last
   activity, Next action, Risk** — live has a Risk column the current video is
   missing. *(fixes #7)*

## What happens next, in chapter 3 — do not try to squeeze this into chapter 2

The coordinator's new requirement doesn't end at "upload a PCA JD" — the
payoff (picking that JD when creating a check for a matching role, then seeing
requirements pulled from it) happens on the **New Pre-Employment Check** form,
which is chapter 3 (`creating-and-sending-checks.mp4`), not chapter 2. Flagging
so scope doesn't quietly stay stuck inside chapter 2 or silently expand this
PR's deliverable:

8. In chapter 3's rebuild: create the check for **Priya Nair / Personal Care
   Assistant** at Coastline Aged Care Group. Open the **Saved job description**
   dropdown and show it listing the three uploaded titles (this loop is
   verified working live today — org `2987ad55-70e3-4859-9e16-763c03a7fd4a`,
   three JDs uploaded, dropdown correctly listed all three). Select "Personal
   Care Assistant — Position Description" — same role name as the badge, same
   JD title, visibly paired. **Safe to film now.**
9. **Do NOT film or narrate** the check being "dynamically set up to
   incorporate requirements" from that JD. JD requirement extraction is
   currently broken in production (`requirementsExtractionStatus: "failed"`,
   `extractedRequirementsJson: null` on 4/4 files tested) — a separate PR
   against `preventli` is fixing it. Do not mock up or fabricate what
   extracted requirements would look like. This must be the **last** beat
   added to chapter 3, and if the extraction fix hasn't landed by the time
   chapter 3 is otherwise ready, ship chapter 3 without it and mark this PR's
   description "blocked-pending-extraction-fix" rather than guessing.

## Numbering inconsistency — separate, cross-cutting defect

The stitched full-tour video (`D:\Downloads\preventli-partner-onboarding-full.mp4`,
3:54 — **not** `...-full.STALE-2026-07-24.mp4`, that copy is stale and should
be ignored/deleted once a corrected stitch exists) has on-screen chapter title
cards reading "01 · Getting Started", "02 · Your Dashboard", "03 · Adding a
Client". `lib/welcome/chapters.ts` is the source of truth and disagrees:
chapter 2 is "Setting up a client", chapter 3 is "Creating and sending checks" —
"Your Dashboard" and "Adding a Client" don't exist as chapter titles at all.

This is **not** a site-code defect — the live site never embeds the stitched
file; "Take the full tour" on `/partner-onboarding` plays the five individual
`CHAPTERS[]` entries back to back in the lightbox, and that numbering is
already derived correctly from `chapters.ts` (`VideoLightbox.tsx`: `Chapter
{chapterNumber} of {totalChapters}`, `components/welcome/WorkflowMap.tsx`:
`CHAPTERS.findIndex(...) + 1`). The mismatch is baked into the stitched MP4's
title-card graphics only. Fix means either re-rendering those title cards to
match `chapters.ts` verbatim, or (cheaper) re-stitching from the current
`public/welcome/*.mp4` chapter files with cards generated programmatically
from `chapters.ts` instead of hand-typed, so this class of drift can't recur.

## Check-type badge text ("Pre-Employment Health Check" -> "Pre-Employment Check")

Searched all of `preventli-site` for this exact string — **zero matches**.
It does not appear anywhere in site copy, so there is nothing to text-edit
here; it is purely an on-screen UI badge inside chapter footage. Which
chapter shows it wasn't confirmed (creating a check, chapter 3, is the more
likely location than chapter 2 — the badge is check-type, not client-setup) —
confirm the exact frame before re-recording rather than assuming.

## Explicit non-goals for whoever picks this up

- Do not build a new one-shot capture/TTS/verify script "to unblock this" —
  the prior rebuilds all took multiple live takes and human judgment calls
  (script wording, pacing, what to skip); treat this as production work, not
  automation work.
- Do not touch `preventli` (a separate, guarded, live repo) from a
  `preventli-site` session. PR #312 needs Paul's own merge decision.
- Do not fabricate or mock up extracted-JD-requirements UI (item 9).
