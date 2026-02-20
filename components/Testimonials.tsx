"use client";

import { useEffect, useRef } from "react";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Operations Manager",
    company: "Apex Construction Group",
    size: "85 employees",
    quote:
      "We cut our WorkCover premium by $43,000 in the first year. Preventli identified risks we didn't even know existed and gave us a clear roadmap. The ROI was immediate.",
    rating: 5,
    initials: "SM",
    color: "bg-blue-500",
  },
  {
    name: "David K.",
    role: "CEO",
    company: "Horizon Healthcare",
    size: "220 employees",
    quote:
      "After three serious incidents in two years, our premiums were through the roof. Preventli turned things around. Zero incidents last year, and our premium dropped 38%. Couldn't recommend them more.",
    rating: 5,
    initials: "DK",
    color: "bg-emerald-500",
  },
  {
    name: "Michelle T.",
    role: "HR Director",
    company: "Coastal Hospitality Group",
    size: "140 employees",
    quote:
      "The compliance management tool alone saved my team 8 hours a week. Having everything in one place, plus a dedicated consultant who actually knows WorkCover inside out — it's a game changer.",
    rating: 5,
    initials: "MT",
    color: "bg-purple-500",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="#FF8F00"
          stroke="none"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
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
    <section className="py-20 bg-[#0A1628]">
      <div
        ref={ref}
        className="section-observe max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-14">
          <span className="text-[#00E676] text-sm font-semibold uppercase tracking-widest">
            Client Results
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
            Real businesses, real savings
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Don&apos;t take our word for it — here&apos;s what our clients say
            after working with Preventli.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="card-hover bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col"
            >
              {/* Quote mark */}
              <div className="text-[#00E676] text-5xl font-serif leading-none mb-4 opacity-50">
                &ldquo;
              </div>

              <p className="text-gray-300 leading-relaxed flex-1 mb-6 italic">
                {t.quote}
              </p>

              <div className="border-t border-white/10 pt-6">
                <StarRating count={t.rating} />
                <div className="flex items-center gap-3 mt-4">
                  <div
                    className={`w-10 h-10 ${t.color} rounded-full flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-white text-sm font-bold">
                      {t.initials}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">
                      {t.name}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {t.role}, {t.company}
                    </div>
                    <div className="text-[#00E676] text-xs mt-0.5">
                      {t.size}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-14 flex flex-wrap justify-center items-center gap-8 opacity-50">
          {[
            "Safe Work Australia",
            "WorkSafe Victoria",
            "SafeWork NSW",
            "WorkCover QLD",
          ].map((badge) => (
            <div
              key={badge}
              className="flex items-center gap-2 text-gray-400 text-sm"
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
