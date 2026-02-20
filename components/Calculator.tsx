"use client";

import { useState, useEffect, useRef } from "react";

const industries = [
  { label: "Construction", value: "construction", multiplier: 1.3 },
  { label: "Healthcare", value: "healthcare", multiplier: 1.1 },
  { label: "Retail", value: "retail", multiplier: 1.0 },
  { label: "Hospitality", value: "hospitality", multiplier: 1.0 },
  { label: "Manufacturing", value: "manufacturing", multiplier: 1.2 },
  { label: "Other", value: "other", multiplier: 1.0 },
];

function calcSavings(
  employees: number,
  industry: string,
  premium: number,
  claims: number
) {
  if (!premium || premium <= 0) return null;

  // Base savings rate: 15-45% depending on claims history
  const claimsFactor = Math.min(claims, 10);
  const baseSavingsRate = 0.15 + (claimsFactor / 10) * 0.3; // 15% to 45%

  // Industry multiplier
  const ind = industries.find((i) => i.value === industry);
  const multiplier = ind?.multiplier ?? 1.0;

  const savings = premium * baseSavingsRate * multiplier;
  const newPremium = premium - savings;
  // Preventli cost (rough estimate based on employee count)
  const preventliCost =
    employees <= 20 ? 299 * 12 : employees <= 100 ? 599 * 12 : 1500 * 12;
  const roi = ((savings - preventliCost) / preventliCost) * 100;

  return {
    savings: Math.round(savings),
    newPremium: Math.round(newPremium),
    roi: Math.round(roi),
    preventliCost,
  };
}

export default function Calculator() {
  const [employees, setEmployees] = useState(50);
  const [industry, setIndustry] = useState("construction");
  const [premium, setPremium] = useState(25000);
  const [claims, setClaims] = useState(2);
  const ref = useRef<HTMLDivElement>(null);

  const result = calcSavings(employees, industry, premium, claims);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    const el = ref.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="calculator" className="py-20 bg-[#0A1628]">
      <div
        ref={ref}
        className="section-observe max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-14">
          <span className="text-[#00E676] text-sm font-semibold uppercase tracking-widest">
            Savings Calculator
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
            Estimate Your WorkCover Savings
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get an instant estimate of what Preventli could save your business
            in WorkCover premiums.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Inputs */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-8">
            {/* Employees slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-white font-semibold">
                  Number of Employees
                </label>
                <span className="text-[#00E676] font-bold text-xl">
                  {employees}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="500"
                value={employees}
                onChange={(e) => setEmployees(Number(e.target.value))}
                className="w-full"
                style={{
                  background: `linear-gradient(to right, #00E676 ${(employees / 500) * 100}%, #374151 ${(employees / 500) * 100}%)`,
                }}
              />
              <div className="flex justify-between text-gray-500 text-xs mt-1">
                <span>1</span>
                <span>500</span>
              </div>
            </div>

            {/* Industry */}
            <div>
              <label className="block text-white font-semibold mb-3">
                Industry
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00E676] transition-colors"
              >
                {industries.map((ind) => (
                  <option
                    key={ind.value}
                    value={ind.value}
                    className="bg-[#0A1628]"
                  >
                    {ind.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Current premium */}
            <div>
              <label className="block text-white font-semibold mb-3">
                Current Annual WorkCover Premium
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
                  $
                </span>
                <input
                  type="number"
                  value={premium}
                  onChange={(e) => setPremium(Number(e.target.value))}
                  min="0"
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-[#00E676] transition-colors"
                  placeholder="25000"
                />
              </div>
            </div>

            {/* Claims */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-white font-semibold">
                  Claims in Last 3 Years
                </label>
                <span className="text-[#00E676] font-bold text-xl">
                  {claims === 10 ? "10+" : claims}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={claims}
                onChange={(e) => setClaims(Number(e.target.value))}
                className="w-full"
                style={{
                  background: `linear-gradient(to right, #00E676 ${(claims / 10) * 100}%, #374151 ${(claims / 10) * 100}%)`,
                }}
              />
              <div className="flex justify-between text-gray-500 text-xs mt-1">
                <span>0</span>
                <span>10+</span>
              </div>
              {claims >= 3 && (
                <p className="text-amber-400 text-xs mt-2">
                  ⚠️ High claims history — significant savings potential
                </p>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {result ? (
              <>
                <div className="bg-gradient-to-br from-[#00E676]/20 to-[#00E676]/5 border border-[#00E676]/40 rounded-2xl p-8">
                  <div className="text-[#00E676] text-sm font-semibold uppercase tracking-wide mb-6">
                    Your Estimated Results
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="text-gray-400 text-sm mb-1">
                        Estimated Annual Savings
                      </div>
                      <div className="text-4xl font-bold text-white">
                        ${result.savings.toLocaleString()}
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                      <div className="text-gray-400 text-sm mb-1">
                        Projected New Premium
                      </div>
                      <div className="text-2xl font-bold text-white">
                        ${result.newPremium.toLocaleString()}
                        <span className="text-gray-400 text-base font-normal">
                          /yr
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                      <div className="text-gray-400 text-sm mb-1">
                        ROI with Preventli
                      </div>
                      <div
                        className={`text-2xl font-bold ${result.roi >= 0 ? "text-[#00E676]" : "text-white"}`}
                      >
                        {result.roi >= 0 ? "+" : ""}
                        {result.roi}%
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        vs Preventli plan cost of ~$
                        {result.preventliCost.toLocaleString()}/yr
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                  <p className="text-gray-300 text-sm mb-4">
                    This is a conservative estimate. Book a free audit to get
                    your personalised savings report.
                  </p>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 bg-[#00E676] text-[#0A1628] px-6 py-3 rounded-xl font-bold hover:bg-[#00C060] transition-all hover:scale-105 text-sm"
                  >
                    Get Your Personalised Report
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                <div className="text-4xl mb-4">💡</div>
                <p className="text-gray-400">
                  Enter your current premium above to see your potential
                  savings.
                </p>
              </div>
            )}

            {/* Disclaimer */}
            <p className="text-gray-600 text-xs px-2">
              * Estimates based on industry averages and historical Preventli
              client data. Actual savings may vary. Contact us for a detailed
              analysis specific to your business.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
