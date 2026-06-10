"use client";

import { useEffect, useRef } from "react";

const mockCases = [
  { name: "M. Torres — warehouse", status: "On track", tone: "green", detail: "RTW week 3 of 6" },
  { name: "S. Chen — admin", status: "Cert expiring", tone: "amber", detail: "3 days left" },
  { name: "D. Walker — driver", status: "Action needed", tone: "red", detail: "No certificate" },
];

export default function DemoHero() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setTimeout(() => el.classList.add("visible"), 100);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#0A1628] pt-28 pb-16 lg:pt-36 lg:pb-24">
      <div className="absolute inset-0 hero-grid" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #00E676 0%, transparent 70%)" }}
      />

      <div
        ref={ref}
        className="section-observe relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: pitch */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#00E676]/10 border border-[#00E676]/30 rounded-full px-4 py-2 mb-7">
              <span className="w-2 h-2 bg-[#00E676] rounded-full animate-pulse" />
              <span className="text-[#00E676] text-sm font-medium">
                Free 30-minute guided walkthrough
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-white leading-[1.08] mb-6">
              Watch your WorkCover
              <br />
              chaos become
              <br />
              <span className="gradient-text">one clear screen</span>
            </h1>

            <p className="text-lg text-gray-300 max-w-md mb-8 leading-relaxed">
              Bring a real case. We&apos;ll walk it through Preventli live —
              certificates tracked, RTW plan built, compliance handled — using
              scenarios from your industry.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-3">
              <a
                href="#book"
                className="inline-flex items-center justify-center gap-2 bg-[#00E676] text-[#0A1628] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#00C060] transition-all hover:scale-105 shadow-lg shadow-[#00E676]/25"
              >
                Book your demo
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <span className="text-sm text-gray-400">
                No obligation. No credit card.
              </span>
            </div>
          </div>

          {/* Right: product mockup */}
          <div className="relative" aria-hidden="true">
            <div
              className="relative rounded-2xl border border-white/15 bg-[#0D1F3C] shadow-2xl shadow-black/40"
              style={{ transform: "perspective(1200px) rotateY(-6deg) rotateX(2deg)" }}
            >
              {/* Window chrome */}
              <div className="flex items-center gap-1.5 px-5 py-3.5 border-b border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <span className="ml-3 text-xs text-gray-500">app.preventli.ai — case dashboard</span>
              </div>

              <div className="p-5">
                {/* Header row with compliance ring */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-white font-semibold">Active cases</div>
                    <div className="text-xs text-gray-400 mt-0.5">Tuesday briefing — 2 need attention</div>
                  </div>
                  <div className="relative w-16 h-16">
                    <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                      <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3.5" />
                      <circle cx="18" cy="18" r="15.5" fill="none" stroke="#00E676" strokeWidth="3.5"
                        strokeDasharray="97.4" strokeDashoffset="7.8" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[#00E676] text-sm font-bold leading-none">92%</span>
                      <span className="text-[8px] text-gray-400 mt-0.5">compliant</span>
                    </div>
                  </div>
                </div>

                {/* Case rows */}
                <div className="space-y-2.5">
                  {mockCases.map((c) => (
                    <div key={c.name} className="flex items-center justify-between rounded-lg bg-white/[0.04] border border-white/[0.07] px-4 py-3">
                      <div>
                        <div className="text-sm text-gray-200 font-medium">{c.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{c.detail}</div>
                      </div>
                      <span
                        className={
                          c.tone === "green"
                            ? "text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#00E676]/15 text-[#00E676]"
                            : c.tone === "amber"
                            ? "text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#FF8F00]/15 text-[#FFB84D]"
                            : "text-[11px] font-semibold px-2.5 py-1 rounded-full bg-red-500/15 text-red-400"
                        }
                      >
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating toast */}
            <div className="animate-float absolute -bottom-5 -left-4 sm:-left-8 flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-xl">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00E676]/15">
                <svg width="16" height="16" fill="none" stroke="#00C060" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <div>
                <div className="text-xs font-semibold text-[#0A1628]">Certificate chase sent</div>
                <div className="text-[11px] text-gray-500">S. Chen — expires in 3 days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Proof band */}
        <div className="mt-16 lg:mt-20 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10 border-y border-white/10">
          {[
            ["30 years", "of WorkCover expertise"],
            ["3,000+", "cases managed"],
            ["100%", "WorkSafe Victoria compliant"],
          ].map(([stat, label]) => (
            <div key={label} className="flex items-baseline justify-center gap-2 py-5">
              <span className="text-2xl font-bold text-[#00E676]">{stat}</span>
              <span className="text-sm text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
