# Partner onboarding — check-type scope

Date: 2026-07-25
Status: **Parked.** No code changed. Do not edit `lib/welcome/*` for this.

## Decision

The existing hub at `/partner-onboarding` **stays pre-employment-scoped**.

Paul, 2026-07-25: leave the WorkBetter/pre-employment hub alone — pre-employment is
likely becoming its own product, and this hub may be rebranded as the **GPNet
pre-employment** onboarding rather than generalised.

Earlier in the same session Paul had picked "one generic spine, all six check types",
then reversed on learning it would mean rewriting these files in place. The reversal
is the operative decision. The generic six-type onboarding, if it happens, is a
**second hub alongside this one** — not a rewrite of `lib/welcome/*`.

**Open question, unanswered, blocks any further work:** does a generic
all-check-types partner hub get built at all, and if so does it live beside the
pre-employment one or replace the entry point? Do not start without this.

## Audit (verified 2026-07-25 — reusable whenever this thaws)

### Corrections to the original parking note

Two paths in the original note are wrong and will waste time:

| Note said | Actually |
|---|---|
| check enums in `shared/schema.ts` | `shared/check-categories.ts` — the single source of truth. `schema.ts` only imports `CheckCategory` from it (line 6). |
| `server/seed-check-form-templates.ts` | `server/scripts/seed-check-form-templates.ts` |

### The six categories

From `shared/check-categories.ts` (`CHECK_CATEGORIES` / `CHECK_LABELS`):

| Category | Label |
|---|---|
| `pre_employment` | Pre-Employment Check |
| `prevention` | Prevention & Safety Check |
| `injury` | Injury Assessment |
| `wellness` | General Wellness Assessment |
| `mental_health` | Mental Health Assessment |
| `exit` | Exit Health Check |

`WorkerCaseType` in `shared/schema.ts` carries the same six values.

Wrinkle worth knowing: `pre_employment` is the odd one out in storage. It maps to six
*legacy clinical enum* values (`baseline_health`, `functional_capacity`,
`medical_screening`, `fitness_for_duty`, `psychological_assessment`,
`substance_screening`) rather than the literal string. Every other category is stored
verbatim. `assessmentTypesForCategory()` encapsulates that.

### Gating is real and already enforced

`organizations.allowedCheckCategories` — `text[]`, nullable. **NULL or empty means
unrestricted**, not "none". Read in three places:

- `server/middleware/planGate.ts:91` — the plan gate itself
- `server/middleware/restrictedPartnerGate.ts` — partner-scoped restriction
- `server/routes/chat.ts:253` and `:621` — feeds Alex's system prompt so it won't
  discuss categories the partner can't use

WorkBetter is configured as `['pre_employment']`. Any multi-type onboarding must
respect this rather than showing partners flows they cannot order.

### Where pre-employment is baked into the hub content

**`lib/welcome/workflow.ts`** — 14 nodes across 6 rows.

- Rows 0–1 read as universal: sign up → verify → log in → partner workspace →
  add a client → upload job descriptions.
- Rows 2–5 are pre-employment-worded: "Send to candidate", "Opens the link",
  "Completes + e-signs", "GPNet clinical review", "Fitness-for-role outcome emailed".
- The `actor` field is the structural tell — it is one of
  `partner | candidate | gpnet | automatic`. `candidate` is the type-bound value.
  A generic spine would need that union widened or renamed.

**`lib/welcome/chapters.ts`** — 5 chapters. Ch3 "Creating and sending checks" and
Ch4 "The candidate experience" are the type-bound ones.

**This is the hard constraint on any "just reword it" plan:** the chapter *videos*
are pre-employment in **footage and narration**, not only in the copy. Neutralising
`title`/`description` strings does not neutralise the video. Real coverage of other
check types means re-recording — and per the rebuild comments in `chapters.ts`, TTS
for these was nondeterministic and took up to 6 takes per chapter to pass the audio
gate. Video production is the expensive part of any variant plan, by a wide margin.

**`lib/welcome/faq.ts`** — 9 questions. **5 assume pre-employment**, all via the word
"candidate": "What does the candidate experience?", "What if the candidate doesn't
complete the check?", "How is candidate privacy protected?", plus candidate wording
inside the answers to "What does the client receive?" and "What happens if something
is flagged?". One answer says "fitness-for-role". This is the cheapest layer to make
generic — pure string edits, no video implication.

### Unverified — check before designing variants

Whether the *mechanics* actually differ for the other five categories, or only the
wording does. For non-pre-employment types the subject is an existing employee rather
than a job candidate, but I did not confirm whether the send/complete path (secure
link → questionnaire → e-sign → GPNet review → client notified) is identical. If it
is identical, a generic spine is a copy job. If it forks, it is a product decision.
Resolve this first — it determines whether "one spine" is even viable.
