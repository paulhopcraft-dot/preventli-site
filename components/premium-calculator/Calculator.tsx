"use client";

import { useMemo, useState } from "react";
import IndustryPicker from "./IndustryPicker";
import ResultPanel from "./ResultPanel";
import {
  computePremium,
  savingsScenario,
  savingsFromPremium,
  performanceFromPremium,
  lookupIndustry,
} from "@/lib/premium/engine";

// Single-screen, live-updating WorkCover Victoria premium calculator (spec §6).
// Owns all input state; ALL maths comes from lib/premium/engine.ts — this
// component never reimplements a formula, it only calls the deterministic engine.

/** "$1,234,000" → 1234000. */
function parseDollars(s: string): number {
  const n = Number(s.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/** Live thousands-separator formatting for a dollar text input. */
function formatThousands(s: string): string {
  const digits = s.replace(/[^0-9]/g, "");
  return digits ? Number(digits).toLocaleString("en-AU") : "";
}

export default function Calculator() {
  const [wagesInput, setWagesInput] = useState("");
  const [wicCode, setWicCode] = useState("");
  // null = follow the industry default; a string = user override.
  const [claimsOverride, setClaimsOverride] = useState<string | null>(null);
  const [priorInput, setPriorInput] = useState("");

  const remuneration = parseDollars(wagesInput);
  const hasInputs = remuneration > 0 && wicCode !== "";

  const industry = useMemo(
    () => (wicCode ? lookupIndustry(wicCode) : null),
    [wicCode],
  );

  // Claims cost defaults to industry-expected (ICCR × wages); user can adjust.
  const defaultClaims = industry ? Math.round(industry.iccr * remuneration) : 0;
  const claimsCost =
    claimsOverride !== null ? parseDollars(claimsOverride) : defaultClaims;
  const priorYearPremium = priorInput ? parseDollars(priorInput) : undefined;

  // When they tell us their actual premium we back out their real performance
  // rating (EPR = premium ÷ (wages × IR)) — more accurate than a claims estimate,
  // and it lets us show them where they sit vs their industry. Otherwise we
  // estimate from the (industry-default) claims cost.
  const hasPremium = priorYearPremium !== undefined && priorYearPremium > 0;

  const result = useMemo(() => {
    if (!hasInputs) return null;
    const premium = computePremium({ remuneration, wicCode, claimsCost });
    const performance =
      hasPremium && priorYearPremium
        ? performanceFromPremium({
            remuneration,
            wicCode,
            currentPremium: priorYearPremium,
          })
        : null;
    const savings =
      hasPremium && priorYearPremium
        ? savingsFromPremium({
            remuneration,
            wicCode,
            currentPremium: priorYearPremium,
          })
        : savingsScenario({ remuneration, wicCode, claimsCost });
    return { premium, savings, performance };
  }, [hasInputs, remuneration, wicCode, claimsCost, hasPremium, priorYearPremium]);

  const inputClass =
    "w-full rounded-xl px-4 py-3 text-sm border border-gray-200 bg-white transition-colors focus:outline-none focus:border-[#00E676]";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* ---- Inputs ---- */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Annual wages <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              $
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={wagesInput}
              onChange={(e) => setWagesInput(formatThousands(e.target.value))}
              placeholder="2,500,000"
              className={`${inputClass} pl-7`}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            Total gross wages + superannuation for the year.
          </p>
        </div>

        <IndustryPicker value={wicCode} onChange={setWicCode} />

        {/* Claims cost — always visible, pre-filled with industry average. */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Annual claims cost
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              $
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={
                claimsOverride !== null
                  ? claimsOverride
                  : defaultClaims
                    ? formatThousands(String(defaultClaims))
                    : ""
              }
              onChange={(e) =>
                setClaimsOverride(formatThousands(e.target.value))
              }
              placeholder={
                wicCode && remuneration > 0
                  ? "Calculating…"
                  : "Enter wages + industry first"
              }
              className={`${inputClass} pl-7`}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            {claimsOverride === null
              ? "Pre-filled at your industry average — what you'd pay if performing exactly at par. Edit if you know your actual figure."
              : "Using your figure."}
            {claimsOverride !== null && (
              <button
                type="button"
                onClick={() => setClaimsOverride(null)}
                className="ml-1 text-[#0A7A45] font-semibold"
              >
                Reset to industry average
              </button>
            )}
          </p>
        </div>

        {/* Optional current premium — reveals their real performance rating
            (EPR) and upgrades the claim-impact capping to a true value. */}
        <div className="rounded-xl border border-[#00E676]/40 bg-[#00E676]/5 p-4">
          <label className="block text-sm font-semibold text-[#0A1628] mb-1.5">
            Your current annual premium{" "}
            <span className="font-normal text-gray-500">(optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              $
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={priorInput}
              onChange={(e) => setPriorInput(formatThousands(e.target.value))}
              placeholder="Before GST, from your WorkSafe notice"
              className={`${inputClass} pl-7`}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1.5">
            Know it? Enter it and we&apos;ll show your{" "}
            <span className="font-semibold text-[#0A7A45]">
              performance rating
            </span>{" "}
            — exactly how you compare to your industry — plus a true claim-impact
            figure.
          </p>
        </div>
      </div>

      {/* ---- Result ---- */}
      {result ? (
        <ResultPanel
          remuneration={remuneration}
          wicCode={wicCode}
          claimsCost={claimsCost}
          priorYearPremium={priorYearPremium}
          premium={result.premium}
          savings={result.savings}
          performance={result.performance}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-[#F8F9FA] p-8 text-center text-sm text-gray-400 flex items-center justify-center min-h-[20rem]">
          Enter your annual wages and industry to see your estimated WorkCover
          premium.
        </div>
      )}
    </div>
  );
}
