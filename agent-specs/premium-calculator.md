# Premium Calculator — Build Spec (preventli-site)

**Status:** Phase 0 complete — engine decoded **cell-by-cell and validated to the dollar** vs the Princes cached example (2026-06-24), rates sourced, requirements grilled. Ready for Phase 1 build (port §4 to `engine.ts`, golden-test vs the 2025-26 simulator).
**Repo:** `D:\dev\preventli-site` (Next.js 16 App Router, React 19, Tailwind v4, Clerk, Supabase, Resend)
**Date:** 2026-06-23

---

## 1. What we're building

A public **WorkCover Victoria premium calculator** on preventli.ai. An SMB owner enters their wages and industry; the tool estimates their annual WorkCover premium and shows how much Preventli's claims management could save them. Lead-gen tool: free result, soft email capture, branded PDF.

**The maths is a deterministic engine** — a faithful port of WorkSafe's official premium formula, golden-tested against WorkSafe's own simulator. No AI in the calculation path.

---

## 2. Locked requirements (from grill)

| Decision | Answer |
|---|---|
| Audience (v1) | **Public on site now**; logged-in client pre-fill = later app-side phase |
| Output | Estimated premium **+ Preventli savings scenario** (the hook) |
| Savings model | **40% lower claims cost, run through the real formula** (saving varies by size — defensible) |
| Lead capture | **Free result + soft capture** (no gate) |
| Result CTA | **Email me a branded PDF copy** (captures lead) |
| Industry input | **Searchable plain-English picker** over the 529 official classifications |
| Claims input | **Default to industry average**, user can adjust |
| Disclaimer | **"For illustration purposes only"** — indicative estimate, not an official WorkSafe quote (canonical wording in §6) |

---

## 3. Architecture

```
app/
  premium-calculator/
    page.tsx                 # the calculator page (client component)
  api/
    premium-lead/route.ts    # POST: validate → Supabase insert → Resend (PDF to user + notify team)
components/
  premium-calculator/
    Calculator.tsx           # form + live result UI
    IndustryPicker.tsx       # searchable combobox over WIC list
    ResultPanel.tsx          # premium + savings + CTA
lib/
  premium/
    engine.ts                # deterministic premium calc (pure functions)
    engine.test.ts           # golden tests vs official simulator
    rates-2025-26.json       # 529 industries (from D:\Downloads\ws_industry_rates_2025-26.json)
    params-2025-26.ts        # K, thresholds, min prem, GST, etc.
    industry-synonyms.ts     # plain-English term → WIC mapping layer
    pdf/PremiumReport.tsx     # @react-pdf/renderer branded report
```

New dependency: **`@react-pdf/renderer`** (server-side PDF). Everything else uses existing deps.

---

## 4. The premium engine (deterministic)

> **✅ DECODED & VALIDATED (2026-06-24).** This is the real WorkSafe engine, traced cell-by-cell from the cached 2012-13 simulator (openpyxl, no recalc) and **reproduced to the dollar** against the Princes Laundry worked example — EPR `1.042814`, EPRproj `1.022225`, premium `$368,274.99`. Full cell-level provenance + the verification script in `.planning/phases/01-premium-engine/decode/` (`DECODE-NOTES.md`, `04_verify_princes.py`). The literal engine formula is in cell `EPR!K7`: **`EPR = 1 + Z × (PI − 1) × T / 1096`**.
>
> **What the earlier simplified decode got wrong:** (a) **X is not remuneration** — the Z sizing base is `X = IR × 3-year-remuneration` (expected industry premium over the experience window), so `Z = X/(X+K)`, *not* `rem/(rem+K)`. This is why a $20M employer has Z≈0.50, not ~0.9. (b) ECCR/AICCR run over the **3-year experience period**. (c) a **T/1096 taper** applies to employers with < ~3 years of experience. The handoff's "PI=1.51 at industry-average" was a broken-recalc artifact, not the real engine.

Single-WIC port of the engine (engine structure confirmed unchanged 2012-13 → 2025-26; only parameters + the per-WIC rate table change each FY). All functions pure; no I/O.

### Inputs
- `remuneration` (R) — annual rateable wages, $ — user enters
- `wicCode` — from industry picker
- `claimsCost` (C) — annual claims cost; defaults to **industry-expected** = `ICCR × R`; user can override
- `priorPremium` (optional) — for true capping (§4b)

### Lookups (from rates table, by `wicCode`)
- `IR` — Industry Rate (e.g. 0.03036)
- `ICCR` — Industry Claims Cost Rate (e.g. 0.01829)

### Parameters (per financial year — `params-<FY>.ts`)
- `K` = **2,000,000** (2025-26; was 600,000 in 2012-13) — credibility constant
- `MaxWeight` = 1 · `SmallThreshold` = 200,000 · `MinPremium` ≈ 360 (2025-26) · `CappingRate` = 0.30 · `GST` = 0.10
- `ExperienceYears` = 3 (T denominator = 1096 days)

### Calculation (validated chain)
```
ExpRem  = 3 × R                              # 3-year experience period (flat-wage assumption)
ECCR    = ROUND(C / R, 6)                     # = experience C/ExpRem (scale-invariant in the PI ratio)
PI      = ROUND(ECCR / ICCR, 6)               # Performance Index; 1.0 = industry-average employer
X       = TRUNC(IR × ExpRem, 2)  ( = IR × 3R )# Z sizing base = expected industry premium over experience
Z       = ROUND(MaxWeight × X / (X + K), 6)   # credibility / sizing factor
EPR     = ROUND(1 + Z × (PI − 1) × T/1096, 6) # T/1096 = 1 for an established employer (≥ ~3 yrs)
          if R ≤ SmallThreshold → EPR = 1     # small-employer flat-rate override
CF      = 1                                   # capping factor; binds only with priorPremium (§4b)
rate    = ROUND(EPR × IR × CF, 6)             # applicable premium rate
premium = ROUND(rate × R, 2)
premium = MAX(premium, MinPremium)
# GST shown as a separate line: premium × 1.10
```
**EPR override order** (from `EPR!P15`): calc-error → 1; small employer (rem ≤ threshold) → 1; insufficient experience / employer start → 1; else the standard EPR (a rarely-binding "special EPR" lower-of alternative exists for capped-IACCR cases — out of v1 scope).

### Savings scenario (the hook)
- **Baseline** = premium at the user's actual `claimsCost C` (default → `PI = 1`, `EPR = 1`, premium = industry rate × R).
- **Preventli scenario** = premium with `claimsCost × 0.60` (40% reduction). PI scales linearly with claims, so `EPR_preventli = 1 + Z × (0.6·PI − 1)`.
- **Saving** = baseline − Preventli premium. Closed form: **`saving ≈ 0.4 × Z × (IR / ICCR) × C`** (C = annual claims).
- This is the **exact mirror of the §4b "cost of a claim"** formula (`≈ C × Z × IR/ICCR` per year) — both scale with `Z` (size) and `IR/ICCR` (industry leverage). It **scales with employer size**: large employers (Z→1) see the most; mid-size proportionally less; **small employers (R ≤ $200k, EPR forced to 1) see $0** because their premium is the flat industry rate.

### Honesty guardrail (size-aware messaging)
- If `EPR` is forced to 1 (small employer) **or** computed saving ≈ $0: do **not** show a premium-saving number. Show instead: *"At your size, WorkSafe sets your premium by your industry rate — your claims history doesn't change it yet. Preventli's value here is [keeping you compliant, managing claims well, and protecting you from rate increases as you grow]."* This is non-negotiable: a wrong public number contradicts WorkSafe's own maths.

### Open verification item (Phase 1)
The decode is validated against the **2012-13** cached example. Before shipping, golden-test the ported engine against the **2025-26** official simulator (`WS_simulator_2025-26.xlsx`) to confirm K=2,000,000, the 3-year/1096-day experience window, and MinPremium are unchanged — the structure is, but the params must be re-confirmed each FY.

---

## 4b. The "true cost of a claim" projection (worst-case premium impact)

**Purpose:** show what a single serious claim *really* costs — not just the claim itself, but the **premium inflation it drives over the experience period (~3 years)**. This is the mirror image of the savings story: savings = managing claims down; this = the price of a bad claim left unmanaged. Together they bracket the whole value of claims management.

**The maths (same engine, run as a marginal impact — PROVEN against the engine, `05_prove_savings.py`):**
- A claim of cost `C` raises the employer's claims experience, which raises their premium.
- ⚠️ **Corrected 2026-06-24 (was overstated ~3×).** Because the engine averages claims over the **3-year** window (`ECCR = claimsInWindow / 3-year-rem`), the *annual* impact is **`(Z/3) × (IR/ICCR) × C`**, where **`Z = X/(X+K)`, `X = IR × 3 × remuneration`** (NOT `rem/(rem+K)`).
- A claim sits in the window for ~3 years (3 successive premium calcs) → **3-year total impact = `Z × (IR/ICCR) × C`** (the `(Z/3)×3` cancels to `Z`).
- So for a credible-size employer (`Z ≈ 0.5–0.85`, `IR/ICCR ≈ 1.5–1.7`): a claim costs **~0.8–1.4× its face value in premium over 3 years** — i.e. its *total* cost ≈ **~1.8×–2.4× face** (the claim itself **plus** the premium it drives). Large employers sit at the top of that; small (`Z→0`) see ~no premium impact.
- **Validated worked example (Princes, K=600k):** a $100k claim-cost change moves premium **$34,949/yr → $104,846 over 3 years** (1.05×). Live 2025-26 (K=2,000,000) per $100k: ~$7k (a $1M employer) → ~$136k (a $100M employer). The number is meaningless without the wage roll — Z spans 0.04→0.82.

**Inputs:** the user's wages + industry (already entered) + a claim cost `C`.

**"Maximum claim" definition** — two options (Paul to pick):
- (a) **WorkSafe's per-claim cost cap** as the ceiling — **TO SOURCE** (not in the simulator; would source from WorkSafe like the rates).
- (b) **A configurable worst-case amount** (preset "serious claim" default, optionally adjustable) — no external cap needed; simpler.

**Display:** a panel — *"⚠️ What one serious claim could cost you: ~$X/year for 3 years ≈ ~$Y total"* — personalised to their size.

**Size-aware honesty guard (same rule as savings):** small employers (< $200k, `Z = 0`) see **$0 premium impact** with the message "your premium is the flat industry rate — a claim doesn't change it yet." Never show a scary number that WorkSafe's maths wouldn't produce.

### Interactive claim entry + capping (Paul, 2026-06-23)

The panel is **interactive**: the user edits a claim cost (e.g. **$600,000**) and sees a **recomputed premium** including that claim.
- **Baseline** = the premium the calculator just showed (pre-claim).
- **With-claim (uncapped)** = premium recomputed with the claim added to claims cost.
- **Capping** = WorkSafe limits the year-on-year premium-rate rise to **30%** (`CappingRate = 0.30` in the 2025-26 order; also a `Minimum Capping Ratio = 0.25` floor on decreases). So the *next-year* premium is limited to **+30% over the pre-claim baseline**.
- **The tool MUST indicate when the cap binds**, e.g.: *"New premium $665,600 — capping applied (annual rise limited to 30%). Without the cap it would be $700,000; the remainder carries into the following years."* This is also **why a large claim costs over ~3 years** — the cap spreads its impact across years.
- **Baseline accuracy — optional "last year's premium" input (Paul, 2026-06-23):** the *true* cap compares against the employer's **actual prior-year premium**, not our estimate. So add an **optional prior-premium field**: blank → tool uses its own estimated premium as the baseline and labels the output an **estimate**; entered → cap computed against the real figure = a **true value**. Logged-in client phase supplies it automatically. This reverses the earlier "derive our own baseline, no prior-premium needed" note — for a true value it IS needed.
- **Honesty / simplification:** real capping limits *rate* movement with remuneration/size nuances; for the illustration we use the headline 30% annual-rise cap. Value lives in `params-<FY>.ts` (sourced from the official order), clearly labelled a simplification.
- **Size-aware guard still applies:** small employers (flat rate) → no rise, no cap shown.

---

## 5. Data: industry rate table

- Source: `ws_industry_rates_2025-26.json` (529 industries; WIC + description + ICCR + IR). Already extracted from the official WorkSafe 2025-26 simulator + Gazette S 275.
- Ships as a static JSON import in `lib/premium/rates-2025-26.json`.
- **Annual refresh path:** each June WorkSafe gazettes new rates → re-run the extract script → drop in `rates-<FY>.json` + bump `params-<FY>.ts`. Versioned by financial year; the engine reads the active FY. A data swap, not a rebuild.

---

## 6. UI / page spec

- **Route:** `/premium-calculator` (SEO target: "WorkCover premium calculator Victoria"). Standalone page, matches site nav/footer.
- **Form factor:** single screen, **live-updating result** (no submit-to-calculate). Mobile-first (Tailwind, matches existing site).
- **Inputs (3):**
  1. **Annual wages** — dollar input, formatted, with a helper ("total gross wages + super").
  2. **Industry** — `IndustryPicker`: type a trade ("cafe", "laundry", "plumbing") → matches against WIC descriptions + a synonym layer → user confirms. Shows the matched official classification for transparency.
  3. **Claims cost** — collapsed by default ("We've estimated this from your industry — adjust if you know your figure"), pre-filled with `ICCR × wages`.
- **Result panel (`ResultPanel`):**
  - Headline estimated **annual premium** (+ GST line).
  - **★ THE HIGHLIGHT — the savings block (computed live from their wage roll, all figures PROVEN against the engine, `05_prove_savings.py`):**
    - Lead line: *"With Preventli managing your claims, your estimated premium drops from **$baseline** to **$managed** — saving **$annualSaving/year** (~$3yrSaving over 3 years)."*
    - The driver, stated truthfully: *"We don't cut your premium directly — we cut your **claims cost** (up to 40%* for employers who already carry real claims costs), and lower claims flow straight into a lower premium."* (`*` = §11 asterisk.)
    - **Two numbers, both wage-roll-dependent (this is WHY the wages input is required):** (a) **claims-cost reduction** up to 40% (the lever Preventli pulls); (b) **resulting premium saving** = `0.4 × Z × (IR/ICCR) × claims` — ~25–30% off premium for a mid-large employer with elevated claims, scaling down with size (worked: $30M / claims 1.6× industry → **~$337k/yr, ~$1.0M / 3yr**).
    - **NEVER** render "40% off premium" — 40% is off **claims cost**; the premium % is smaller and size-scaled. Headline copy must say "lower claims cost".
    - Mirror panel (§4b): *"And what one un-managed claim costs you"* — a claim of cost `C` adds ≈ `Z × (IR/ICCR) × C` to premium over 3 years (the same engine, run the other way).
  - **"How we bring the cost down" block** (gives the saving teeth — confirmed with Paul 2026-06-24; the 40% is real for employers with "decent" existing costs):
    | Cost driver | How Preventli reduces it |
    |---|---|
    | Weekly payments (time off work) — biggest cost | Early intervention + return-to-work onto suitable duties sooner (the #1 lever) |
    | Treatment / medical over-servicing | Active claims + medical management; IME where capacity is unclear |
    | Wrongly-accepted / over-scoped liability | Liability & dispute management — only genuine work-related cost stays on the claim |
    | Long-tail / impairment claims | Capacity assessment & resolution (IME + medico-legal where warranted) |
  - Plain-English "how this is worked out" expander (industry rate, performance rating, claims impact) — builds trust.
  - **CTA:** "Email me a copy" → email field → branded PDF.
  - **Canonical disclaimer** (must appear on the result panel, in the PDF, and in the prospect email — same wording everywhere):
    > *For illustration purposes only. This is an indicative estimate based on gazetted 2025-26 industry rates and a simplified single-year calculation — it is not an official WorkSafe premium quote. Your actual premium is determined by WorkSafe Victoria and depends on your full claims history, remuneration and workplace details.*
- **Brand:** navy `#0A1628`, green accent `#00E676`, Inter font. Tagline asset: "30 years of WorkCover expertise. 3,000+ cases managed."

---

## 7. Lead capture + branded PDF

Mirrors the existing `app/api/contact/route.ts` pattern exactly.

- **`POST /api/premium-lead`**: `{ email, wages, wicCode, claimsCost, premium, saving }`
  1. Validate (email regex as in contact route).
  2. Insert into new Supabase table **`premium_calc_leads`** (email, inputs, computed premium + saving, `status: "new"`, created_at).
  3. **Resend** — two emails (guarded by env vars, same as contact route):
     - **To prospect:** branded result email + **PDF attachment** (`@react-pdf/renderer` → buffer → Resend attachment). From `Preventli <noreply@preventli.ai>`.
     - **To team** (`paul.hopcraft@gmail.com`): "New premium-calc lead: {email}, premium ${premium}, saving ${saving}".
  4. Never fail the request on email error (match contact route's resilience).
- **PDF** (`pdf/PremiumReport.tsx`): branded one-pager — their inputs, estimated premium, savings scenario, the size-aware caveat, disclaimer, `lisah@preventli.ai` contact + a "book a call" link.
- Env vars already present: `RESEND_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, supabase admin client in `lib/supabase.ts`.

> **Note — booking CTA:** you chose PDF-only at the grill. A "Book a call" button (Lisa's Calendly) is a one-line add inside the PDF/result if you want it later; not in v1 unless you say so.

---

## 8. Verification (golden tests vs official simulator)

- **Oracle:** WorkSafe's official 2025-26 simulator (`D:\Downloads\WS_simulator_2025-26.xlsx`). Sheet protection is irrelevant — recalc via LibreOffice (`recalc.py`).
- Build a set of golden cases spanning: small employer (< $200k), mid-size, large; low/average/high claims; several industries (incl. the 18% default class).
- For each: enter inputs into the simulator, read its premium, assert `engine.ts` matches within tolerance.
- **Phase 3 (the one ultracode-worthy step):** a workflow that throws hundreds of randomised employer scenarios at both the Excel and `engine.ts` and reports any divergence. This is where multi-agent parity-checking earns its keep.
- Reconciliation note: the official model uses a multi-year experience period + stabilisation; v1 estimates on a **single-year snapshot** (current wages + claims). Expect small deltas vs the full model — document the tolerance and that it's an *estimate*.

### Golden cases (POPULATED — validated 2026-06-24, oracle values are engine-proven)

These are the assertions `engine.test.ts` MUST make. Tier-1 values are reproduced **to the dollar** from the WorkSafe simulator's cached Princes example (no recalc); the reference implementation is `.planning/phases/01-premium-engine/decode/04_verify_princes.py` and `05_prove_savings.py` (Python) — port the assertions to TS.

**Engine shape this requires:** expose a pure **core** `computeEpr({ claimsWindow, expRem, X, iccr, K, maxWeight, T })` so the exact Princes oracle is testable, plus the public **wrapper** `computePremium({ remuneration, wicCode, claimsCost })` that derives `expRem = 3 × remuneration` and `X = ir × expRem` and calls the core. Both share one code path.

**Tier 1 — exact formula validation** (params: `K=600,000`, `maxWeight=1`, `T=1096`):

| # | Inputs | Expected (oracle, exact) |
|---|---|---|
| G1 | `claimsWindow=761000`, `expRem=39,087,035`, `X=1,186,682.36`, `iccr=0.018290` | `PI=1.064461`, `Z=0.664182`, **`EPR=1.042814`** |
| G2 | `EPR=1.022225` (projected), `ir=0.029070`, `rem=12,393,155`, `CF=1` | `rate=0.029716`, **`premium=368274.99`** |

**Tier 2 — calculator model** (params: 2025-26, `K=2,000,000`; wrapper, `expRem=3×rem`):

| # | Inputs | Expected |
|---|---|---|
| G3 (savings) | `rem=30,000,000`, `ir=0.03036`, `iccr=0.018290`, `annualClaims=877,920` (≈1.6× industry), managed = 0.6× | baseline `EPR=1.346429` → managed `EPR=0.976892`; **annual saving ≈ `336600`** |
| G4 (small-employer guard) | `rem=150,000`, any wic | **`EPR=1`**, `premium=ROUND(ir×150000,2)`, **`saving=0`** (no saving figure shown) |
| G5 (claim impact, K=600,000) | `rem=12,393,155`, `ir=0.03036`, `iccr=0.018290`, `+100,000` claim | **`+34,949/yr`**, **`+104,846 / 3yr`** |

**Oracle markers the DoD gate greps for in the test file:** `1.042814`, `368274.99`. An empty/trivial test cannot pass.

> ⚠️ **Honest caveat — these oracles are 2012-13 (K=600k) for the exact cases.** They validate the **formula** to the dollar. They do **not** yet confirm the 2025-26 **parameters** (K=2,000,000, 1096-day window, MinPremium). Phase 1 must additionally assert the live params load correctly; a true 2025-26 oracle (from `WS_simulator_2025-26.xlsx`, or the real 2024-25 filled sims in `D:\Downloads`) is the Phase 3 parity sweep. Do **not** claim 2025-26 dollar-accuracy until that runs.

---

## 8a. Definition of Done (deterministic gate for an autonomous/long run)

The build is DONE when **`~/.claude/verify/premium-calculator.sh` exits 0**. That script is the `-GoalVerify` target for the Ralph harness / `/goal-verify`. It runs these gates in order — all must pass, no partial credit, no synthetic bypass:

1. **Builds clean** — `npm run build` in `preventli-site` (0 type errors, compiles).
2. **Maths proven** — `npx vitest run lib/premium` passes AND the golden test asserts against WorkSafe-simulator oracle values (the script greps the test file for the oracle markers, so an empty/trivial test can't pass this gate).
3. **Page computes** — built app served; `GET /premium-calculator` returns 200 and contains a wages input, the "illustration purposes only" disclaimer, and the 40% asterisk text; a real input renders a premium.
4. **Honesty guard fires** — a small-employer (<$200k) scenario yields the "set by your industry rate" message and **no** saving figure (negative assertion).
5. **Lead path wired** — `POST /api/premium-lead` stores a lead and invokes the PDF+email path (Resend mocked; assert it was called — routes through the real handler, not a direct helper call).

**Cannot be auto-verified → PAUSE for Paul (job stops and shows, never self-certifies):** visual/brand quality; a real test email + actual PDF render; final copy/positioning sign-off.

**Circuit breakers (anti-thrash):** `-MaxLoops` / `-MaxMinutes` + `work-defaults.json` stop-list (no prod push, no destructive ops, spend cap). If green isn't reached within caps → HALT and surface the blocker. Never fake done.

## 9. v1 scope

**In:** single-workplace public calculator, 3 inputs, live premium + savings, size-aware honesty guard, **interactive claim-impact projection with 30% capping indicator**, email-PDF lead capture, 2025-26 rates.

**Optional in v1:** prior-year premium input (blank = labelled estimate; entered = true capped value).

**Out (deferred):** logged-in client pre-fill (app-side phase), multi-workplace allocation, deductible/buyout options, booking CTA, multi-year experience period, full WorkSafe capping mechanic (v1 uses the simplified 30% annual-rise cap).

---

## 10. Phasing

| Phase | Deliverable | Ultracode? |
|---|---|---|
| 0 ✅ | Engine decoded, rates extracted, spec (this doc) | No |
| 1 | `engine.ts` + rates/params + golden tests vs simulator | No (`/work`) |
| 2 | UI page + industry picker + result panel + `/api/premium-lead` + PDF | No (`/work`) |
| 3 | Parity verification sweep (Excel vs engine, 100s of cases) | **Yes — good fit** |

---

## 11. Open items / risks

1. **The 40% claim — PROVEN, confirmed by Paul (2026-06-24), with a defined caveat.** The 40% is a reduction in **claims COST**, not premium — and Paul stands behind it **for employers who already carry real ("decent") claims costs**, i.e. whose claims have pushed them **above their industry rate** (Performance Index > 1). The further above benchmark, the bigger the saving. Employers at/below industry and small (flat-rate) employers see less or none. **A 40% claims-cost cut translates to ~25–30% off *premium* for a mid-large employer (size-scaled by Z), never 40% off premium** — the calculator computes each visitor's *real* figure from their wage roll + claims. The "40% lower claims cost" is the hero claim and **must always carry the asterisk** below, and must **never** be phrased as "40% lower premium".
   - **Asterisk copy (use wherever "40%" appears — hero, result, PDF, email):** *Up to 40% lower claims cost — based on employers who already carry meaningful claims costs (a claims history above their industry rate). The further above the industry benchmark you sit, the greater the potential saving; lower claims cost then flows through to a lower premium (typically a smaller percentage, scaled by your size). Employers already at or below their industry rate, and small employers on the flat rate, will see less. Enter your figures for your own estimate.*
   - **Display:** render as **fine print** (small, muted text) beneath the savings figure — general wording, no specific percentage threshold (Paul's call, 2026-06-23).
2. **Single-year vs multi-year model** — accept estimate-level accuracy; quantify the tolerance in Phase 1.
3. **`premium_calc_leads` table** needs creating in Supabase (mirror `contact_submissions`).
4. **PDF on Vercel** — `@react-pdf/renderer` renders server-side fine; confirm bundle/runtime on the Vercel deploy.
5. **Industry synonym layer** — the 529 descriptions are semi-technical; the synonym map (common trade → WIC) is what makes the picker usable. Budget a pass to seed the top ~50 trades.
```
