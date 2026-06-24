"use client";

import { useMemo, useState } from "react";
import IndustryPicker from "./IndustryPicker";
import ResultPanel from "./ResultPanel";
import {
  computePremium,
  savingsScenario,
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
  const [claimsExpanded, setClaimsExpanded] = useState(false);
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

  const result = useMemo(() => {
    if (!hasInputs) return null;
    return {
      premium: computePremium({ remuneration, wicCode, claimsCost }),
      savings: savingsScenario({ remuneration, wicCode, claimsCost }),
    };
  }, [hasInputs, remuneration, wicCode, claimsCost]);

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

        {/* Claims cost — collapsed by default, pre-filled with ICCR × wages. */}
        <div>
          <button
            type="button"
            onClick={() => setClaimsExpanded((v) => !v)}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="text-sm font-semibold text-gray-700">
              Annual claims cost
            </span>
            <span className="text-xs text-[#00E676] font-semibold">
              {claimsExpanded ? "Hide" : "Adjust"}
            </span>
          </button>
          {!claimsExpanded ? (
            <p className="text-xs text-gray-400 mt-1.5">
              We&apos;ve estimated this from your industry — tap{" "}
              <span className="font-semibold">Adjust</span> if you know your
              figure.
            </p>
          ) : (
            <div className="mt-2">
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
                  placeholder="0"
                  className={`${inputClass} pl-7`}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Pre-filled with your industry average. Edit if you know your
                actual annual claims cost.
                {claimsOverride !== null && (
                  <button
                    type="button"
                    onClick={() => setClaimsOverride(null)}
                    className="ml-1 text-[#00E676] font-semibold"
                  >
                    Reset to estimate
                  </button>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Optional prior-year premium — upgrades capping to a true value. */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Last year&apos;s premium{" "}
            <span className="font-normal text-gray-400">(optional)</span>
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
              placeholder="Leave blank for an estimate"
              className={`${inputClass} pl-7`}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            Enter it to get a true capped claim-impact figure instead of an
            estimate.
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
