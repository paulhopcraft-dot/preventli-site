# WorkSafe VIC Premium Engine — Decode Notes (provenance)

**Date:** 2026-06-24
**Source:** `D:\Downloads\Premium Master Cracked 201213 Simulator (1).xlsx` (2012-13 cracked simulator, cached worked example — Princes Laundry Services). Read with openpyxl, **no recalc** — we trust the values Excel already cached.
**Verified by:** `04_verify_princes.py` — reproduces all three cached oracle values to the dollar from inputs.

---

## Oracle values (cached, no recalc)

| Quantity | Cell | Value |
|---|---|---|
| EPR (current 2011-12) | `EPR!P15` (named `EPR`) | **1.042814** |
| EPR (projected 2012-13) | `EPR!P36` (named `EPRproj`) | **1.022225** |
| Premium (projected 2012-13) | `2012-13 Preliminary Prem!F9` | **368274.99** |

⚠️ **The $368,275 premium uses the PROJECTED EPR (1.022225), not 1.042814.** The cracked file holds a two-year calc: 2011-12 = "current/result" year, 2012-13 = "projected/proposed" year. The headline premium is the projected-year figure. The two EPRs are independent oracle points and both decode cleanly.

---

## The real formula (literal — from cell `EPR!K7`)

> **`EPR = 1 + Z × (PI − 1) × T / 1096`**

### Cell-by-cell chain (current year shown; projected is the parallel block rows 23-41)

| Symbol | Cell | Formula | Princes value |
|---|---|---|---|
| ECCR | `Data!U10` | `ROUND(PremClaimsCosts / ExpPerRem, 6)` = 761000 / 39,087,035 | 0.019469 |
| AICCR | `IACCR!H8` | `ROUND(WICC / ExpPerRem, 6)`; WICC = Σ(ICCR_wp × rem3yr_wp) | 0.018290 |
| PI | `EPR!E15` | `ROUND(B12/B18, 6)` = ROUND(ECCR/AICCR, 6) | 1.064461 |
| X | `Z!D8` | `SUM(H15:H116)`, each H = `TRUNC(IR_wp × rem3yr_wp, 2)` | 1,186,682.36 |
| K | `Parameters!F5` | constant | 600,000 (2025-26: 2,000,000) |
| Z | `EPR!H9` / `Z!H9` | `ROUND(MaxWeight × X / (X + K), 6)` | 0.664182 |
| T | `EPR!K17` | `MIN(daysSinceStart, 1096)`; `K19`=1096 denom | 1096 → T/1096 = 1 |
| **EPR** | `EPR!P15` | `ROUND(1 + Z×(PI−1)×T/1096, 6)` (normal path = `ROUND(M13+M18,6)`) | **1.042814** |

### Key insight — what the simplified formula got WRONG

1. **X is NOT remuneration.** `X = Σ TRUNC(IR_wp × 3yrRem_wp, 2)` — the *expected industry premium over the 3-year experience window*. For a single-WIC employer: `X = IR × 3 × annualRem`. The simplified `Z = R/(R+K)` used remuneration; the real `Z = X/(X+K)` uses IR×3R. This is why the handoff's "Z=0.498 for a $20M employer" was *right* and the 0.9 estimate was wrong.
2. **ECCR & AICCR are over the 3-year experience period**, not single-year. PI = ECCR/AICCR is scale-invariant (claims and rem both scale), so a single-year ratio works for PI — but the 3× **matters for Z** (size/credibility).
3. **T/1096 taper** for employers with < 1096 days (~3 yrs) of experience. Established employers → T/1096 = 1.

### EPR overrides (in `EPR!P15`, outer→inner)
- `ISERR(...)` → EPR = 1
- `Sml_Y0 = "Yes"` (annualised rem ≤ $200k small threshold) → EPR = 1  *(the honesty-guard case)*
- `Y1DeemEPR <> " "` (insufficient experience, employer start date) → EPR = 1
- "Special EPR" (`O16 < O14`): a capped-IACCR alternative EPR can apply if lower — edge case, rarely binds.

---

## Premium build (per workplace, then summed)

`2012-13 Preliminary Prem` rows 15-116, one per workplace:

| Step | Cell | Formula |
|---|---|---|
| EPR (proj) | `G15` | `=EPRproj` (= L7) |
| WIR | `H15` | Current-Risk → `WIR!Q7` (rem-weighted industry rate; single WIC = IR) |
| Capping factor | `I15` | `=L9` |
| Applicable rate | `J15` | `ROUND(EPR × WIR × CF, 6)` = ROUND(1.022225 × 0.029070 × 1, 6) = 0.029716 |
| Remuneration | `K15` | projected-year rem for that workplace |
| Premium | `L15` | `ROUND(J15 × K15, 2)` |
| **Total** | `F9 = R13` | `SUM(R15:R116)` of per-workplace premiums |

Princes (3 current-risk workplaces): ROUND(0.029716 × 4,874,964) + ROUND(× 2,718,191) + ROUND(× 4,800,000) = 144,864.43 + 80,773.76 + 142,636.80 = **368,274.99** ✓

**Single-workplace model** (the public calculator): `ROUND(0.029716 × 12,393,155, 2)` = **368,274.99** — exact match here (0.0% delta; per-workplace rounding can introduce ≤ a few dollars on multi-WIC employers).

### Capping (`CF_Y0` / `L9`)
`L9 = MAX(MIN(ROUND(L11/L12, 6), 1), Parameters!G16)`. Compares the cappable rate against `comparativeRate × (1 + CappingRate)` where `CappingRate = 0.30`. Binds only when premium would rise > 30% YoY vs the prior-year baseline. Princes premium *fell* (423k → 368k) so CF = 1 (not binding). Capping needs the prior-year premium — handled in spec §4b.

---

## Parameters (2012-13 → 2025-26)

| Param | Named range | 2012-13 | 2025-26 |
|---|---|---|---|
| K (credibility constant) | `K` = Parameters!F5 | 600,000 | **2,000,000** |
| MaxWeight | `MaxWeight` = F10 | 1 | 1 |
| Small-employer threshold | `SmThld_Y0` = F7 | 200,000 | 200,000 |
| Min premium | `MinPremY0` = F8 | 168 | **~360** |
| Capping rate | `CappingRate` = F15 | 0.30 | 0.30 |
| GST | `GSTRate` = F18 | 0.10 | 0.10 |
| Deductible | `Deductible` = F6 | 15,500 | (FY-specific) |
| Buyout rate | `BuyoutRate` = F17 | 0.10 | 0.10 |
| Experience days (T denom) | `Parameters!F23` | 1096 | 1096 |

**Engine structure unchanged 2012-13 → 2025-26** (same sheets, same named ranges, EPR/PI/Z in identical cells). Only the parameter values + the per-WIC rate table change each financial year.

---

## Single-WIC calculator model (validated)

```
Inputs:  R = annual rateable wages ; wicCode ; C = annual claims cost (default ICCR×R) ; [priorPremium]
Lookups: IR, ICCR for wicCode (from ws_industry_rates_<FY>.json)
Params:  K, MaxWeight=1, SmallThld=200000, MinPrem, CappingRate=0.30, GST=0.10 (per FY)

ExpRem = 3 × R                              # 3-year experience period, flat-wage assumption
ECCR   = ROUND(C / R, 6)                     # annual basis; = experience C/ExpRem (scale-invariant)
PI     = ROUND(ECCR / ICCR, 6)
X      = TRUNC(IR × ExpRem, 2)  = IR × 3R
Z      = ROUND(X / (X + K), 6)
EPR    = ROUND(1 + Z × (PI − 1), 6)          # T/1096 = 1 for established employer
         if R ≤ SmallThld → EPR = 1          # small-employer flat-rate override
CF     = 1                                   # capping; binds only with priorPremium (§4b)
rate   = ROUND(EPR × IR × CF, 6)
premium= ROUND(rate × R, 2)
premium= MAX(premium, MinPrem)
# GST shown separately: premium × 1.10
```

### Savings & cost-of-claim (self-consistent, corrected)
- **Savings** (claims managed down 40%): `saving ≈ 0.4 × Z × (IR/ICCR) × C` (C = annual claims).
- **Cost of one claim** of size C (per year): `≈ C × Z × (IR/ICCR)`; ~3 years in the experience window.
- These are the **same formula** — mirror images. Both scale with Z (size) and IR/ICCR (industry leverage).
- Small employers (R ≤ $200k, EPR forced to 1) → saving = $0 and claim impact = $0. Honesty guard mandatory.

---

## Verification scripts (this folder)
- `01_dump_structure.py` — sheets, named ranges, key cells.
- `02_dump_engine.py` — all named ranges resolved (formula | cached value).
- `03_dump_grids.py` → `grids.txt` — full EPR / Z / Preliminary-Prem / Parameters grids.
- `04_verify_princes.py` — **reproduces EPR 1.042814, EPRproj 1.022225, premium 368274.99 from inputs.** ✅ all pass.
