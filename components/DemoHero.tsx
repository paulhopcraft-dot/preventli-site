"use client";

import { useEffect, useRef } from "react";

export default function DemoHero() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setTimeout(() => el.classList.add("visible"), 100);
  }, []);

  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-[#0A1628] pt-32 pb-20">
      {/* Grid background */}
      <div className="absolute inset-0 hero-grid" />

      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, #00E676 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Content */}
      <div
        ref={ref}
        className="section-observe relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <div className="inline-flex items-center gap-2 bg-[#00E676]/10 border border-[#00E676]/30 rounded-full px-4 py-2 mb-8">
          <span className="w-2 h-2 bg-[#00E676] rounded-full animate-pulse" />
          <span className="text-[#00E676] text-sm font-medium">
            Free 30-minute guided walkthrough
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
          See Preventli
          <br />
          <span className="gradient-text">in action</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          A live walkthrough of your WorkCover workflow — case management,
          expert RTW plans, and pre-employment screening — using scenarios from
          your industry.
        </p>

        <a
          href="#contact"
          className="inline-flex items-center justify-center gap-2 bg-[#00E676] text-[#0A1628] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#00C060] transition-all hover:scale-105 shadow-lg shadow-[#00E676]/25"
        >
          Book your demo
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>

        <p className="text-sm text-gray-400 mt-6">
          No obligation. No credit card. Just a conversation about your cases.
        </p>
      </div>
    </section>
  );
}
