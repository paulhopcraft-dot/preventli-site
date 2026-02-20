"use client";

import { useEffect, useRef } from "react";

const painPoints = [
  {
    icon: (
      <svg
        width="32"
        height="32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
    emoji: "📈",
    title: "WorkCover premiums eating into margins?",
    description:
      "Rising premiums are squeezing profit margins for Australian businesses every year — often without warning.",
    stat: "Premiums up 23% in 3 years",
  },
  {
    emoji: "🚨",
    icon: (
      <svg
        width="32"
        height="32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
    ),
    title: "One injury could cost you $50,000+",
    description:
      "A single serious workplace incident can trigger a chain reaction of costs: medical, legal, lost productivity, and premium hikes.",
    stat: "Avg claim cost: $52,000",
  },
  {
    emoji: "📋",
    icon: (
      <svg
        width="32"
        height="32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
        />
      </svg>
    ),
    title: "Compliance paperwork taking up valuable time?",
    description:
      "WHS documentation, SWMS, risk registers, incident reports — it never ends. Your time is better spent running your business.",
    stat: "12+ hrs/week on average",
  },
];

export default function PainPoints() {
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
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1628] mb-4">
            Sound familiar?
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            You&apos;re not alone. These are the top pain points we hear from
            Australian business owners every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {painPoints.map((point, i) => (
            <div
              key={i}
              className="card-hover relative bg-[#F8F9FA] border border-gray-100 rounded-2xl p-8 group"
            >
              {/* Red accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-orange-400 rounded-t-2xl opacity-70" />

              <div className="text-4xl mb-4">{point.emoji}</div>

              <h3 className="text-xl font-bold text-[#0A1628] mb-3 leading-tight">
                {point.title}
              </h3>
              <p className="text-gray-500 mb-5 leading-relaxed">
                {point.description}
              </p>

              <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 rounded-full px-3 py-1.5 text-sm font-semibold">
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <polyline points="18 15 12 9 6 15" />
                </svg>
                {point.stat}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
