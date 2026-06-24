"use client";

import { useEffect, useRef } from "react";

const journey = [
  {
    minutes: "0–5",
    title: "Your case dashboard",
    description:
      "Every active case on one screen — compliance status, certificate expiries, and what needs attention today. The Tuesday-morning view your team would start with.",
  },
  {
    minutes: "5–15",
    title: "A real case, end to end",
    description:
      "We follow an injury from first report to return to work: certificate lands, restrictions extracted, duties matched, RTW plan built against the medical evidence — GP-ready.",
  },
  {
    minutes: "15–25",
    title: "Your scenarios",
    description:
      "Bring a current case or a premium problem. We run your situation through the platform live — your industry, your duties, your insurer.",
  },
  {
    minutes: "25–30",
    title: "Pricing & next steps",
    description:
      "Which plan fits, what onboarding looks like, and how your existing cases come across. No pressure — you'll know either way by the end of the call.",
  },
];

export default function DemoWalkthrough() {
  const ref = useRef<HTMLDivElement>(null);

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
    <>
      {/* 30-minute journey */}
      <section className="py-20 bg-white">
        <div
          ref={ref}
          className="section-observe max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-14">
            <span className="text-[#00E676] text-sm font-semibold uppercase tracking-widest">
              What you&apos;ll see
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1628] mt-3 mb-4">
              Your 30 minutes, minute by minute
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              No slide deck. The live platform, walked at your pace.
            </p>
          </div>

          <div className="relative max-w-3xl mx-auto">
            {/* Timeline spine */}
            <div className="absolute left-[27px] sm:left-[31px] top-2 bottom-2 w-px bg-gray-200" aria-hidden="true" />

            <ol className="space-y-10">
              {journey.map((step, i) => (
                <li key={step.minutes} className="relative flex gap-6 sm:gap-8">
                  <div className="relative z-10 flex-shrink-0">
                    <div className="flex h-14 w-14 sm:h-16 sm:w-16 flex-col items-center justify-center rounded-2xl bg-[#0A1628] text-center shadow-lg">
                      <span className="text-[#00E676] text-sm sm:text-base font-bold leading-none">
                        {step.minutes}
                      </span>
                      <span className="text-[9px] text-gray-400 mt-1">min</span>
                    </div>
                  </div>
                  <div className="pt-1">
                    <h3 className="text-lg sm:text-xl font-bold text-[#0A1628] mb-2">
                      <span className="text-gray-300 mr-2">{String(i + 1).padStart(2, "0")}</span>
                      {step.title}
                    </h3>
                    <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Value anchor */}
      <section className="py-20 bg-[#0A1628] relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-50" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[#00E676] text-sm font-semibold uppercase tracking-widest">
            The maths
          </span>
          <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            <div>
              <div className="text-5xl sm:text-6xl font-bold text-white">$52,000</div>
              <div className="text-gray-400 mt-2 text-sm">average cost of one WorkCover claim</div>
            </div>
            <div className="text-3xl text-[#00E676] font-bold rotate-90 md:rotate-0" aria-hidden="true">
              vs
            </div>
            <div>
              <div className="text-5xl sm:text-6xl font-bold text-[#00E676]">$899<span className="text-2xl text-gray-400 font-semibold">/mo</span></div>
              <div className="text-gray-400 mt-2 text-sm">Preventli Professional — unlimited cases</div>
            </div>
          </div>
          <p className="mt-10 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            One prevented claim pays for more than{" "}
            <span className="text-white font-semibold">four years</span> of
            Preventli. We&apos;ll show you where your next claim is coming from.
          </p>
        </div>
      </section>
    </>
  );
}
