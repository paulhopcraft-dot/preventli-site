// Deterministic WorkCover Victoria premium engine.
//
// A faithful port of WorkSafe's official premium formula, decoded cell-by-cell
// from the cached simulator and validated to the dollar against the Princes
// worked example. See agent-specs/premium-calculator.md §4 / §4b and the Python
// reference in .planning/phases/01-premium-engine/decode/{04_verify_princes,05_prove_savings}.py.
//
// NO AI in the calculation path. All functions are pure — no I/O, no network.
// The literal engine formula (cell EPR!K7): EPR = 1 + Z × (PI − 1) × T / 1096.

import { params as defaultParams, type PremiumParams } from "./params-2025-26";
import ratesData from "./rates-2025-26.json";

// ---------------------------------------------------------------------------
// Rounding primitives — Excel ROUND is half-AWAY-from-zero (NOT JS Math.round,
// which rounds half toward +Infinity). The exponential-string shift avoids the
// binary-float error of a naive `value * 10**n`, mirroring Python's
// Decimal(str(x)).quantize(..., ROUND_HALF_UP) used in the reference scripts.
// ---------------------------------------------------------------------------

/** Round half-away-from-zero to `decimals` places (Excel ROUND). */
export function round(value: number, decimals: number): number {
  if (!Number.isFinite(value)) return value;
  const sign = value < 0 ? -1 : 1;
  const shifted = Math.round(Number(`${Math.abs(value)}e${decimals}`));
  return sign * Number(`${shifted}e${-decimals}`);
}

// ---------------------------------------------------------------------------
// Industry rate lookup
// ---------------------------------------------------------------------------

interface RateRow {
  wic: string;
  description: string;
  iccr_2025_26: number;
  industry_rate_2025_26: number;
}

const rateIndex: Map<string, RateRow> = new Map(
  (ratesData as unknown as { rates: RateRow[] }).rates.map((r) => [r.wic, r]),
);

export interface IndustryLookup {
  /** Industry Rate (IR). */
  ir: number;
  /** Industry Claims Cost Rate (ICCR). */
  iccr: number;
  description: string;
}

/** Look up the gazetted IR/ICCR + plain-English description for a WIC code. */
export function lookupIndustry(wicCode: string): IndustryLookup {
  const row = rateIndex.get(wicCode);
  if (!row) throw new Error(`Unknown WIC code: ${wicCode}`);
  return {
    ir: row.industry_rate_2025_26,
    iccr: row.iccr_2025_26,
    description: row.description,
  };
}

// ---------------------------------------------------------------------------
// (0) CORE — the experience-premium-rate formula. The exact Princes oracle
// (G1) asserts directly against this.
// ---------------------------------------------------------------------------

export interface ComputeEprInput {
  /** Total claims cost over the experience window (~3 years). */
  claimsWindow: number;
  /** Experience-period remuneration (~3 × annual). */
  expRem: number;
  /** Z sizing base = IR × expRem (expected industry premium over the window). */
  X: number;
  /** Industry Claims Cost Rate. */
  iccr: number;
  /** Credibility constant K. */
  K: number;
  /** Maximum experience weight (1). */
  maxWeight: number;
  /** Experience days (1096 = an established employer, T/1096 = 1). */
  T: number;
}

export interface ComputeEprResult {
  epr: number;
  /** Performance Index — 1.0 = an industry-average employer. */
  pi: number;
  /** Credibility / sizing factor. */
  z: number;
}

/** Pure experience-premium-rate calc: EPR = ROUND(1 + Z×(PI−1)×T/1096, 6). */
export function computeEpr(input: ComputeEprInput): ComputeEprResult {
  const { claimsWindow, expRem, X, iccr, K, maxWeight, T } = input;
  const eccr = round(claimsWindow / expRem, 6);
  const pi = round(eccr / iccr, 6);
  const z = round((maxWeight * X) / (X + K), 6);
  const epr = round(1 + z * (pi - 1) * (T / 1096), 6);
  return { epr, pi, z };
}

// ---------------------------------------------------------------------------
// (2) PUBLIC WRAPPER — derives the experience window from a single year's
// wages + claims, applies the small-employer override and minimum premium.
// ---------------------------------------------------------------------------

export interface ComputePremiumInput {
  /** Annual rateable remuneration, $. */
  remuneration: number;
  wicCode: string;
  /** Annual claims cost, $. Defaults to industry-expected = ICCR × remuneration. */
  claimsCost?: number;
  /** Per-FY parameters; defaults to the active 2025-26 set. */
  params?: PremiumParams;
}

export interface ComputePremiumResult {
  premium: number;
  /** GST line = premium × 0.10. */
  gst: number;
  epr: number;
  pi: number;
  z: number;
  /** True when remuneration ≤ small-employer threshold (EPR forced to 1). */
  smallEmployer: boolean;
}

export function computePremium(input: ComputePremiumInput): ComputePremiumResult {
  const p = input.params ?? defaultParams;
  const { ir, iccr } = lookupIndustry(input.wicCode);

  const annualClaims = input.claimsCost ?? iccr * input.remuneration;
  const expRem = 3 * input.remuneration;
  const claimsWindow = 3 * annualClaims; // ~3 years of claims in the experience window
  const X = ir * expRem;
  const smallEmployer = input.remuneration <= p.smallEmployerThreshold;

  const core = computeEpr({
    claimsWindow,
    expRem,
    X,
    iccr,
    K: p.K,
    maxWeight: p.maxWeight,
    T: 1096,
  });
  // Small-employer flat-rate override (EPR!P15 order): rem ≤ threshold → EPR = 1.
  const epr = smallEmployer ? 1 : core.epr;

  const rate = round(epr * ir * 1, 6); // CF = 1 (binds only with a prior premium)
  let premium = round(rate * input.remuneration, 2);
  premium = Math.max(premium, p.minPremium);
  const gst = round(premium * p.gstRate, 2);

  return { premium, gst, epr, pi: core.pi, z: core.z, smallEmployer };
}

// ---------------------------------------------------------------------------
// (3) SAVINGS SCENARIO — baseline vs a 40%-lower CLAIMS-COST premium (the hook).
// 40% is off claims cost, never off premium. Size-aware honesty guard: small
// employers (flat rate) see no saving figure.
// ---------------------------------------------------------------------------

const FLAT_RATE_MESSAGE =
  "At your size, WorkSafe sets your premium by your industry rate — your claims " +
  "history doesn't change it yet. Preventli's value here is keeping you compliant, " +
  "managing claims well, and protecting you from rate increases as you grow.";

export interface SavingsScenarioResult {
  baselinePremium: number;
  /** Premium with claims cost reduced 40% (run through the real formula). */
  managedPremium: number;
  annualSaving: number;
  threeYearSaving: number;
  smallEmployer: boolean;
  /** False → render the size-aware message instead of a saving number. */
  showSaving: boolean;
  message?: string;
}

export function savingsScenario(input: ComputePremiumInput): SavingsScenarioResult {
  const p = input.params ?? defaultParams;
  const { iccr } = lookupIndustry(input.wicCode);
  const annualClaims = input.claimsCost ?? iccr * input.remuneration;

  const baseline = computePremium(input);
  const managed = computePremium({ ...input, claimsCost: annualClaims * 0.6 });

  const annualSaving = round(baseline.premium - managed.premium, 2);
  const threeYearSaving = round(annualSaving * 3, 2);

  // Honesty guard: small employer (flat rate) or no real saving → no figure.
  const showSaving = !baseline.smallEmployer && annualSaving > 0;

  return {
    baselinePremium: baseline.premium,
    managedPremium: managed.premium,
    annualSaving,
    threeYearSaving,
    smallEmployer: baseline.smallEmployer,
    showSaving,
    message: showSaving ? undefined : FLAT_RATE_MESSAGE,
  };
}

// ---------------------------------------------------------------------------
// (4) CLAIM IMPACT — the mirror of savings: what one un-managed claim costs in
// premium over the ~3-year experience window, with the 30% annual-rise cap.
// ---------------------------------------------------------------------------

export interface ClaimImpactInput {
  remuneration: number;
  wicCode: string;
  /** The one-off claim cost entering the experience window, $. */
  claimCost: number;
  /** Actual prior-year premium for a true cap; blank → uses our estimate. */
  priorYearPremium?: number;
  params?: PremiumParams;
}

export interface ClaimImpactResult {
  baselinePremium: number;
  /** Next-year premium with the claim added, before capping. */
  uncappedPremium: number;
  /** Next-year premium after the 30% annual-rise cap. */
  newPremium: number;
  capped: boolean;
  /** ~3-year premium impact ≈ Z × (IR/ICCR) × claimCost. */
  threeYearImpact: number;
  smallEmployer: boolean;
  /** False → small employer, no premium impact; render the size-aware message. */
  showImpact: boolean;
  message?: string;
}

export function claimImpact(input: ClaimImpactInput): ClaimImpactResult {
  const p = input.params ?? defaultParams;
  const { ir, iccr } = lookupIndustry(input.wicCode);

  const expRem = 3 * input.remuneration;
  const X = ir * expRem;
  const baselineWindow = iccr * expRem; // industry-expected claims over the window (PI = 1)
  const smallEmployer = input.remuneration <= p.smallEmployerThreshold;

  const eprCore = (claimsWindow: number): ComputeEprResult =>
    computeEpr({ claimsWindow, expRem, X, iccr, K: p.K, maxWeight: p.maxWeight, T: 1096 });

  const premiumAt = (claimsWindow: number): number => {
    const epr = smallEmployer ? 1 : eprCore(claimsWindow).epr;
    const rate = round(epr * ir * 1, 6);
    return Math.max(round(rate * input.remuneration, 2), p.minPremium);
  };

  const baselinePremium = premiumAt(baselineWindow);
  const uncappedPremium = premiumAt(baselineWindow + input.claimCost);

  // Capping: next-year premium limited to +30% over the prior-year baseline.
  const capBaseline = input.priorYearPremium ?? baselinePremium;
  const cappedCeiling = round(capBaseline * (1 + p.cappingRate), 2);
  const capped = uncappedPremium > cappedCeiling;
  const newPremium = capped ? cappedCeiling : uncappedPremium;

  // 3-year impact closed form (§4b): the (Z/3)×3 cancels to Z.
  const z = smallEmployer ? 0 : eprCore(baselineWindow).z;
  const threeYearImpact = round(z * (ir / iccr) * input.claimCost, 2);

  const showImpact = !smallEmployer && threeYearImpact > 0;

  return {
    baselinePremium,
    uncappedPremium,
    newPremium,
    capped,
    threeYearImpact,
    smallEmployer,
    showImpact,
    message: showImpact ? undefined : FLAT_RATE_MESSAGE,
  };
}
