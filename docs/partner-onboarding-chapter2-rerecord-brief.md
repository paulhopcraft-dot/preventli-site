# Chapter 2 ("Setting up a client") re-record — brief + blocker

Date: 2026-07-26 (updated same day — coordinator follow-up added the Ask Alex
requirement + two newly-verified UI facts, see bottom two sections)
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
8. **Closing beat — Ask Alex.** After the JD upload succeeds, a short shot of
   the green "Chat with Alex" button (bottom right, always present) and a
   partner asking it a question. **Do not film this yet** — see the "Ask
   Alex" section below, it's blocked on two things and neither is closeable
   from this repo. Placement here is a recommendation, not a constraint: it
   reads naturally as "you've just finished setup, and help is always a click
   away," but since the button is global chrome it would work just as well at
   the end of chapter 1 or chapter 5 — whoever films it should pick whichever
   moment the blocker clears in time for.

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
9. **Show the send confirmation as a genuine two-step, not instant-send** —
   newly verified 2026-07-26, and confirmed independently in this pass against
   `preventli/client/src/pages/NewAssessmentPage.tsx`. The current hub copy
   actively misleads on this: the workflow map's `send-check` node says "Send
   to candidate — Secure link, straight away," which reads as automatic. Real
   flow: clicking **Create Assessment** only creates the record (`status:
   "created"`, `sentAt: null`) — nothing is emailed yet. A separate **"Ready
   to send"** card then appears (badge "Created", `NewAssessmentPage.tsx:254`)
   showing Candidate / Email / Position, with two buttons: **Not now**
   (`:289`, backs out to `/checks`, nothing sent) and **Send to Worker**
   (`:297`, the real send — flips to `status: "sent"` with a `sentAt`
   timestamp, UI shows "Questionnaire sent! A secure link has been emailed to
   `<address>`. You'll be notified automatically once they complete it.",
   `:224-229`). Film both buttons on screen and narrate that nothing goes out
   until "Send to Worker" is clicked — this is good, deliberate design (a
   partner can review before committing), and the video should say so, not
   just show it.
   Fast-follow candidate, not done in this PR: `lib/welcome/workflow.ts`'s
   `send-check` node detail text ("Secure link, straight away") is now
   verified misleading given this two-step flow — worth changing to something
   like "Review, then send" once someone signs off on exact wording. Left
   alone here because this round of work was scoped to updating this brief
   doc, not making further site-copy edits, and hub copy elsewhere in this
   repo is marked "approved by Paul, do not edit without sign-off"
   (`lib/welcome/faq.ts`) — treating workflow-node copy with the same caution
   by default.
   **UI gap worth knowing before filming this beat**: the "Ready to send" card
   has code to show a "Job Description" row with the attached filename
   (`NewAssessmentPage.tsx:273-281`, paperclip icon + `jdFile.name`), but the
   condition that gates it — `{jdFile && (...)}` — is only ever true when the
   JD came from a **fresh upload on this same form**. Picking a **saved** JD
   from the "Saved job description" dropdown instead (the path this video
   uses) sets a different field, `selectedJobDescriptionId` (state declared
   around `:88`, read at submit time `:152`), which that conditional never
   checks — so the card silently shows no JD row at all even though one is
   genuinely attached to the check. This is the same gap Paul hit live
   ("could not tell whether the JD had been added"), traced to its exact
   line. Not this PR's to fix (lives in `preventli`), but it changes how to
   shoot the JD payoff: **don't frame the "Ready to send" card as visual proof
   the PCA JD landed** — for the saved-JD path it won't show one. Narrate the
   pairing at the dropdown-selection moment (item 8 above) instead, where it
   is actually visible on screen, and either cut past the JD row on the
   confirmation card or don't dwell on it.
10. **Do NOT film or narrate** the check being "dynamically set up to
    incorporate requirements" from that JD. JD requirement extraction is
    currently broken in production (`requirementsExtractionStatus: "failed"`,
    `extractedRequirementsJson: null` on 4/4 files tested) — a separate PR
    against `preventli` is fixing it. Do not mock up or fabricate what
    extracted requirements would look like. This must be the **last** beat
    added to chapter 3, and if the extraction fix hasn't landed by the time
    chapter 3 is otherwise ready, ship chapter 3 without it and mark this PR's
    description "blocked-pending-extraction-fix" rather than guessing.

## Ask Alex — new requirement, BLOCKED

Added 2026-07-26 (coordinator follow-up, same day as the rest of this brief).
Paul wants a shot of a partner asking Alex — the in-app assistant, green "Chat
with Alex" button, bottom right, present throughout the partner UI; panel
header "Alex — Your case manager"; opens with a greeting such as "Good
afternoon, Workbetter! How's the day going? I've been keeping an eye on your
cases. Anything you need a hand with?" — a question and getting help.
Suggested placement is the closing beat of chapter 2 (item 8 above), but
that's a recommendation, not a constraint — the button is global chrome, so it
would work in chapter 1 or chapter 5 too.

**Do not film this section yet.** Two independent problems, both need to be
closed first:

### 1. Alex gives a factually wrong answer to the obvious question

Live-verified 2026-07-26. Asked "How do I add a job description?", Alex
replied:

> [Case Manager] You can add a job description directly from any case's
> workspace — just open the case, head to the "Job Description" tab, and
> either upload a file or paste the text in. If you're setting up a new case
> right now, I can walk you through that and we'll add the job description as
> part of it.

Wrong on both counts:
- There is no "Job Description" tab anywhere in the product — confirmed by
  grepping all of `client/src` on `origin/main` for any such tab, zero
  matches. Alex invented it.
- Job descriptions are a **client-level library**, not per-case. The real
  paths: on client creation, the "`<Name> created`" dialog offers "Select PDF
  files" (item 3 above); later, Edit client → Job descriptions → select files
  → "Upload N file(s)". They then appear in the "Saved job description"
  dropdown when creating a check (item 8 above).

Do not film this exact question until Alex's knowledge is corrected. Do not
substitute a different question without independently verifying its answer
against the real UI first — **that verification was not done in this pass**:
this session had no partner login credentials and did not access the live
Alex chat itself (everything above about Alex's wrong answer is the
coordinator/Paul's live finding, relayed here, not re-tested by this session).
No replacement question has been confirmed safe. If a replacement is wanted
before the knowledge fix lands, whoever has partner access should test
candidates live rather than assume any of them are safe — Alex hallucinating
on the JD question is evidence it can hallucinate on adjacent ones, so don't
assume e.g. "how do I create a check" is fine without checking it too.

### 2. This hub cut "Ask Alex" once already — confirm the reason is actually gone

This hub had an Alex feature once, then deliberately removed it:
`preventli-site` commit `a1a6cb0` (2026-07-24, "cut Ask Alex (#17)") —
"Alex chat is 403-blocked for restricted partners, so it doesn't belong in
this onboarding hub yet." It removed a full chapter ("Client notification &
Ask Alex"), a workflow-map node ("Ask Alex any time"), and an FAQ answer, all
Alex-referencing.

The demo tenant this hub films against ("Vantage RTW Partners" /
`org-demo-partner`) is itself category-restricted (pre-employment-only, per
`server/seed-demo-partner.ts`) — exactly the partner type that 403'd. Checked
the current gate code this pass
(`preventli/server/middleware/restrictedPartnerGate.ts:101`, inside
`RESTRICTED_PARTNER_ALLOWED_RULES`):

```
{ prefix: "/api/chat" },  // Alex — found 2026-07-24 blanket-blocked for restricted partners
                          // with no case-management-flavoured error surfaced (client only
                          // reads body.message, this gate's 403 used body.error, so it
                          // silently degraded to a generic "couldn't process that").
                          // Alex itself doesn't call any case-management tool for a
                          // pre-employment-only org, so there's nothing left to gate here.
```

`/api/chat` is explicitly allow-listed now, with a comment describing the same
bug the cut commit cited, in the past tense ("found... blanket-blocked").
Reading the two commits' timestamps, this looks like the block was found and
fixed the same day the hub cut Alex over it — meaning **the original reason
for the cut may already be resolved**. But this is a code-reading inference,
not a live test, and this session had no way to run that test (no partner
credentials, no live chat access). Before relying on this for filming: open
the demo tenant, click "Chat with Alex," send a message, confirm it responds
normally. If it still silently fails (a generic "couldn't process that" with
no real error, per the comment above), that's the same historical bug
resurfaced, not a new one, and is worth reporting back as such.

### Not a bug — leave as-is

Every Alex reply starts with a bracketed tag: `[Case Manager]`, `[Clinical]`,
or `[Legal]` (visible in the quoted reply above). Verified this pass in
`preventli/server/routes/chat.ts` (`PERSONA_INSTRUCTION`, ~line 37) —
deliberate: Alex is instructed to classify the question and prefix its reply
with exactly one tag before answering, every time. This will appear on-screen
in the recording and may read as internal machinery to a partner watching.
Don't "fix" it by cropping it out or asking Alex to drop the tag in the
recorded conversation — it's intentional product behaviour, not a defect. If
it looks odd on camera, a line of narration ("that tag is just Alex sorting
the type of question — you can ignore it") is the right move, not a
workaround.

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
  `preventli-site` session. PR #312 needs Paul's own merge decision, and so
  does any fix to Alex's JD-question knowledge or the JD-not-shown-on-card
  display bug (`NewAssessmentPage.tsx:273`) — both documented above, neither
  fixable from here.
- Do not fabricate or mock up extracted-JD-requirements UI (item 10).
- Do not film the Ask Alex section on an unverified question, and do not
  assume the historical 403-for-restricted-partners block is fixed just
  because the current code reads that way — confirm live first.
