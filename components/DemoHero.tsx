"use client";

import { useEffect, useRef } from "react";

const doneOvernight = [
  { text: "Certificate reminder sent", who: "to M. Torres's GP — 6:02am" },
  { text: "RTW review drafted", who: "for S. Chen — ready to approve" },
  { text: "Compliance checks run", who: "12 active cases — all clear" },
];

const needsYou = [
  { text: "Approve RTW plan", who: "D. Walker — graduated return" },
  { text: "Call insurer", who: "premium review — 2:00pm" },
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 items-center">
          {/* Left: pitch */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#00E676]/10 border border-[#00E676]/30 rounded-full px-4 py-2 mb-7">
              <span className="w-2 h-2 bg-[#00E676] rounded-full animate-pulse" />
              <span className="text-[#00E676] text-sm font-medium">
                Free 30-minute guided walkthrough
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-white leading-[1.08] mb-6">
              Meet the assistant
              <br />
              that runs your cases
              <br />
              <span className="gradient-text">while you sleep</span>
            </h1>

            <p className="text-lg text-gray-300 max-w-md mb-8 leading-relaxed">
              Alex is your WorkCover twin — it chases certificates, drafts RTW
              plans and keeps you compliant overnight, then tells you exactly
              what&apos;s left for you. Book a live walkthrough with your own
              cases.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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

          {/* Right: digital-twin briefing mockup */}
          <div className="relative" aria-hidden="true">
            <div className="relative rounded-2xl border border-white/15 bg-[#0D1F3C] shadow-2xl shadow-black/40 overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-1.5 px-5 py-3.5 border-b border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <span className="ml-3 text-xs text-gray-500">app.preventli.ai — your daily briefing</span>
              </div>

              <div className="p-5">
                {/* Greeting */}
                <div className="mb-4">
                  <div className="text-white text-lg font-semibold">Hi Jane 👋</div>
                  <div className="text-xs text-gray-400 mt-0.5">Tuesday — here&apos;s what I did overnight</div>
                </div>

                {/* Alex message */}
                <div className="flex gap-3 mb-5">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#00E676] flex items-center justify-center text-[#0A1628] font-bold text-sm">A</div>
                  <div className="rounded-2xl rounded-tl-sm bg-[#00E676]/10 border border-[#00E676]/20 px-4 py-3">
                    <div className="text-[11px] uppercase tracking-wide text-[#00E676] font-semibold mb-1">Alex · your twin</div>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      I sent a certificate reminder to M. Torres&apos;s GP, drafted
                      S. Chen&apos;s RTW review, and ran today&apos;s compliance
                      checks. <span className="text-white font-medium">I can action 4 of the 6 things on today&apos;s list — just say go.</span>
                    </p>
                  </div>
                </div>

                {/* Done overnight */}
                <div className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold mb-2">Done overnight</div>
                <div className="space-y-2 mb-4">
                  {doneOvernight.map((item) => (
                    <div key={item.text} className="flex items-center gap-3 rounded-lg bg-white/[0.04] border border-white/[0.07] px-3.5 py-2.5">
                      <span className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#00E676]/15">
                        <svg width="12" height="12" fill="none" stroke="#00E676" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm text-gray-200 font-medium leading-tight">{item.text}</div>
                        <div className="text-[11px] text-gray-500 truncate">{item.who}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* RTW timeline graph */}
                <div className="rounded-lg bg-white/[0.04] border border-white/[0.07] px-3.5 py-3 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-300 font-medium">RTW progress — M. Torres</span>
                    <span className="text-[11px] text-[#00E676] font-semibold">Week 3 of 6 · on track</span>
                  </div>
                  <svg viewBox="0 0 260 56" className="w-full h-12" preserveAspectRatio="none">
                    <line x1="0" y1="55" x2="260" y2="55" stroke="rgba(255,255,255,0.08)" />
                    <polyline points="0,48 52,44 104,34 156,22 208,14 260,6" fill="none" stroke="#00E676" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {[[0,48],[52,44],[104,34],[156,22],[208,14],[260,6]].map(([x,y],i)=>(
                      <circle key={i} cx={x} cy={y} r={i===2?"4":"3"} fill={i===2?"#00E676":"#0D1F3C"} stroke="#00E676" strokeWidth="2" />
                    ))}
                  </svg>
                  <div className="flex justify-between text-[9px] text-gray-500 mt-0.5">
                    <span>Wk 1</span><span>Wk 2</span><span>Wk 3</span><span>Wk 4</span><span>Wk 5</span><span>Full duties</span>
                  </div>
                </div>

                {/* Needs you today */}
                <div className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold mb-2">Needs you today</div>
                <div className="space-y-2">
                  {needsYou.map((item) => (
                    <div key={item.text} className="flex items-center justify-between gap-3 rounded-lg bg-[#FF8F00]/[0.07] border border-[#FF8F00]/20 px-3.5 py-2.5">
                      <div className="min-w-0">
                        <div className="text-sm text-gray-100 font-medium leading-tight">{item.text}</div>
                        <div className="text-[11px] text-gray-400 truncate">{item.who}</div>
                      </div>
                      <span className="flex-shrink-0 text-[10px] font-semibold text-[#FFB84D] border border-[#FF8F00]/30 rounded-full px-2.5 py-1">You</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating twin chip */}
            <div className="animate-float absolute -bottom-5 -left-4 sm:-left-8 flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-xl">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00E676] text-[#0A1628] font-bold text-sm">A</span>
              <div>
                <div className="text-xs font-semibold text-[#0A1628]">Twin mode on</div>
                <div className="text-[11px] text-gray-500">Alex can action 4 of 6 today</div>
              </div>
            </div>
          </div>
        </div>

        {/* Proof band */}
        <div className="mt-20 lg:mt-24 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10 border-y border-white/10">
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
