"use client";

import { useEffect, useRef } from "react";

const features = [
  {
    icon: "📋",
    title: "RTW Case Tracking & Timeline",
    description:
      "Manage every WorkCover case from lodgement to closure. A visual timeline tracks each phase — initial treatment, capacity assessment, graduated return, and full return to work.",
    color: "from-blue-400/10 to-cyan-400/5",
    border: "border-blue-400/20",
  },
  {
    icon: "🤖",
    title: "AI-Generated Return-to-Work Plans",
    description:
      "AI writes a complete, compliant RTW plan in seconds. Upload the medical certificate and Preventli generates duties, timelines, and WorkSafe obligations automatically.",
    color: "from-violet-400/10 to-purple-400/5",
    border: "border-violet-400/20",
    aiFeature: true,
  },
  {
    icon: "🩺",
    title: "Pre-Employment Health Assessments",
    description:
      "Screen candidates before they start. Create role-specific health requirements, send digital assessment links, and track clearance levels — cleared, conditional, or not cleared.",
    color: "from-green-400/10 to-emerald-400/5",
    border: "border-green-400/20",
  },
  {
    icon: "📊",
    title: "Manager Dashboard & Analytics",
    description:
      "See all active cases, upcoming milestones, and compliance obligations at a glance. Spot at-risk cases before they blow out and track resolution times across your organisation.",
    color: "from-indigo-400/10 to-blue-400/5",
    border: "border-indigo-400/20",
  },
  {
    icon: "🔔",
    title: "Real-Time Notification Bell",
    description:
      "Never miss a deadline. In-app alerts notify managers the moment a task is overdue, a certificate expires, or a WorkSafe obligation needs attention.",
    color: "from-orange-400/10 to-amber-400/5",
    border: "border-orange-400/20",
  },
  {
    icon: "🔒",
    title: "Full Compliance Audit Trail",
    description:
      "Every action logged with timestamp, user, and IP. WorkSafe inspectors get a complete, tamper-evident record of every decision and document from day one.",
    color: "from-purple-400/10 to-violet-400/5",
    border: "border-purple-400/20",
  },
  {
    icon: "📁",
    title: "Document & Certificate Storage",
    description:
      "Centralise all medical certificates, capacity certificates, and rehabilitation documents. Upload, version, and retrieve any document in seconds — no more lost paperwork.",
    color: "from-teal-400/10 to-emerald-400/5",
    border: "border-teal-400/20",
  },
  {
    icon: "✅",
    title: "WorkSafe Compliance Checklists",
    description:
      "Built-in checklists for every WHS obligation. Step-by-step guidance ensures managers complete the right actions at the right time — from initial notification to case closure.",
    color: "from-cyan-400/10 to-teal-400/5",
    border: "border-cyan-400/20",
  },
  {
    icon: "👨‍⚕️",
    title: "Real Doctors from Day One",
    description:
      "Access real doctors immediately when any injury occurs. Our nationwide telehealth network provides expert medical opinions, injury assessments, and early intervention — no waiting, no delays.",
    color: "from-pink-400/10 to-rose-400/5",
    border: "border-pink-400/20",
  },
  {
    icon: "🏢",
    title: "Multi-Manager Access",
    description:
      "Invite your whole team. Managers get role-based access so the right people see the right cases. Enterprise plans add SSO and unlimited users across large organisations.",
    color: "from-red-400/10 to-rose-400/5",
    border: "border-red-400/20",
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
            What&apos;s Inside the Platform
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1628] mt-3 mb-4">
            Everything you need to manage WorkCover — in one place
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            From the moment a claim is lodged to the day the worker returns, Preventli handles
            case tracking, compliance, AI-generated plans, and pre-employment screening in a single platform.
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
