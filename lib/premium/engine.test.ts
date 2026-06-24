// Golden tests for the deterministic premium engine.
//
// Oracle values are engine-proven (validated 2026-06-24) and asserted verbatim
// from agent-specs/premium-calculator.md §8 + the Python reference in
// .planning/phases/01-premium-engine/decode/{04_verify_princes,05_prove_savings}.py.
// Tier-1 (G1, G2) reproduce the WorkSafe simulator's cached Princes example to the
// dollar — these are the DoD oracle markers (EPR 1.042814, premium 368274.99).
//
// DO NOT invent expected values. Every number here traces to the spec/decode.

import { describe, it, expect } from "vitest";
import { computeEpr, computePremium, savingsScenario, round } from "./engine";

// 2012-13 Princes params (K=600,000) — the exact-formula oracle window.
const K_PRINCES = 600_000;
// Princes Laundry rates (2012-13, current year).
const IR_L = 0.03036;
const ICCR_L = 0.01829;

describe("Tier 1 — exact formula validation vs WorkSafe simulator (Princes cached example)", () => {
  // G1: port of 04_verify_princes.py current-year assertion. The DoD marker.
  it("G1: computeEpr reproduces EPR exactly 1.042814", () => {
    const { epr, pi, z } = computeEpr({
      claimsWindow: 761_000, // Data!U8 — 3-yr experience-period claims
      expRem: 39_087_035, // Data!U9 — 3-yr experience remuneration
      X: 1_186_682.36, // Z!D8 — Σ(IR_wp × rem3yr_wp), the Z sizing base
      iccr: ICCR_L, // IACCR!H8 = 0.018290
      K: K_PRINCES,
      maxWeight: 1,
      T: 1096, // established employer → T/1096 = 1
    });

    expect(pi).toBe(1.064461);
    expect(z).toBe(0.664182);
    expect(epr).toBe(1.042814); // ← DoD oracle marker
  });

  // G2: port of 04_verify_princes.py projected-year premium. The DoD marker.
  // premium_workplaces: rate = ROUND(EPR × WIR × CF, 6); premium = ROUND(rate × rem, 2).
  it("G2: projected EPR + rate yield premium exactly 368274.99", () => {
    const eprProj = 1.022225; // EPR!P36 (projected 2012-13)
    const wir = 0.02907; // 2012-13 Preliminary Prem!H15 — applicable WIR
    const cf = 1; // capping factor
    const rem = 12_393_155;

    const rate = round(eprProj * wir * cf, 6);
    const premium = round(rate * rem, 2);

    expect(rate).toBe(0.029716);
    expect(premium).toBe(368274.99); // ← DoD oracle marker
  });
});

describe("Tier 2 — calculator model (2025-26, K=2,000,000)", () => {
  // G3: savings scenario — port of 05_prove_savings.py PART 3 ($30M, claims 1.6× industry).
  // 40% claims-cost cut run through the real formula. Oracle: annual saving ≈ $336,600.
  it("G3: $30M employer, 40% claims-cost cut → annual saving ≈ 336600", () => {
    const rem = 30_000_000;
    const expRem = 3 * rem;
    const annualClaims = 877_920; // ≈ 1.6 × (ICCR × rem) industry-expected
    const X = IR_L * expRem;

    const eprAt = (claimsWindow: number) =>
      computeEpr({ claimsWindow, expRem, X, iccr: ICCR_L, K: 2_000_000, maxWeight: 1, T: 1096 })
        .epr;
    const premiumAt = (claimsWindow: number) =>
      round(round(eprAt(claimsWindow) * IR_L * 1, 6) * rem, 2);

    const baselineEpr = eprAt(3 * annualClaims);
    const managedEpr = eprAt(3 * annualClaims * 0.6);
    expect(baselineEpr).toBe(1.346429);
    expect(managedEpr).toBe(0.976892);

    const annualSaving = round(premiumAt(3 * annualClaims) - premiumAt(3 * annualClaims * 0.6), 2);
    expect(annualSaving).toBe(336600);
  });

  // G4: small-employer guard — rem ≤ $200k → EPR forced to 1, no saving figure shown.
  // Exercises the real wrapper + honesty guard on a live 2025-26 WIC.
  it("G4: small employer (<$200k) → EPR=1, premium=ROUND(ir×rem,2), saving suppressed", () => {
    const wicCode = "S95310"; // Laundry And Dry-Cleaning Services (2025-26), ir=0.03741
    const ir = 0.03741;
    const rem = 150_000;

    const { epr, premium, smallEmployer } = computePremium({ remuneration: rem, wicCode });
    expect(epr).toBe(1);
    expect(smallEmployer).toBe(true);
    expect(premium).toBe(round(ir * rem, 2));

    const savings = savingsScenario({ remuneration: rem, wicCode });
    expect(savings.showSaving).toBe(false);
    expect(savings.annualSaving).toBe(0);
  });

  // G5: claim impact — port of 05_prove_savings.py PART 1 (Princes, K=600,000).
  // A $100k claim-cost change moves premium +$34,949/yr → +$104,846 over 3 years.
  it("G5: +$100k claim → +34949/yr, +104846/3yr (Princes, K=600,000)", () => {
    const expRem = 39_087_035;
    const rem = 12_393_155;
    const X = IR_L * expRem;

    const princesPremium = (claimsWindow: number) => {
      const { epr } = computeEpr({
        claimsWindow,
        expRem,
        X,
        iccr: ICCR_L,
        K: K_PRINCES,
        maxWeight: 1,
        T: 1096,
      });
      return round(round(epr * IR_L * 1, 6) * rem, 2);
    };

    const before = princesPremium(761_000);
    const after = princesPremium(761_000 - 100_000);
    const perYear = round(before - after, 2);
    const threeYear = round(perYear * 3, 2);

    // Oracle displayed to the whole dollar in the spec / decode.
    expect(Math.round(perYear)).toBe(34949);
    expect(Math.round(threeYear)).toBe(104846);
  });
});
