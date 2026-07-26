# Partner Onboarding Videos — Realignment Decisions

**Date:** 2026-07-27
**Session:** Paul + Claude, video-by-video walkthrough against the live app
**Status:** Decisions agreed. **No re-record work has started.**
**Supersedes on conflict:** `docs/onboarding-video-function-audit-2026-07-26.md` (the audit is still the evidence base; this doc holds the *decisions*)

---

## How this was produced

Every defect below was found by one of three methods, and each is labelled:

| Method | What it means |
|---|---|
| **SEEN** | Frame extracted from the shipped `.mp4` and read directly. Timestamp is from the video. |
| **HEARD** | From a local `faster-whisper` transcript of the shipped audio. Timestamp is from the transcript. |
| **CODE** | Read against `origin/main` in a clean worktree. |
| **LIVE** | Observed in the running app (`preventli.ai`, WorkBetter partner workspace, 2026-07-27). |

Anything not verified this way is marked **UNVERIFIED** and must not be treated as fact.

### Trap that already caught us once

`D:\dev\preventli` was sitting in **detached HEAD at `8de6c7a`**, off an unmerged security-fix branch, with uncommitted changes in `server/index.ts`. Code read from it is **stale** — an early read in this session was wrong because of it. All CODE findings here were re-read against `origin/main` in a separate worktree. **Check `git rev-parse --abbrev-ref HEAD` before trusting any read of that repo.**

---

## Standing rules

These came out of the walkthrough. They are not per-chapter notes — they apply to **every** chapter, and several of them would each have caught multiple defects on their own.

1. **Only Chapter 1 shows a login.** Every other chapter opens with the partner already signed in, clients down the left-hand side.
2. **Show the click, not the result.** A cursor/arrow travels to the control and clicks it. No cuts to an already-open dialog, no toast standing in for an action the viewer never saw.
3. **One shell, start to finish.** Never swap the left-hand list mid-chapter. The partner workspace is the only shell a partner sees.
4. **Never claim something on screen that isn't on screen.** If the narration says "it's right there in the dropdown", the dropdown is open with real entries visible.
5. **Highlights anchor to the element, never to baked coordinates.** Two rings in the shipped set are drawn on empty space; both are offset *downward* by roughly the same distance from their intended target. That is one systematic bug, not two mistakes — fix the anchoring, not the individual boxes.
6. **URLs on screen are `preventli.ai/login` only.** Never `app.preventli.ai`. (It is still live and reachable, but it is no longer the front door.)

---

## Verdicts

| # | Chapter | File | Len | Verdict |
|---|---|---|---|---|
| — | Intro | `intro.mp4` | 0:22 | **Keep** — one cosmetic fix |
| 1 | Getting started | `getting-started.mp4` | 0:59 | **Partial re-record** — VO line + closing screen |
| 2 | Setting up a client | `setting-up-a-client.mp4` | 0:45 | **Full re-record** |
| 3 | Creating & sending checks | `creating-and-sending-checks.mp4` | 0:40 | **Full re-record** — worst of the five |
| 4 | The candidate experience | `the-candidate-experience.mp4` | 0:27 | **Keep** (Paul's call) — fix chip + FAQ |
| 5 | Clinical review | `clinical-review.mp4` | 0:57 | **Re-record the payoff** — blocked, see §Blockers |

---

## Blockers — nothing renders until these clear

### B1. The capture pipeline has no annotation layer at all

**CODE.** `video-pipeline/` contains `capture/`, `stitch/`, `verify/`. Grepping the whole tree for `cursor|arrow|highlight|spotlight|annotat` returns **zero matches**. `stitch-chapter.mjs`'s own header states *"Output is VIDEO-ONLY (silent)"*.

**Consequence:** running PR #22's pipeline as-is produces footage with **no arrows, no highlight rings, no caption pills** — a regression against the videos already shipped. Whatever produced the current annotations was not this pipeline.

**Needed:** an annotation layer supporting (a) an animated cursor that travels to a control and clicks it, and (b) caption pills and highlight rings anchored to real elements (per standing rule 5).

### B2. Chapter 5's payoff shot cannot be filmed — no data in the right state

**CODE + LIVE.** The partner approval UI is `PartnerReportApprovalSection` (added 2026-07-24), which only renders rows where `reportStatus === "pending_partner_review"`.

`pending_partner_review` appears in `server/routes/partner.ts`, `server/routes/reportReview.ts` and their tests — and in **no seed file**. Live, the WorkBetter partner workspace shows no approval card above the table.

**Needed:** a seed fixture parking at least one assessment in `pending_partner_review`. This is a prerequisite, not a nice-to-have.

### B3. Four PRs open, none merged

| PR | Repo | What |
|---|---|---|
| [#312](https://github.com/paulhopcraft-dot/preventli/pull/312) | preventli | demo-partner tenant seed |
| [#19](https://github.com/paulhopcraft-dot/preventli-site/pull/19) | site | hub login label fix (`app.preventli.ai` → `preventli.ai/login`) |
| [#21](https://github.com/paulhopcraft-dot/preventli-site/pull/21) | site | v3 narration scripts |
| [#22](https://github.com/paulhopcraft-dot/preventli-site/pull/22) | site | capture pipeline |

The capture harness **has never been run against a live seeded app.** It needs the app at `CAPTURE_BASE_URL` (default `http://localhost:5000`) with Postgres and the demo seed.

---

## Chapter detail

### Intro — KEEP

Pure motion graphics, no app footage, no functional claims. Narration is accurate.

| # | Defect | Method |
|---|---|---|
| I.1 | The **G in "REPORT STAGE"** renders visibly smaller than the surrounding letters (~0:18). Font-fallback or small-caps glitch. Cosmetic, but it's in the first video a partner sees. | SEEN |

---

### Chapter 1 — Getting started — PARTIAL RE-RECORD

Beats 1–3 (title card, trial signup, inbox card) are sound. Beat 4 is stale.

| # | Time | Defect | Method |
|---|---|---|---|
| 1.1 | 0:46 | **Narration:** *"The middle shows what's in flight, checks sent, in progress reports ready."* Paul: doesn't make sense. This is in the **voiceover**, not just the caption — it must be re-recorded, not re-captioned. | HEARD |
| 1.2 | ~0:47–0:55 | **Empty green highlight ring** drawn in blank whitespace between the stats line and the "Report Safety Issue" button. Rings nothing; clips the top of an unrelated control. Intended target was the stats line `12 total · 7 awaiting action · 4 completed · 3 cleared for work`. Offset **downward**. | SEEN |
| 1.3 | 0:50 | **Closing workspace screen is stale.** Filmed: `RISK` column present, empty `—` on all 12 rows; filters are Search / All statuses / All clients. Live: `RISK` column **deleted**; risk is an inline **Low/Medium/High** pill beside the worker name; **"All risk levels"** filter and a **"Risk ⇅"** sort control added; speech-bubble comment icon on every row. | SEEN + LIVE |

**Approved replacement copy (Paul: "go with your wording"):**
> **Every check, every client — filter, sort, review, approve**

**Paul's instruction:** the re-captured closing screen **must show the new list format with High/Medium/Low risk flags visible.**

---

### Chapter 2 — Setting up a client — FULL RE-RECORD

| # | Time | Defect | Method |
|---|---|---|---|
| 2.1 | 0:04–0:11 | **Opens on the login screen.** Violates standing rule 1. Worse: the narration over it is describing the *client form* — *"Company name, key contacts, and the notification email…"* — over footage of a sign-in card. | SEEN + HEARD |
| 2.2 | ~0:12 | **The `+ Add` click is never shown.** Cuts straight to an already-open "Add client" modal. The one interaction the chapter exists to teach. Violates standing rule 2. | SEEN |
| 2.3 | 0:10 vs 0:28 | **18-second narration/visual desync.** Voice says *"Then upload their job descriptions"* at **0:10**; the JD dialog does not appear until **~0:28**. The client-details form (address, insurer, contacts) runs underneath the entire JD narration. | SEEN + HEARD |
| 2.4 | 0:28–0:32 | **The upload is invisible and the screen contradicts itself.** Dialog reads *"Upload multiple job description PDFs at once"*. No file picker appears, no files are staged — then a toast fires: **"Job descriptions uploaded — 1 file(s)"**. One file, under text promising multiple. | SEEN |

**Fix (Paul):** cut the client-details form short, jump to the JD step, and show **2–3 PDFs actually going up as a batch**.

Note: the three fixture PDFs already exist in `video-pipeline/capture/fixtures/` (forklift driver, logistics coordinator, warehouse operator), and PR #22's shot 3 is already titled *"Batch-upload 3 JDs"*. Written, never rendered.

---

### Chapter 3 — Creating & sending checks — FULL RE-RECORD (worst chapter)

| # | Time | Defect | Method |
|---|---|---|---|
| 3.1 | 0:04–0:11 | **Opens on the login screen** with a "Signing in…" spinner, while the narration says *"Start by picking your client from the list on the left"*. There is no list on the left. It appears at ~0:12. | SEEN + HEARD |
| 3.2 | ~0:20 | **The double jump — two different left-hand lists.** At 0:12 the left rail is the **clients** list (13 clients). At 0:20 it becomes a completely different nav: Cases, Checks, Report Review, Dashboard, New Claim, RTW Planner, Check-ins, Financials, Premium, Safety, Predictions, Risk, Audit Log, Agents, Help — plus "Switch client" and "Book Telehealth". Violates standing rule 3. | SEEN |
| 3.3 | 0:05–0:10 | **Two differently-named buttons for one action.** *"Then click New Check… so click New Assessment."* | HEARD |
| 3.4 | 0:17–0:23 | **The JD dropdown is never opened and no JD is ever selected.** The field reads **"— Type or attach a new one instead —"** (the *fallback* option) at 0:18, still at 0:20, and Create Assessment is clicked at ~0:22 with no JD chosen — while the narration says *"the ones you uploaded earlier are right there in the drop-down."* The video demonstrates the opposite of its claim. Violates standing rule 4. **Highest-severity defect in the set** — JD-matching is the product's differentiator, sold explicitly in Chapter 2's narration. | SEEN + HEARD |
| 3.5 | ~0:23 | **Caption fires on the wrong screen.** The pill *"Uploaded earlier — right there in the dropdown"* does not appear until the form is gone and the "Ready to send" screen is up. It captions a control no longer on screen. | SEEN |
| 3.6 | ~0:23 | **Second empty green highlight ring**, in blank page below the "Ready to send" card. Offset **downward**, same signature as 1.2. | SEEN |
| 3.7 | ~0:23 | **The ring is on the wrong target.** Paul: it should be around **"Not now" / "Send to Worker"** — that pair is the point of the beat (nothing is emailed until Send to Worker is clicked). | SEEN |
| 3.8 | ~0:20 | **Stale list format** — RISK column empty `—`, no risk filter. Same as 1.3. | SEEN |

**Fixes (Paul):**
- Open with the partner already signed in, clients down the left.
- When the narration says "click New Check", **a big arrow travels to the top-right corner and clicks it.**
- **Open the dropdown. Hold on a real list of positions. Click one.** Then Ready to send.
- Ring **Not now / Send to Worker**, not empty space.

**Product question raised, not yet answered:** the "Ready to send" card shows Candidate, Email, Position — **no job description row**. If a partner cannot confirm the JD attached before sending, that is a product gap, not a video one. **UNVERIFIED** against current code.

---

### Chapter 4 — The candidate experience — KEEP (Paul's call)

Paul: *"Chapter 4 is fine, no need to redo."* Recorded. The three items below are all fixable **without touching the video**.

| # | Time | Defect | Method |
|---|---|---|---|
| 4.1 | all | **Chapter chip reads "05 · Candidate Experience".** It is chapter **4** of 5. | SEEN |
| 4.2 | throughout | **Filmed form is 9 pages** ("Page 1 of 9" → "Page 9 of 9"). Paul's production walk on 2026-07-26 found **10 pages, with 53 questions on "Role requirements"** — and no Role requirements page appears anywhere in this footage. *Provenance: Paul's verification, not re-verified in this session.* | SEEN + UNVERIFIED |
| 4.3 | 0:15 | Signature sits on **page 9 of 9**, matching narration *"at the end they sign electronically"*. Commit `5bd03bc` moved signature to after the capability questions, so this ordering may no longer hold. **UNVERIFIED** — flagged, not asserted. | SEEN + UNVERIFIED |
| 4.4 | 0:08 | **The video and the hub FAQ contradict each other on timing.** Video: *"around 15 to 20 minutes"*. FAQ (`lib/welcome/faq.ts:8`): *"around 5–10 minutes"*. | HEARD + CODE |

**Decision on 4.4: the video is the honest one. Change the FAQ to match the video, not the reverse.** The 2026-07-26 audit measured the Role requirements page *alone* at 7,643px — 19.2 phone screens — with all 26 free-text boxes rendering open before a single answer is given. 5–10 minutes is not credible.

*Awaiting Paul's go-ahead on the exact FAQ wording.*

---

### Chapter 5 — Clinical review & client notification — RE-RECORD THE PAYOFF (blocked)

Does **not** show a login — standing rule 1 already satisfied. Opens on dark explainer cards for ~24s, then the workspace list.

| # | Time | Defect | Method |
|---|---|---|---|
| 5.1 | all | **Chapter chip reads "04 · Clinical Review & Client Notification".** It is chapter **5**. Chips 4 and 5 are **swapped**. | SEEN |
| 5.2 | 0:24+ | **Stale list format** — same as 1.3. | SEEN |
| 5.3 | — | **The approval flow shown does not match what shipped.** See below. | CODE + LIVE |

#### What Paul wants Chapter 5 to show

> Clients list → checks list, latest at top, "Ready to review", Medium/High risk → click it → review screen → make notes → approve and send to client.

#### What the code actually does (CODE, `origin/main`)

| Paul's step | Reality |
|---|---|
| List of clients | ✅ exists |
| Checks list, latest at top | ✅ exists, sorted by last activity |
| Ready-to-review, Medium/High risk | ✅ risk badges are real (High/Medium/Low) |
| **Click row → review screen** | ❌ a row click calls `onOpenWorker` → navigates to `/workers/:workerId`, the worker profile |
| Make notes | ✅ **two different kinds** — inline row comment (`PATCH /api/partner/pre-employment/:id/comment`), and a send-back note |
| Approve & notify client | ✅ exists — **but not behind a row click** |

**The real flow is simpler than described, and films better.** `PartnerReportApprovalSection` sits **above** the checks table inside the Pre-Employment Overview. Its header reads: *"Preventli has reviewed these — approve to notify the client, or send back with a note if something needs…"*

- **Approve** → `POST /api/partner/report-approvals/:id/approve` → client is notified
- **Send back** → `POST /api/partner/report-approvals/:id/send-back`, note box: *"What needs fixing before you can approve this?"*

No navigation at all: clients on the left → approval card already at the top of the overview → note or not → Approve.

**Blocked by B2** — nothing is in `pending_partner_review`, so this shot cannot be filmed today.

---

## Copy changes approved this session

| # | Change | Where | Status |
|---|---|---|---|
| C1 | Remove *"Don't have an account? Ask your employer for an invite."* — it contradicts the self-serve trial Chapter 1 films | `client/src/pages/LoginPage.tsx` (preventli) | **[PR #346](https://github.com/paulhopcraft-dot/preventli/pull/346)** — open, awaiting merge |
| C2 | Ch1 caption/VO → *"Every check, every client — filter, sort, review, approve"* | narration script + capture | agreed, not yet applied |
| C3 | Hub workflow map "Log in" detail: `app.preventli.ai` → `preventli.ai/login` | `lib/welcome/workflow.ts:53` | already in **PR #19** — open, unmerged. **Live hub still shows the wrong label.** |
| C4 | FAQ timing 5–10 min → match the video's 15–20 min | `lib/welcome/faq.ts:8` | agreed in principle, wording not yet confirmed |
| C5 | Fix swapped chapter chips (Ch4 shows "05", Ch5 shows "04") | video render | agreed |

---

## Proposed sequencing — NOT STARTED, needs Paul's go-ahead

1. **Merge the stack** — #312, #19, #21, #22 (preventli is live; merges are Paul's call)
2. **Build the annotation layer** (B1) — animated cursor + element-anchored captions/rings
3. **Add the `pending_partner_review` seed fixture** (B2)
4. **Stand up Postgres + demo seed**, run the capture harness for the first time
5. **Re-record** Ch2, Ch3 in full; Ch1 beat 4 + the 0:46 VO line; Ch5's payoff
6. **Apply the no-video copy fixes** — C1, C3, C4, C5
7. **Re-verify** every claim in this document against the rendered output before shipping

---

## Open questions

- **Q1** — Exact FAQ wording for C4.
- **Q2** — Does the "Ready to send" card need a job-description row so a partner can confirm the JD attached? (Product question from 3.x.)
- **Q3** — Has `5bd03bc` moved the candidate signature away from the final page? (4.3, unverified.)
- **Q4** — Who owns building the annotation layer, and is it in scope for this workstream or a separate one?
