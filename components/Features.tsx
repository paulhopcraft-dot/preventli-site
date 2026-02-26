"use client";

import { useEffect, useRef } from "react";

const features = [
  {
    icon: "🤖",
    title: "AI-Powered Risk Prediction",
    description:
      "Machine learning algorithms analyze your workforce data to predict injury risks before they happen. Get early warnings and prevent incidents proactively.",
    color: "from-violet-400/10 to-purple-400/5",
    border: "border-violet-400/20",
    aiFeature: true,
  },
  {
    icon: "🧠",
    title: "Intelligent Claim Analysis",
    description:
      "AI automatically categorizes and analyzes claims data, identifying patterns and cost drivers to help you make data-driven decisions that reduce premiums.",
    color: "from-blue-400/10 to-cyan-400/5",
    border: "border-blue-400/20",
    aiFeature: true,
  },
  {
    icon: "💰",
    title: "WorkCover Premium Reduction",
    description:
      "We analyse your claims history and risk factors to implement strategies that directly reduce your WorkCover premiums year over year.",
    color: "from-green-400/10 to-emerald-400/5",
    border: "border-green-400/20",
  },
  {
    icon: "📈",
    title: "Predictive Analytics Dashboard",
    description:
      "Real-time AI-powered insights show trending risks, predict future claims likelihood, and recommend preventive actions specific to your workforce patterns.",
    color: "from-indigo-400/10 to-blue-400/5",
    border: "border-indigo-400/20",
    aiFeature: true,
  },
  {
    icon: "🦺",
    title: "Injury Prevention Programs",
    description:
      "Customised safety programs tailored to your industry and workforce. Reduce incident rates through targeted training, hazard identification, and culture change.",
    color: "from-orange-400/10 to-amber-400/5",
    border: "border-orange-400/20",
  },
  {
    icon: "📋",
    title: "Automated Compliance Tracking",
    description:
      "AI monitors WHS obligations and deadlines automatically. Never miss a compliance requirement with intelligent alerts and automated documentation generation.",
    color: "from-purple-400/10 to-violet-400/5",
    border: "border-purple-400/20",
    aiFeature: true,
  },
  {
    icon: "👨‍⚕️",
    title: "National Telehealth Doctor Network",
    description:
      "All programs include access to our nationwide network of telehealth doctors. Get expert medical opinions, early intervention support, and injury assessments without the wait.",
    color: "from-cyan-400/10 to-teal-400/5",
    border: "border-cyan-400/20",
  },
  {
    icon: "🏥",
    title: "Return-to-Work Coordination",
    description:
      "Expert coordination of return-to-work programs to get injured employees back safely and quickly, minimising claims duration and cost.",
    color: "from-teal-400/10 to-emerald-400/5",
    border: "border-teal-400/20",
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
    icon: "💬",
    title: "AI Assistant & Smart Alerts",
    description:
      "Conversational AI helps managers get instant answers about WHS policies, send smart notifications to employees, and automate routine communications.",
    color: "from-pink-400/10 to-rose-400/5",
    border: "border-pink-400/20",
    aiFeature: true,
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
            AI-Powered Platform
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1628] mt-3 mb-4">
            Intelligent WorkCover management that works for you
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Advanced AI and machine learning combined with expert WHS guidance. 
            Predict risks, automate compliance, and reduce premiums with data-driven intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`card-hover bg-gradient-to-br ${feature.color} border ${feature.border} rounded-2xl p-6 bg-white relative`}
              style={{ backgroundColor: "white" }}
            >
              {feature.aiFeature && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    AI
                  </span>
                </div>
              )}
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
