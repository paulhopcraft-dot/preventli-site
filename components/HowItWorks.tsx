"use client";

import { useEffect, useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Audit",
    subtitle: "Know your risk",
    description:
      "We conduct a comprehensive assessment of your workplace risk profile, existing policies, incident history, and WorkCover premium structure. You get a clear picture of where you stand and what's costing you.",
    icon: (
      <svg
        width="28"
        height="28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z"
        />
      </svg>
    ),
    highlights: ["Risk profile assessment", "Premium audit", "Gap analysis"],
  },
  {
    number: "02",
    title: "Protect",
    subtitle: "Build the shield",
    description:
      "We implement injury prevention systems, compliance frameworks, and safety management tools tailored to your industry. Your team gets trained, your documentation gets sorted, and your risk drops.",
    icon: (
      <svg
        width="28"
        height="28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
    highlights: [
      "Prevention programs",
      "Compliance systems",
      "Staff training",
    ],
  },
  {
    number: "03",
    title: "Claim",
    subtitle: "We've got you covered",
    description:
      "If an incident does happen, we manage everything — from initial response to return-to-work coordination and WorkCover liaison. Minimise costs, protect your premium rating, and get your team back on their feet.",
    icon: (
      <svg
        width="28"
        height="28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
        />
      </svg>
    ),
    highlights: [
      "Incident management",
      "Return-to-work",
      "Premium protection",
    ],
  },
];

export default function HowItWorks() {
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
    <section id="how-it-works" className="py-20 bg-[#0A1628]">
      <div
        ref={ref}
        className="section-observe max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-16">
          <span className="text-[#00E676] text-sm font-semibold uppercase tracking-widest">
            Our Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
            How Preventli Works
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A proven three-step system that transforms your WorkCover situation
            from reactive to proactive.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-[72px] left-[calc(16.67%+32px)] right-[calc(16.67%+32px)] h-0.5 bg-gradient-to-r from-[#00E676]/0 via-[#00E676]/40 to-[#00E676]/0" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center lg:text-left">
                {/* Number badge */}
                <div className="flex justify-center lg:justify-start mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-[#00E676]/10 border border-[#00E676]/30 flex items-center justify-center text-[#00E676]">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#00E676] rounded-full flex items-center justify-center">
                      <span className="text-[#0A1628] text-xs font-bold">
                        {i + 1}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-[#00E676]/40 text-sm font-mono mb-2">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {step.title}
                </h3>
                <div className="text-[#00E676] text-sm font-medium mb-4">
                  {step.subtitle}
                </div>
                <p className="text-gray-400 leading-relaxed mb-6">
                  {step.description}
                </p>

                <ul className="space-y-2">
                  {step.highlights.map((h, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2 justify-center lg:justify-start"
                    >
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        stroke="#00E676"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="text-gray-300 text-sm">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
