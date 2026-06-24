// WorkSafe Victoria 2025-26 premium parameters.
// Sourced from the official 2025-26 Premiums Order / simulator (see agent-specs/premium-calculator.md §4).
// Per-FY values: copy this file to params-<FY>.ts and bump on the annual gazette.

export interface PremiumParams {
  /** Credibility / sizing constant K (2025-26: 2,000,000; was 600,000 in 2012-13). */
  K: number;
  /** Maximum experience weight applied in the Z sizing factor. */
  maxWeight: number;
  /** Remuneration at/below which the employer is flat-rated (EPR forced to 1). */
  smallEmployerThreshold: number;
  /** Minimum payable premium, $. */
  minPremium: number;
  /** GST rate shown as a separate line. */
  gstRate: number;
  /** Headline year-on-year premium-rate increase cap (30%). */
  cappingRate: number;
  /** Floor on year-on-year premium-rate decreases (minimum capping ratio). */
  minCappingRatio: number;
  /** Buyout rate (out of v1 scope; retained for completeness). */
  buyoutRate: number;
  /** Deductible amount, $ (out of v1 scope; retained for completeness). */
  deductible: number;
  /** Scheme average premium rate. */
  schemeAverageRate: number;
  /** Financial year these parameters apply to. */
  financialYear: string;
}

export const params: PremiumParams = {
  K: 2_000_000,
  maxWeight: 1,
  smallEmployerThreshold: 200_000,
  minPremium: 330,
  gstRate: 0.1,
  cappingRate: 0.3,
  minCappingRatio: 0.25,
  buyoutRate: 0.1,
  deductible: 15_500,
  schemeAverageRate: 0.018,
  financialYear: "2025-26",
};
