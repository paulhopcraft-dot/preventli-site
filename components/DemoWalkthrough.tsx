"use client";

import { useEffect, useRef } from "react";

const walkthrough = [
  {
    title: "Your case dashboard",
    description:
      "Every active WorkCover case in one view — status, compliance indicators, and what needs attention today.",
    icon: (
      <svg width="22" height="22" fill="none" stroke="#00E676" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  {
    title: "A real case, end to end",
    description:
      "Follow an injury from first report to return to work — certificates tracked, deadlines flagged, every step compliant.",
    icon: (
      <svg width="22" height="22" fill="none" stroke="#00E676" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
  {
    title: "Expert RTW plans",
    description:
      "Watch a return-to-work plan built against real medical restrictions — duties matched, hours scheduled, GP-ready.",
    icon: (
      <svg width="22" height="22" fill="none" stroke="#00E676" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M9 16l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Pre-employment screening",
    description:
      "Send a health check before day one — see how candidate risk surfaces before it becomes a claim.",
    icon: (
      <svg width="22" height="22" fill="none" stroke="#00E676" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M16 11l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Compliance, automatically",
    description:
      "WorkSafe obligations tracked per case with a full audit trail — see exactly what your insurer and regulator see.",
    icon: (
      <svg width="22" height="22" fill="none" stroke="#00E676" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Your questions, answered",
    description:
      "Bring a current case or premium problem — our WorkCover specialists will show you how Preventli would handle it.",
    icon: (
      <svg width="22" height="22" fill="none" stroke="#00E676" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
      </svg>
    ),
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
            30 minutes. Your workflow, working.
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            No slide deck. We walk the live platform with scenarios that match
            your industry and claims history.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {walkthrough.map((item, i) => (
            <div
              key={i}
              className="bg-[#F8F9FA] border border-gray-100 rounded-2xl p-6 card-hover"
            >
              <div className="w-11 h-11 bg-[#0A1628] rounded-xl flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-[#0A1628] mb-2">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
