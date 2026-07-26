# Partner Onboarding Video — Narration Scripts v3

**Date:** 2026-07-27
**Author:** Writer pass (documentation only — not reviewed or approved by anyone yet; needs a separate review pass before Paul records against it)
**Source of truth:** `docs/onboarding-video-function-audit-2026-07-26.md` (all findings cited below by number, e.g. "2.4", "4.8", "5.4"), plus `lib/welcome/chapters.ts`, `lib/welcome/workflow.ts`, `components/welcome/FaqAccordion.tsx`, and spot-checks against the product repo (`D:\dev\preventli`) for exact on-screen button text.
**Goal:** finalised, accurate narration for all 5 chapters, so the recording session with Paul's cloned voice is pure execution — no wordsmithing, no fact-checking, on the day.

---

## How to read this document

Every narration line is tagged:

- **NEW** — new wording, needs to be recorded.
- **CUT** — content in the current chapter that should be dropped (wrong, misleading, or redundant).
- **UNCHANGED** — no defect found against this beat; the existing take can very likely stay as-is.

**Important limitation up front:** there is no transcript of the current video (the audit confirms this — no captions, no Whisper key configured) and no committed script file exists anywhere in this repo's git history to diff against. So "UNCHANGED" below does **not** mean "these are the exact words already recorded" — I have no way to verify that. It means: *the audit found no factual or on-screen defect for this beat, so there is no reason to re-record it.* Whoever holds the actual current script (or the raw footage) should do a quick side-by-side before skipping any chapter marked UNCHANGED. Everything marked NEW is original text written for this pass and has not been spoken, recorded, or gated through the ElevenLabs/volume audio-gate process the last rebuild (`9344a59`) used.

Durations are rough spoken-pace estimates (~2.3–2.6 words/second, allowing for on-screen action beats), not measured against edited footage. Treat them as a first cut for the editor, not a hard mark.

---

## Chapter-by-chapter recommendation

| Ch | Title | Recommendation | Why |
|---|---|---|---|
| 1 | Getting started | **No re-record.** | Both checked claims (trial signup form, login URL) are TRUE against production (1.1, 1.2). Rebuilt and audio-gated 2026-07-25. No defect found. |
| 2 | Setting up a client | **Partial reshoot.** Cut the redundant re-login open; add the JD upload two-step warning and the contact-email note. | 2.2 (unnecessary login), 2.4 (JD two-step trap undisclosed), 2.5 (empty saved-JD picker on a new client) are all real gaps. Everything else in the chapter is fine. |
| 3 | Creating and sending checks | **Partial reshoot.** Re-narrate "create" vs "send" as two distinct steps; fix the check-type label. | 3.1 (send label implies one step, product has two) is the single biggest gap. 3.2 (JD not visible on the send-review card) is a product bug, noted but not scriptable around. |
| 4 | The candidate experience | **Full reshoot.** New footage, new narration. | The current chapter shows ~12 seconds of real content (4.1) — the opening screen and a stylised signature/thank-you card — and skips the entire substantive middle of a 10-page form. This is the largest gap in the whole video. |
| 5 | Clinical review & client notification | **Full reshoot.** New footage showing the partner's own approval screen, new narration dropping the unqualified "1 business day" and "instantly" claims. | 5.1, 5.4, 5.5 together mean the current chapter shows the wrong screen for a partner audience and overstates both timing and what's attached to the client email. |

---

## BLOCKING — fix before recording, not scriptable around

These aren't narration problems. They're product/UI state that will be visibly wrong on camera no matter what words are read over them. Flagging them here because "words finalised" is only half the job if the screen behind the words is broken.

1. **Signature checkbox text is a broken sentence.** Live copy reads *"...kept confidential in accordance with the company GPNet."* (finding 4.3) — reads as truncated ("company GPNet policy"?) and references a brand ("GPNet") that isn't the candidate's own employer or Preventli. If chapter 4 is reshot before this copy is fixed, the video will capture the bug permanently.
2. **Client-deliverable PDF generation is an open bug** (`reportUrl`/`questionnairePdfUrl` both null after submission, finding 3.6). The chapter 5 script below assumes the partner-approval "Approve & Send" flow actually works end-to-end and attaches both PDFs. As of the audit, it can't — the partner-approval endpoint 422s when `reportUrl` is null (3.7). **Confirm this is fixed before recording chapter 5**, or the demonstrated action will fail live.
3. **`ASSESSMENT_SCHEDULER_ENABLED` and `ENABLE_NOTIFICATIONS` in production are unverified** (4.5, 5.2). The reminder/escalation narration in chapter 4 and the "client notified" narration in chapter 5 both describe real code logic, but that logic only runs if these env vars are `"true"` on the live Render deployment. Worth a five-minute check before this video goes live — otherwise the video promises something the production config may be silently not doing.

None of these are mine to fix (product code, out of scope for this doc/PR). Flagging so they don't get missed.

---

## Chapter 1 — Getting started

**No re-record needed.** Findings 1.1 (trial signup form matches production exactly) and 1.2 (login URL now `preventli.ai/login`, matches the hub) are both TRUE. This chapter was rebuilt and passed the audio gate on 2026-07-25 (`9344a59`). Nothing in the 2026-07-26 audit touches it. Leave as-is.

---

## Chapter 2 — Setting up a client

*Chapter description (hub): "Add a client company and upload the job descriptions you'll be checking against."*

| Shot | On-screen action | Narration | Duration | Status |
|---|---|---|---|---|
| 2.1 | Start on the partner workspace (already logged in from chapter 1) | "Once you're in, setting up a new client takes about a minute." | 3s | **CUT** existing open — finding 2.2: chapter currently re-shows login + credential typing, which is redundant and mildly misleading if a partner jumps straight to this chapter from the hub. Start on the dashboard instead. |
| 2.2 | Click "Add a client" | "Click 'Add a client.'" | 2s | NEW |
| 2.3 | Add-client dialog opens, cursor in Company name field | "The only thing you actually have to fill in is the company name." | 3s | UNCHANGED (2.3 confirmed TRUE live) |
| 2.4 | Scroll to / highlight Primary contact → Email field | "But fill in the primary contact's email while you're here. The system needs it later to send the report to your client, and it won't warn you if it's missing. It'll just fail when you try to send." | 8s | NEW — finding 2.3 + the task brief's explicit contact-email constraint. The form doesn't self-warn about this, so the narration has to. |
| 2.5 | Client created, land on client detail page → "Upload job descriptions" | "Now upload the job descriptions you'll be checking candidates against for this client." | 4s | NEW |
| 2.6 | Click "Select PDF files," pick 3 PDFs at once — each appears with an editable title and an × | "You can upload more than one at a time — each one becomes its own entry in this client's library. Give each a name you'll recognise later." | 7s | NEW — finding 2.4 (bulk upload works, but the current video only ever shows one file). Show 3, not 1. |
| 2.7 | Camera holds on the two buttons: green "Upload 3 file(s)" and, below it, the brighter green "Done" | "This is the part to watch. Selecting files only stages them, nothing's saved yet. You have to click 'Upload 3 file(s).' That button right there — not 'Done.' Done looks like the obvious next step, but it throws the staged files away without saving them." | 11s | NEW, highest-priority line in the chapter — finding 2.4, high severity ("Paul lost 3 files to this himself"). This is the single most important sentence in chapter 2. |
| 2.8 | Click "Upload 3 file(s)," files land in the library list | "Click Upload, and now they're saved — ready to attach to any check for this client." | 4s | NEW |
| 2.9 | (Only if demoing on a brand-new client with no prior JD) — no picker shown yet, just helper text | "First job description for a client? There's nothing to pick from yet — that's expected. It'll show up as an option next time you create a check for them." | 6s | NEW, optional — finding 2.5. Include only if the demo client is genuinely new; skip if reusing a client that already has a saved JD. |

**Judgment call:** finding 2.1 ("video badge — Pre-Employment Health Check vs. live 'Pre-Employment Check'") is filed under Chapter 2 in the audit table, but the check-type label is actually chosen when *creating a check*, not when setting up a client. I've moved that fix to Chapter 3, shot 3.1, where it belongs narratively. Flagging in case the audit's placement reflects something in the actual footage I can't see (no frame-level detail exists for chapters 1–3 — the audit's methodology section says only chapters 4–5 were frame-extracted).

---

## Chapter 3 — Creating and sending checks

*Chapter description (hub): "Create a check and send the secure link to your candidate."*

| Shot | On-screen action | Narration | Duration | Status |
|---|---|---|---|---|
| 3.1 | New check form: candidate name/email, role, check-type dropdown showing "Pre-Employment Check" | "Fill in your candidate's name, email, and role, and pick the check type. Pre-Employment Check, in this case." | 6s | NEW — corrects the stale "Pre-Employment Health Check" label (2.1) and gives it its (more accurate) home in the flow. |
| 3.2 | Select the job description from the client's library (or the one just uploaded in chapter 2) | "Attach the job description you just uploaded — that's what drives the role-specific questions your candidate will answer." | 5s | NEW — accurate but deliberately stops there. Does **not** claim the physical-demand ratings (Squat/crouch, Stoop/bend, Twist, etc.) reach the candidate — they don't (finding 2.6). Only the task names do. |
| 3.3 | Click "Create Assessment" | "Click 'Create Assessment.' This creates the check, it doesn't send it yet." | 5s | NEW — finding 3.1, the core fix. The current label implies one step; the product has two, and this line has to say so plainly. |
| 3.4 | "Ready to send" card appears — candidate, email, role | "Now you get a 'Ready to send' card. Check the candidate's details are right." | 4s | NEW. Deliberately does **not** claim the job description is visible here to check — finding 3.2 confirmed it isn't shown on this card when the JD came from the saved library, only when freshly uploaded in the same session. Don't narrate a check you can't actually perform on screen. |
| 3.5 | Click "Send to Worker" | "When you're happy, click 'Send to Worker.' That's the step that actually emails your candidate the secure link." | 6s | NEW — the second half of the 3.1 fix. Makes explicit that *this* click, not the previous one, is what sends. |
| 3.6 | Confirmation state / candidate now shows as sent | "And that's it — they've got the link." | 2s | UNCHANGED — no defect found against the confirmation state itself; audit didn't flag this beat. Flagging as *likely* fine rather than *verified* fine, since I have no frame-level check for chapter 3. |

---

## Chapter 4 — The candidate experience

*Chapter description (hub): "What the candidate sees, and how automatic reminders keep things moving."*

**Full reshoot.** The current chapter gives this ~12–15 seconds total (t≈2:55–3:07 in the stitched video) and shows only the opening identity screen and a stylised signature/thank-you/reminders card — zero frames of the actual substance of the form (finding 4.1). A partner watching today would reasonably conclude the candidate form is two or three short screens. It's ten pages.

| Shot | On-screen action | Narration | Duration | Status |
|---|---|---|---|---|
| 4.1 | Candidate opens the emailed link on a phone | "Your candidate gets a secure link by email. No account, no app to download — it just opens." | 5s | UNCHANGED in substance (workflow node `opens-link`, finding 4.6, confirmed TRUE) — but re-record as part of the same continuous take as the rest of this chapter rather than splicing to old footage, since everything after it is new. |
| 4.2 | Page 1: name, role, company, age, gender | "First page is just who they are and the role they're applying for." | 4s | NEW |
| 4.3 | Fast montage across the middle pages: Work History, Privacy Policy consent, Occupational Health (yes/no questions), Functional Capacity pain-scale questions, Mental Health Function | "Then it works through their history, health, and how they're doing physically and mentally — the same kind of thing a real pre-employment medical would ask, just as a guided form instead of a waiting-room clipboard." | 10s | NEW. Page names sourced from audit findings 4.1/4.4. Deliberately does not put a page count or time estimate on this montage — see TODO below. |
| 4.4 | Page 9: "Role requirements" — the 26 JD-derived tasks, one at a time or a representative few (e.g. "Roll resident onto their side," "Transfer between bed and chair manually") | "Then it gets specific. These aren't generic questions — they come straight from your client's real job description for this role. For every task in it, your candidate says whether they can do it." | 8s | NEW — this is the feature the whole "assessed against the real role" pitch rests on (2.6), so it earns real screen time, unlike the current cut. |
| 4.5 | Show the three answer options on one task | "'Yes, I can perform this.' 'Yes, with some limitations.' 'No, I cannot perform this.'" | 5s | NEW — quote exactly, these are load-bearing labels in the risk engine per the audit. |
| 4.6 | Select "Yes, with some limitations" → limitation textarea appears | "Pick one of the last two, and it asks them to describe the limitation, in their own words." | 4s | NEW |
| 4.7 | Page 10 (last): signature and declaration | "Only at the very end do they sign, confirming everything they've told you is accurate. So the signature comes after they've actually answered everything, not before." | 7s | NEW — this is the compliance improvement from `5bd03bc` (finding 3.3) and is worth calling out as a deliberate design choice, not just a page order. |
| 4.8 | "Thank You!" confirmation | "And they're done." | 2s | UNCHANGED — no defect found, likely fine as-is. |
| 4.9 | Reminders card / graphic | "If they stall partway through, the system nudges them automatically — up to three reminders, no more than one a day. If they still haven't finished, it escalates, so you know to step in. You're never just waiting and wondering." | 9s | UNCHANGED in substance — finding 4.5 confirms the reminder/escalation logic exactly matches this description (3-cap, once-a-day, single escalation). Re-voice as part of the same continuous take as the rest of the chapter. **Caveat:** this is only true in production if the scheduler env var is actually enabled — see BLOCKING item 3 above. |

**TODO — do not fill this in without a real measurement:** the current FAQ claims "5–10 minutes." The audit's own arithmetic (finding 4.4) puts the real form at 90+ discrete questions across 10 pages and estimates 15–25 minutes as "more realistic" — but that's the audit's estimate, not a timed run. I've deliberately **not** put any number in the narration above. Before this script is finalised, someone should time an actual candidate (or a colleague standing in for one) completing the live form on a phone, and drop the real number into shot 4.3 or leave it out of the video entirely. Guessing a plausible-sounding number here would be exactly the kind of unverified claim this whole rewrite exists to eliminate.

---

## Chapter 5 — Clinical review & client notification

*Chapter description (hub): "How the report is drafted, reviewed by GPNet clinicians, approved, and sent to your client."*

**Full reshoot.** The current chapter demonstrates Preventli's own internal admin review screen (`ReportReviewPage.tsx`) and never shows the partner's own required approval step at all (finding 5.4) — for a category-restricted partner like WorkBetter, that's the screen they'll actually use, and the current video leaves them not knowing it exists.

| Shot | On-screen action | Narration | Duration | Status |
|---|---|---|---|---|
| 5.1 | Card / graphic, brief | "Once your candidate's finished, their report goes to our clinical review team before anything reaches your client." | 5s | NEW, narrower than the current version. **Cut** the current chapter's "Results back within 1 business day" line entirely — task instruction is explicit not to promise this, and the audit grades it UNVERIFIABLE at best, further undercut by the open PDF-generation bug (3.6/finding 5.2) that currently blocks delivery outright. Don't promise a timeframe the product can't currently guarantee. |
| 5.2 | Preventli's internal review screen, shown briefly for context only (not as "your" screen) | "That review happens on our side — you don't need to do anything at this stage." | 4s | NEW — keeps enough of the old screen to explain the process exists, without implying the partner will personally use it (avoids repeating the 5.4 confusion). |
| 5.3 | Partner workspace, "Reports awaiting your approval" card appears (amber, on the Pre-Employment Overview) | "For some partner accounts, there's one more step, and it's yours. When a report's ready, you'll see it here — 'Reports awaiting your approval.'" | 7s | NEW — finding 5.4, the core fix for this chapter. "For some partner accounts" is a deliberate hedge: the audit confirms this gate applies to category-restricted partners specifically (like WorkBetter); I don't have confirmation it applies to every partner, so I'm not claiming it does. See judgment call below. |
| 5.4 | Open the report card in that section | "Nothing reaches your client until you approve it here. You're the last check before it goes out." | 5s | NEW — directly answers the task brief's framing: "they must understand they are the last gate." |
| 5.5 | Click "Approve" (or equivalent — exact button label on `PartnerReportApprovalSection` not independently confirmed by this pass, see note below) | "Approve it, and your client gets the full report and your candidate's signed questionnaire, straight away." | 6s | NEW — **only true if the chapter 5 PDF-generation blocker (3.6) is fixed by recording time.** See BLOCKING item 2. If it isn't fixed, this line is false and should not be recorded as-is. |
| 5.6 | Client-side / outro card | "What they need to make the call. Never an unexplained result." | 4s | UNCHANGED in spirit from the current outro card text captured in the audit (t=3:35) — kept because it's a values statement, not a factual claim, so nothing to fact-check. Re-voice fresh since everything around it changed. |

**Judgment calls in this chapter, flagged explicitly:**

1. **Which partners get the extra approval step.** The audit (5.4) confirms it for category-restricted partners like WorkBetter, via `resolvePartnerApprovalRequirement`. I don't know from the audit whether *every* partner account has this gate or only some — I've hedged with "for some partner accounts." If actually every partner has it, shot 5.3's line should drop the hedge and just say "there's one more step, and it's yours" flat.
2. **Exact button label on the partner's own approval card.** The audit describes the screen (`PartnerWorkspace.tsx`'s `PartnerReportApprovalSection`, "Reports awaiting your approval" card, "Approve/Send back buttons") but doesn't quote the literal button text the way it quotes "Send to Worker" or "Create Assessment" elsewhere. I used "Approve" in shot 5.5 as the most likely label based on the audit's own phrasing ("Approve/Send back buttons") — whoever operates the camera should confirm the exact button text before recording and correct shot 5.5 if it differs.
3. **"Clinical review team" wording (shot 5.1).** The audit (5.1, 5.6) found the review-approval endpoint has no role-based enforcement in code — any authenticated user in the reviewing org can approve, not specifically someone with the `clinician` role. That's an internal Preventli process/staffing fact I can't verify one way or the other from outside, so I've kept the process claim ("goes to our clinical review team") as a statement about who does it in practice, not a claim about what the code enforces. If that's not actually how staffing works day-to-day, this line needs Paul's correction, not mine.

---

## Ask Alex — HOLD, not scripted

Paul wants an "Ask Alex" section in the onboarding flow. Not scripting it this pass. Finding 3.8: Alex currently invents a "Job Description" tab that doesn't exist anywhere in `client/src`, and describes job descriptions as per-case when they're actually a client-level library. Writing narration around a feature that gives wrong answers would just relocate the misinformation from the video into the script. Needs fixed before it gets a chapter — flagging as a blocker, not doing a workaround.

---

## Out-of-scope fixes surfaced by this pass (not touched — product code / site copy)

Listed for visibility, not actioned here (task scope is narration only):

- `lib/welcome/workflow.ts` node `send-check`: label "Secure link, straight away" — same overclaim as the old chapter 3 narration (finding 3.1), on the hub's workflow map itself.
- `lib/welcome/faq.ts`: FAQ #1 "5-10 minutes," FAQ #2 "within one business day," FAQ #3/#6 "full report and signed questionnaire" (only true on the partner-approval path), FAQ #5/#8 "clinical team"/"clinician has signed it off" (not role-enforced in code) — all flagged FALSE or UNVERIFIABLE in the audit (table under "FAQ — all 9 answers"). This doc's narration above deliberately diverges from these FAQ answers where they're wrong; the FAQ copy itself is still live on the hub and unchanged.
- `lib/welcome/workflow.ts`: no node exists for the partner's own approval step (finding 5.9) — the 14-node map is incomplete for partners like WorkBetter.
- Signature checkbox stale text ("...company GPNet") — see BLOCKING item 1.
- `client/src/pages/NewAssessmentPage.tsx:273` — "Ready to send" card doesn't surface a saved-library JD selection (finding 3.2).

---

## Verification note

This document was written from the audit + source code, not from a recording session — there was no audio to test these lines against, and no live product session was used to click through the flows described (per the audit's own methodology, everything about the product here is read from `origin/main` source, not an authenticated session). Two exact button labels ("Send to Worker", "Create Assessment") were independently spot-checked against `D:\dev\preventli\client\src\pages\NewAssessmentPage.tsx:258,404` and match. The "Pre-Employment Check" label was spot-checked as present across 32 files in the product repo including `shared/schema.ts` and `client/src/pages/NewAssessmentPage.tsx`. The exact three role-requirement option labels and the JD-upload button labels were not independently re-grepped against the live repo in this pass (search timed out on the large product repo) — they're taken directly from the task brief's own stated verified-live findings and from audit findings 2.4/4.8, both dated as verified within the last two days. Everything else (button/card text not explicitly quoted in the audit) should be confirmed on screen at record time, since a narration doc can describe what a screen does but can't substitute for looking at it.
