"use client";

import { useMemo, useState } from "react";
import {
  claimImpact,
  type ComputePremiumResult,
  type SavingsScenarioResult,
  type PerformanceResult,
} from "@/lib/premium/engine";

// Result panel (spec §6): estimated premium (+GST), the size-aware savings
// block, the interactive "true cost of a claim" panel with the 30% capping
// indicator (§4b), a "how this is worked out" expander, the email-me-a-copy
// CTA, and the canonical disclaimer + 40% asterisk as fine print.
//
// COPY RULES (§11): headline says "lower CLAIMS COST", never "lower premium";
// 40% is a claims-cost reduction; small employers see the size-aware guard and
// NO saving figure. ALL maths comes from the engine — no recalculation here.

type Props = {
  remuneration: number;
  wicCode: string;
  claimsCost: number;
  priorYearPremium?: number;
  premium: ComputePremiumResult;
  savings: SavingsScenarioResult;
  /** Present when they entered their actual premium — their real rating vs industry. */
  performance?: PerformanceResult | null;
};

/** Whole-dollar AUD, e.g. "$368,275". */
function money(n: number): string {
  return n.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  });
}

/** Maximum WorkCover VIC non-economic loss (pain & suffering) cap — 2025-26. */
const DEFAULT_CLAIM = 680_000;

const DISCLAIMER =
  "For illustration purposes only. This is an indicative estimate based on " +
  "gazetted 2025-26 industry rates and a simplified single-year calculation — " +
  "it is not an official WorkSafe premium quote. Your actual premium is " +
  "determined by WorkSafe Victoria and depends on your full claims history, " +
  "remuneration and workplace details.";

const ASTERISK_40 =
  "Up to 40% lower claims cost — based on employers who already carry " +
  "meaningful claims costs (a claims history above their industry rate). The " +
  "further above the industry benchmark you sit, the greater the potential " +
  "saving; lower claims cost then flows through to a lower premium (typically " +
  "a smaller percentage, scaled by your size). Employers already at or below " +
  "their industry rate, and small employers on the flat rate, will see less. " +
  "Enter your figures for your own estimate.";

export default function ResultPanel({
  remuneration,
  wicCode,
  claimsCost,
  priorYearPremium,
  premium,
  savings,
  performance,
}: Props) {
  const [claimInput, setClaimInput] = useState(DEFAULT_CLAIM.toLocaleString("en-AU"));
  const [howOpen, setHowOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [emailState, setEmailState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const claimCost = Number(claimInput.replace(/[^0-9.]/g, "")) || 0;

  // Interactive claim impact (§4b) — recomputed live from the engine.
  const impact = useMemo(
    () =>
      claimImpact({
        remuneration,
        wicCode,
        claimCost,
        priorYearPremium,
      }),
    [remuneration, wicCode, claimCost, priorYearPremium],
  );

  async function sendCopy(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailState("error");
      return;
    }
    setEmailState("loading");
    try {
      const res = await fetch("/api/premium-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          wages: remuneration,
          wicCode,
          claimsCost,
          premium: premium.premium,
          saving: savings.showSaving ? savings.annualSaving : 0,
          // Drive the comprehensive PDF report: real rating + claim impact.
          currentPremium: priorYearPremium ?? null,
          claimCost,
        }),
      });
      setEmailState(res.ok ? "success" : "error");
    } catch {
      setEmailState("error");
    }
  }

  return (
    <div className="space-y-6">
      {performance ? (
        /* ---- Performance rating (when they entered their actual premium) ---- */
        <div className="rounded-2xl bg-[#0A1628] p-6 sm:p-8 text-white">
          <div className="text-xs uppercase tracking-widest text-[#00E676] font-semibold">
            Your performance rating
          </div>
          <div className="mt-2 flex items-baseline gap-3 flex-wrap">
            <span className="text-4xl sm:text-5xl font-bold">
              {performance.epr.toFixed(2)}
            </span>
            <span
              className={`text-sm font-semibold ${
                performance.betterThanIndustry
                  ? "text-[#00E676]"
                  : "text-amber-300"
              }`}
            >
              {performance.betterThanIndustry
                ? `${Math.round(Math.abs(performance.percentVsIndustry))}% below your industry rate`
                : `${Math.round(performance.percentVsIndustry)}% above your industry rate`}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10 text-sm text-gray-300">
            {performance.betterThanIndustry ? (
              <>
                A strong record — you pay about{" "}
                <span className="font-semibold text-[#00E676]">
                  {money(Math.abs(performance.ratingImpact))}/year less
                </span>{" "}
                than an average employer your size (who&apos;d pay{" "}
                {money(performance.industryRatePremium)} at the industry rate).
              </>
            ) : (
              <>
                Your claims history costs you about{" "}
                <span className="font-semibold text-white">
                  {money(performance.ratingImpact)}/year more
                </span>{" "}
                than an average employer your size (who&apos;d pay{" "}
                {money(performance.industryRatePremium)} at the industry rate) —
                and that gap is exactly what claims management targets.
              </>
            )}
          </div>
        </div>
      ) : (
        /* ---- Estimated premium (when no premium entered) ---- */
        <div className="rounded-2xl bg-[#0A1628] p-6 sm:p-8 text-white">
          <div className="text-xs uppercase tracking-widest text-[#00E676] font-semibold">
            Estimated annual premium
          </div>
          <div className="mt-2 text-4xl sm:text-5xl font-bold">
            {money(premium.premium)}
          </div>
          <div className="mt-1 text-sm text-gray-300">
            + GST {money(premium.gst)} ={" "}
            <span className="font-semibold text-white">
              {money(premium.premium + premium.gst)}
            </span>{" "}
            inc. GST
          </div>
        </div>
      )}

      {/* ---- Savings block (THE HIGHLIGHT) ---- */}
      <div className="rounded-2xl border border-[#00E676]/30 bg-[#00E676]/5 p-6 sm:p-8">
        <h3 className="text-lg font-bold text-[#0A1628]">
          Lower your claims cost → lower your premium
        </h3>

        {savings.showSaving ? (
          <>
            <p className="mt-3 text-sm text-gray-700">
              With Preventli managing your claims, your estimated premium drops
              from{" "}
              <span className="font-semibold">
                {money(savings.baselinePremium)}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-[#0A1628]">
                {money(savings.managedPremium)}
              </span>{" "}
              — saving{" "}
              <span className="font-bold text-[#0A1628]">
                {money(savings.annualSaving)}/year
              </span>{" "}
              (~{money(savings.threeYearSaving)} over 3 years).
            </p>
            <p className="mt-3 text-sm text-gray-600">
              We don&apos;t cut your premium directly — we cut your{" "}
              <span className="font-semibold">claims cost</span> (up to 40%
              <sup>*</sup> for employers who already carry real claims costs),
              and lower claims flow straight into a lower premium.
            </p>
          </>
        ) : (
          // Size-aware honesty guard (§4 / §11): no saving figure for a small
          // (flat-rate) employer — show the engine's message instead.
          <p className="mt-3 text-sm text-gray-700">{savings.message}</p>
        )}
      </div>

      {/* ---- Interactive "true cost of a claim" (§4b) ---- */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-[#0A1628]">
          ⚠️ What one serious claim could cost you
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          An un-managed claim raises your claims experience — and your premium —
          for about three years.
        </p>

        <label className="block text-sm font-semibold text-gray-700 mt-4 mb-1.5">
          Claim cost
        </label>
        <div className="relative max-w-xs">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            $
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={claimInput}
            onChange={(e) => {
              const digits = e.target.value.replace(/[^0-9]/g, "");
              setClaimInput(
                digits ? Number(digits).toLocaleString("en-AU") : "",
              );
            }}
            className="w-full rounded-xl pl-7 pr-4 py-3 text-sm border border-gray-200 bg-white focus:outline-none focus:border-[#00E676]"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          Default is $680,000 — WorkCover VIC&apos;s non-economic loss cap for a
          serious claim where a worker is off work for an extended period.{" "}
          {claimCost !== DEFAULT_CLAIM && (
            <button
              type="button"
              onClick={() =>
                setClaimInput(DEFAULT_CLAIM.toLocaleString("en-AU"))
              }
              className="text-[#0A7A45] font-semibold"
            >
              Reset to maximum
            </button>
          )}
        </p>

        {impact.showImpact ? (
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Premium before the claim</span>
              <span className="font-semibold text-[#0A1628]">
                {money(impact.baselinePremium)}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Next-year premium</span>
              <span className="font-semibold text-[#0A1628]">
                {money(impact.newPremium)}
              </span>
            </div>
            {impact.capped && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800">
                Capping applied — WorkSafe limits the annual premium-rate rise
                to 30%. Without the cap it would be{" "}
                <span className="font-semibold">
                  {money(impact.uncappedPremium)}
                </span>
                ; the remainder carries into the following years.
              </div>
            )}
            <div className="flex justify-between pt-1">
              <span className="text-gray-500">
                Total premium impact over ~3 years
              </span>
              <span className="font-bold text-red-600">
                +{money(impact.threeYearImpact)}
              </span>
            </div>
            <p className="text-xs text-gray-400 pt-1">
              {priorYearPremium
                ? "Capped against the prior-year premium you entered — a true value."
                : "Capped against our estimated premium — an estimate. Enter last year's premium for a true value."}
            </p>
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-700">{impact.message}</p>
        )}
      </div>

      {/* ---- How this is worked out ---- */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <button
          type="button"
          onClick={() => setHowOpen((v) => !v)}
          className="flex w-full items-center justify-between px-6 py-4 text-left"
        >
          <span className="text-sm font-semibold text-[#0A1628]">
            How this is worked out
          </span>
          <span className="text-[#0A7A45] text-lg leading-none">
            {howOpen ? "−" : "+"}
          </span>
        </button>
        {howOpen && (
          <div className="px-6 pb-5 text-sm text-gray-600 space-y-2">
            <p>
              <span className="font-semibold text-[#0A1628]">
                Industry rate.
              </span>{" "}
              Every WorkSafe classification has a gazetted base rate. Your wages
              × that rate is the starting point.
            </p>
            <p>
              <span className="font-semibold text-[#0A1628]">
                Performance rating.
              </span>{" "}
              WorkSafe compares your claims history to your industry average. A
              better-than-average record lowers your rate; a worse one raises
              it.
            </p>
            <p>
              <span className="font-semibold text-[#0A1628]">
                Claims impact.
              </span>{" "}
              The bigger your business, the more your own claims experience
              moves your premium — which is exactly why managing claims pays
              off.
            </p>
          </div>
        )}
      </div>

      {/* ---- Email me a copy ---- */}
      <div className="rounded-2xl bg-[#0A1628] p-6 sm:p-8 text-white">
        {emailState === "success" ? (
          <p className="text-sm">
            On its way — check your inbox for your branded WorkCover estimate.
          </p>
        ) : (
          <form onSubmit={sendCopy}>
            <h3 className="text-lg font-bold">Email me a copy</h3>
            <p className="mt-1 text-sm text-gray-300">
              Get a branded PDF of this estimate, no obligation.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailState === "error") setEmailState("idle");
                }}
                placeholder="you@company.com.au"
                className="flex-1 rounded-xl px-4 py-3 text-sm text-[#0A1628] bg-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={emailState === "loading"}
                className="rounded-xl bg-[#00E676] text-[#0A1628] font-bold text-sm px-6 py-3 hover:bg-[#00C060] transition-colors disabled:opacity-70"
              >
                {emailState === "loading" ? "Sending..." : "Email me a copy"}
              </button>
            </div>
            {emailState === "error" && (
              <p className="mt-2 text-xs text-red-300">
                Please enter a valid email and try again.
              </p>
            )}
          </form>
        )}
      </div>

      {/* ---- Fine print: 40% asterisk + canonical disclaimer ---- */}
      <div className="space-y-3 text-xs text-gray-400 leading-relaxed">
        <p>
          <sup>*</sup> {ASTERISK_40}
        </p>
        <p>{DISCLAIMER}</p>
      </div>
    </div>
  );
}
