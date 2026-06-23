"""
PROOF: how much does cutting claims cost actually reduce premium?
Runs the FULL decoded engine (exact ROUND chain), not the closed-form approx.

Two parts:
  PART 1 - Princes (validated example, real K=600k): reduce 3-yr claims by $100k,
           recompute premium exactly. Per-year delta x 3-yr window.
  PART 2 - Live 2025-26 (K=2,000,000): sweep wage roll $1M..$100M, show per-$100k
           claim cut -> per-year + 3-year premium relief. Proves it needs wage roll.

Key fact from the decode: a claim's cost sits in the rolling 3-year experience
window, so it affects 3 successive annual premium calcs. ECCR = claimsInWindow /
(3 x annualRem).  =>  3-yr premium relief = Z x (IR/ICCR) x (claims cut).
"""
from decimal import Decimal, ROUND_HALF_UP

def rnd(x, n):
    q = Decimal(1).scaleb(-n)
    return float(Decimal(str(x)).quantize(q, rounding=ROUND_HALF_UP))

def premium(annual_rem, claims_window, IR, ICCR, K, exp_rem, small_thld=200000):
    """Single-WIC engine. claims_window = total claims in the 3-yr experience window."""
    if annual_rem <= small_thld:
        epr = 1.0
    else:
        ECCR = rnd(claims_window / exp_rem, 6)
        PI   = rnd(ECCR / ICCR, 6)
        X    = IR * exp_rem                      # = IR x 3yrRem (Z sizing base)
        Z    = rnd(X / (X + K), 6)
        epr  = rnd(1 + Z * (PI - 1), 6)          # T/1096 = 1
    rate = rnd(epr * IR * 1.0, 6)                 # CF = 1
    return rnd(rate * annual_rem, 2), (epr, rate)

print("="*78)
print("PART 1 — PRINCES (validated, real K=600,000). Cut 3-yr claims by $100,000.")
print("="*78)
IR, ICCR, K = 0.03036, 0.018290, 600000          # current-year Laundry rates
rem      = 12393155                               # annual remuneration
exp_rem  = 39087035                               # 3-yr experience rem (cached)
claims   = 761000                                 # 3-yr claims in window (cached)

p_before, (epr_b, _) = premium(rem, claims,          IR, ICCR, K, exp_rem)
p_after,  (epr_a, _) = premium(rem, claims - 100000, IR, ICCR, K, exp_rem)
dy = round(p_before - p_after, 2)
print(f"  premium @ claims={claims:,}      = ${p_before:,.2f}  (EPR {epr_b})")
print(f"  premium @ claims={claims-100000:,}  = ${p_after:,.2f}  (EPR {epr_a})")
print(f"  per-YEAR premium reduction          = ${dy:,.2f}")
print(f"  claim sits in window 3 yrs -> 3-YR  = ${dy*3:,.2f}")
print(f"  multiple over 3yr (relief / $100k)  = {dy*3/100000:.2f}x")
print(f"  closed-form check Z*(IR/ICCR)*100k  = ${rnd(IR*exp_rem/(IR*exp_rem+K),6)*(IR/ICCR)*100000:,.0f}")

print()
print("="*78)
print("PART 2 — LIVE 2025-26 (K=2,000,000), Laundry rates. Per $100k claims cut.")
print("="*78)
K = 2000000
print(f"  {'Wage roll':>12} | {'Z':>6} | {'per-year':>11} | {'3-year relief':>13} | {'3yr mult':>8} | {'total return*':>13}")
print("  " + "-"*78)
for wages in [1_000_000, 5_000_000, 10_000_000, 22_000_000, 50_000_000, 100_000_000]:
    exp = 3 * wages
    # high-claims employer (PI>1) so there is room to reduce; use claims = 1.5x industry-expected
    claims_w = 1.5 * ICCR * exp
    pb, _ = premium(wages, claims_w,          IR, ICCR, K, exp)
    pa, _ = premium(wages, claims_w - 100000,  IR, ICCR, K, exp)
    per_yr = round(pb - pa, 2)
    three  = round(per_yr * 3, 2)
    Z = rnd(IR*exp/(IR*exp+K), 6)
    total = 100000 + three          # the $100k cost itself + premium relief
    print(f"  ${wages/1e6:>9.0f}M | {Z:>6.3f} | ${per_yr:>9,.0f} | ${three:>11,.0f} | {three/100000:>6.2f}x | ${total:>11,.0f}")
print("  " + "-"*78)
print("  *total return = the $100k claim cost removed + 3-yr premium relief (per $100k cut)")
print()
print("  HONEST READ: premium relief per $100k cut runs ~$7k (tiny) to ~$136k (very large).")
print("  For Preventli's real client size ($20-50M), ~$80-115k premium relief + the $100k")
print("  itself = ~$180-215k total (~1.8-2.2x). NOT the 4.5-5x the old spec claimed.")

print()
print("="*78)
print("PART 3 — THE 40% HEADLINE (Paul's confirmed claim): an employer WITH 'decent")
print("costs' (PI>1). Preventli cuts claims cost 40%. K=2,000,000. $30M wage roll.")
print("="*78)
K = 2000000
wages = 30_000_000
exp = 3 * wages
ind_expected_3yr = ICCR * exp                       # industry-average 3-yr claims (PI=1)
for pi_start in [1.6, 2.0, 1.2]:
    claims_base = pi_start * ind_expected_3yr        # elevated ("decent costs")
    claims_mgd  = 0.6 * claims_base                  # 40% claims-cost reduction
    pb, (eb,_) = premium(wages, claims_base, IR, ICCR, K, exp)
    pm, (em,_) = premium(wages, claims_mgd,  IR, ICCR, K, exp)
    annual = round(pb - pm, 2)
    print(f"\n  starting PI={pi_start} (claims {pi_start}x industry):")
    print(f"    annual claims  ${claims_base/3:>12,.0f}  -> managed ${claims_mgd/3:>12,.0f}  (-40%)")
    print(f"    annual premium ${pb:>12,.2f} (EPR {eb}) -> ${pm:>12,.2f} (EPR {em})")
    print(f"    ANNUAL premium saving = ${annual:>12,.2f}   ({annual/pb*100:.1f}% of premium)")
    print(f"    3-YEAR premium saving = ${annual*3:>12,.2f}")
print()
print("  NOTE: the 40% is on CLAIMS COST. The % OFF PREMIUM is smaller and size-scaled")
print("  (Z) — only a very large, very high-claims employer approaches 40% off premium.")
print("  Headline must say '40% lower claims cost' (true) not '40% lower premium' (false).")
