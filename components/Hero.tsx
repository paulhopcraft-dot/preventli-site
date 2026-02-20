"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setTimeout(() => el.classList.add("visible"), 100);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A1628]">
      {/* Grid background */}
      <div className="absolute inset-0 hero-grid" />

      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, #00E676 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Content */}
      <div
        ref={ref}
        className="section-observe relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#00E676]/10 border border-[#00E676]/30 rounded-full px-4 py-2 mb-8">
          <span className="w-2 h-2 bg-[#00E676] rounded-full animate-pulse" />
          <span className="text-[#00E676] text-sm font-medium">
            Trusted by 200+ Australian businesses
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
          Stop WorkCover Claims
          <br />
          <span className="gradient-text">Before They Happen</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          Preventli helps Australian businesses reduce workplace injuries, manage
          compliance, and cut WorkCover premium costs &mdash; proactively.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a
            href="#calculator"
            className="inline-flex items-center justify-center gap-2 bg-[#00E676] text-[#0A1628] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#00C060] transition-all hover:scale-105 shadow-lg shadow-[#00E676]/25"
          >
            Get a Free Quote
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
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:border-[#00E676] hover:text-[#00E676] transition-all"
          >
            Book a Demo
          </a>
        </div>

        {/* Floating stat cards */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="animate-float bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 text-center">
            <div className="text-3xl font-bold text-[#00E676]">47%</div>
            <div className="text-sm text-gray-300 mt-1">Avg premium reduction</div>
          </div>
          <div className="animate-float-delay bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 text-center">
            <div className="text-3xl font-bold text-[#00E676]">200+</div>
            <div className="text-sm text-gray-300 mt-1">Businesses protected</div>
          </div>
          <div className="animate-float-delay2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 text-center">
            <div className="text-3xl font-bold text-[#00E676]">98%</div>
            <div className="text-sm text-gray-300 mt-1">Compliance rate</div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-5 h-8 border border-gray-600 rounded-full flex items-start justify-center p-1">
            <div
              className="w-1.5 h-1.5 bg-[#00E676] rounded-full animate-bounce"
              style={{ animationDuration: "1.5s" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
