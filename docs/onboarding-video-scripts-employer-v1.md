# Employer Onboarding Videos — Narration Scripts v1

**Date:** 2026-07-29
**Status:** DRAFT — awaiting Paul's review. Nothing records or renders until these tables are signed off.
**Audience:** a single-company employer who signed up directly via `/start-trial` ("I manage my own workers"), NOT a partner.
**Evidence base:** product reality read from `preventli` @ a clean recent worktree (file:line refs in the session notes), signup copy read from `preventli-site/app/start-trial/page.tsx`, conventions carried over from `docs/onboarding-video-scripts-v3.md` and the standing rules in `docs/onboarding-video-realignment-decisions-2026-07-27.md`.

Employer chapter structure (4 chapters — the partner's "Setting up a client" chapter has no employer equivalent; the JD step is folded into chapter 2 because the product has no standalone JD surface for employers):

| Ch | Title | Footage |
|---|---|---|
| 1 | Getting started | NEW — this script |
| 2 | Creating and sending checks | NEW — this script |
| 3 | The candidate experience | REUSED from partner set (audience-neutral) |
| 4 | Review & your report | NEW — this script |

Intro video (`intro.mp4`, 22s motion graphics) is reused as-is.

**Timings** are cumulative spoken-pace estimates (~2.3–2.6 words/sec plus action beats), same method as scripts-v3 — a first cut for the editor, not a hard mark.

---

## Honesty constraints baked into these scripts (do not "fix" in the edit)

1. **A real trial signup is `role: "admin"`** — the sidebar shows the full nav including Audit Log and Agents, and "New Claim" (not "New Case"). The scripts never claim a slimmer nav than the camera will show. Capture must use a seed that matches this (`seed-demo-employer.ts`, to be built — NOT Wallara/Lara, whose `role: "employer"` renders a different nav).
2. **No Alex welcome hero.** Trial signups resolve to an effective Professional plan, which skips the `WelcomeOnboarding` hero. Chapter 1 lands directly on `CasesDashboard` and the script reflects that.
3. **No email promise in chapter 4.** `ENABLE_NOTIFICATIONS` is off in production (post-runaway kill switch), so the report-approval email may not send. Narration says the report "lands in your workspace" — nothing about an email — until notifications are re-enabled in prod.
4. **No timeframe promise** for clinical review (same rule as partner ch5: no "1 business day").
5. **Show the click, one shell, login only in chapter 1** — standing rules 1–6 from the realignment doc all apply.

---

## Chapter 1 — Getting started (~1:02)

*Hub description: "Start your free trial, verify your email, and find your way around your workspace."*

| Time | On screen | Narration (Paul's voice) |
|---|---|---|
| 0:00–0:06 | preventli.ai homepage. Cursor travels to the hero's **"Start Free Trial"** button and clicks it. | "Getting started takes about two minutes. Head to preventli-dot-A-I, and click Start Free Trial." |
| 0:06–0:13 | Trial form: heading **"Start your 14-day free trial"**, subline "No credit card. Full system access for 14 days, plus 1 free report of each check type." Company name typed in. | "Fourteen-day free trial, no credit card. Start with your company name." |
| 0:13–0:21 | The question **"Are you signing up as a single company, or do you manage cases for multiple client companies?"** with its two buttons. Cursor clicks **"I manage my own workers"**; the button highlights green; ring on it. | "This one matters. You're signing up as a single company — so choose 'I manage my own workers.'" |
| 0:21–0:27 | **Company size** dropdown opened — real options ("1–10 employees" … "500+ employees") visible — one selected. | "Pick your company size — that just helps us set your workspace up right." |
| 0:27–0:36 | Full name, work email, password (the live 5-rule password checklist ticks off as it's typed) and confirm-password filled; cursor clicks **"Start 14-day free trial"**. | "Your name, work email, and a password. Submit, and we send a verification link to that inbox." |
| 0:36–0:42 | Inbox card (same stylised treatment as partner ch1) → verification link clicked. | "Click the link, and you're verified and signed straight in." |
| 0:42–0:56 | **Your workspace** (`CasesDashboard`): company name as the page title, trial banner ("14 days left in your free trial") at the top, **Getting Started checklist** and the (empty) unified case + check list. Ring on the checklist. | "This is your workspace. Your trial's counting down at the top, and the getting-started checklist walks you through your first steps. Everything to do with your people — cases and checks — lives in this one list." |
| 0:56–1:02 | Sidebar: cursor sweeps to **🩺 Checks**. Closing beat. | "When you're ready to run your first check, that's next — chapter two." |

---

## Chapter 2 — Creating and sending checks (~0:57)

*Hub description: "Create a pre-employment check, attach the job description, and send the secure link to your candidate."*

Opens already signed in (standing rule 1). The JD teaching lives here — there is no separate JD chapter for employers.

| Time | On screen | Narration (Paul's voice) |
|---|---|---|
| 0:00–0:05 | Workspace. Cursor travels to **Checks** in the sidebar and clicks it. | "To run a pre-employment check, head to Checks in the sidebar." |
| 0:05–0:11 | The Checks hub with its category cards. Cursor clicks **"New Assessment"** under Pre-Employment. | "Pick Pre-Employment, and click New Assessment." |
| 0:11–0:20 | New check form. Candidate name, email, and role typed; check-type field reads **"Pre-Employment Check"**. | "Fill in your candidate's name, email, and the role they're applying for. Check type — Pre-Employment Check." |
| 0:20–0:33 | Job description step: attach a **PDF** from the desktop; the file appears with the role title. | "Now attach the job description — a PDF straight off your desktop. This is what drives the role-specific questions your candidate answers. And it's saved to your library automatically — next time you hire for this role, it's already in the dropdown." |
| 0:33–0:39 | Cursor clicks **"Create Assessment"**. | "Click Create Assessment. That creates the check — it doesn't send it yet." |
| 0:39–0:46 | **"Ready to send"** card: Candidate, Email, Position, Job Description rows all visible. Ring anchored to the card. | "You get a Ready-to-send card. Check the details — candidate, email, position, and the job description you attached." |
| 0:46–0:52 | Ring anchored to the **"Not now" / "Send to Worker"** pair; cursor clicks **"Send to Worker"**. | "Happy? Click Send to Worker. That's the step that actually emails your candidate the secure link." |
| 0:52–0:57 | **"Questionnaire sent!"** confirmation — "A secure link has been emailed to…". | "Done — your candidate has the link. What they see next is chapter three." |

---

## Chapter 3 — The candidate experience

**Reused from the partner set** (`the-candidate-experience.mp4`) — audience-neutral, no partner-specific screens or narration. Not re-scripted here.

Standing caveat carried from the realignment work: three conflicting versions of the candidate form are on record (shipped video 9 pages / manual walk 10 pages / pipeline's real flow 8-step legacy form). If the partner set's chapter 4 gets revisited, this chapter inherits that outcome automatically — one file, both hubs.

---

## Chapter 4 — Review & your report (~0:45)

*Hub description: "How your candidate's answers are clinically reviewed, and where the report lands in your workspace."*

No approval step exists for employers — clinical review approves, and the result appears in the employer's workspace. Narration deliberately never promises an email (honesty constraint 3) and never promises a timeframe (constraint 4).

| Time | On screen | Narration (Paul's voice) |
|---|---|---|
| 0:00–0:07 | Dark explainer card (same treatment as partner ch5's opening). | "Once your candidate's finished, their answers go through clinical review before anything reaches you." |
| 0:07–0:13 | Brief context shot of the clinical review screen — clearly framed as "our side", not the employer's. | "That happens on our side — you don't need to do anything at this stage." |
| 0:13–0:24 | Employer's **Checks** list: the candidate's row now shows the completed check with its **risk pill (Low / Medium / High)** beside the name. Ring anchored to the row. | "When it's approved, the result lands right here in your workspace. Every check shows its outcome, with a risk rating — low, medium, or high — next to your candidate's name." |
| 0:24–0:33 | Cursor clicks **"View Report"** → report modal: clearance decision, executive summary, conditions/limitations. | "Open View Report for the full picture — the clearance decision, a plain-English summary, and any conditions, with the reasons behind them. Never an unexplained result." |
| 0:33–0:40 | The **Cases** list showing the automatically created case record for the candidate. | "A case record is created automatically, so everything about this person stays in one place from day one." |
| 0:40–0:45 | Outro card. | "And it's kept on file in your workspace, whenever you need it." |

---

## Casting / fixtures (to be locked when `seed-demo-employer.ts` is written)

- **Company:** fictional single employer, name TBD in the seed (must not collide with Vantage RTW's ten client orgs, "Northgate Distribution Centre", or any live tenant).
- **Candidate + role for ch2/ch4:** one fictional candidate with a role matching one of the three committed fixture JD PDFs (`video-pipeline/capture/fixtures/`: forklift driver, logistics coordinator, warehouse operator) so the attached JD content matches the narrated role.
- **Seed state:** `role: "admin"` user, `kind: "employer"`, mid-trial (`trialEndsAt` in the future), zero cases at ch1 capture (checklist shows), at least one approved check with report + risk pill for ch4.

## Blockers before recording (unchanged from the batched production plan)

1. Annotation layer (animated cursor + element-anchored rings) — pipeline currently outputs clean silent capture only.
2. `seed-demo-employer.ts` in the preventli repo (PR, Paul's merge).
3. Local capture environment (Docker Postgres + seeded app), per `docs/video-pipeline.md`.

## Per-shot verification status (as of 2026-07-29)

Levels: **LIVE** = walked on the production site this session, read-only · **PIPELINE-RUN** = the exact flow was click-driven end-to-end by the capture harness's first real run (PR #24, 2026-07-27, local seeded app) · **CODE** = read from source only, never clicked · **UNTESTED** = cannot be verified until capture/production.

| Shot(s) | Claim | Status |
|---|---|---|
| Ch1 0:00–0:06 | Homepage hero CTA "Start Free Trial" (a second "Try Preventli Free" CTA sits beside it) | LIVE |
| Ch1 0:06–0:36 | All signup-form copy: heading, subline, choice-button labels, company-size options, name/email/password/confirm, password checklist, submit label | LIVE |
| Ch1 0:36–0:42 | Verification email + link → signed in | CODE (`public-signup.ts`, `VerifySignupPage.tsx`) — real inbox not exercisable by the harness; stylised inbox-card treatment as in partner ch1 |
| Ch1 0:42–1:02 | CasesDashboard: org-name title, trial banner, Getting Started checklist, unified list, Checks nav item | CODE — needs `seed-demo-employer.ts` + capture session to click-verify |
| Ch2 all | Checks hub → New Assessment → form → JD attach → Create Assessment → Ready-to-send card → Send to Worker → "Questionnaire sent!" | PIPELINE-RUN (same `NewAssessmentPage` flow the partner ch3 capture drove live, incl. the shadcn JD select and the created→sent state machine) — employer-shell framing itself is CODE |
| Ch2 0:20–0:33 | Attached PDF silently saved to the org JD library, appears in dropdown next time | CODE (`NewAssessmentPage.tsx:189-223,272-274`) |
| Ch4 0:13–0:33 | /checks row with risk pill, View Report modal (clearance/summary/conditions) | CODE (`ChecksPage.tsx`; risk pills confirmed LIVE on the partner list 2026-07-27, employer list itself unclicked) |
| Ch4 0:33–0:40 | Case record auto-created on approval | CODE (`reportReview.ts:342-352`) |
| All | **Timings** | UNTESTED — spoken-pace estimates only. Real durations come from the ElevenLabs narration pass (`_narrate.mjs` re-times every shot to the measured audio, whisper-verified), which runs after script sign-off. |

## Verification note

On-screen copy quoted above was read from source, not a live session: signup labels from `app/start-trial/page.tsx:98-186` (this repo), workspace/checks/report surfaces from the preventli repo exploration (CasesDashboard, ChecksPage, NewAssessmentPage, TrialBanner, GettingStartedChecklist). Exact button text not literally quoted in those reads ("View Report" label position, checks-hub card layout) must be confirmed on screen at capture time — same discipline as scripts-v3's verification note.
