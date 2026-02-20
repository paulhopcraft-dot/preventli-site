"use client";

import { useEffect, useRef } from "react";

const features = [
  {
    icon: "💰",
    title: "WorkCover Premium Reduction",
    description:
      "We analyse your claims history and risk factors to implement strategies that directly reduce your WorkCover premiums year over year.",
    color: "from-green-400/10 to-emerald-400/5",
    border: "border-green-400/20",
  },
  {
    icon: "🦺",
    title: "Injury Prevention Programs",
    description:
      "Customised safety programs tailored to your industry and workforce. Reduce incident rates through targeted training, hazard identification, and culture change.",
    color: "from-blue-400/10 to-cyan-400/5",
    border: "border-blue-400/20",
  },
  {
    icon: "📋",
    title: "Compliance Management",
    description:
      "Stay on top of WHS obligations with automated compliance tracking, SWMS management, risk registers, and real-time reporting dashboards.",
    color: "from-purple-400/10 to-violet-400/5",
    border: "border-purple-400/20",
  },
  {
    icon: "🏥",
    title: "Return-to-Work Coordination",
    description:
      "Expert coordination of return-to-work programs to get injured employees back safely and quickly, minimising claims duration and cost.",
    color: "from-amber-400/10 to-orange-400/5",
    border: "border-amber-400/20",
  },
  {
    icon: "🚨",
    title: "Incident Response Support",
    description:
      "24/7 incident response guidance. When something happens, we're there to manage the response, documentation, and WorkCover notification requirements.",
    color: "from-red-400/10 to-rose-400/5",
    border: "border-red-400/20",
  },
  {
    icon: "📊",
    title: "Executive Reporting Dashboard",
    description:
      "Real-time visibility into your safety performance, premium trajectory, compliance status, and ROI — all in one executive-ready dashboard.",
    color: "from-indigo-400/10 to-blue-400/5",
    border: "border-indigo-400/20",
  },
];

export default function Features() {
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
    <section id="features" className="py-20 bg-[#F8F9FA]">
      <div
        ref={ref}
        className="section-observe max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-14">
          <span className="text-[#00E676] text-sm font-semibold uppercase tracking-widest">
            Platform Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1628] mt-3 mb-4">
            Everything you need to stay protected
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            A complete WorkCover and WHS management platform, designed
            specifically for Australian businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`card-hover bg-gradient-to-br ${feature.color} border ${feature.border} rounded-2xl p-6 bg-white`}
              style={{ backgroundColor: "white" }}
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold text-[#0A1628] mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
