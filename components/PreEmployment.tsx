"use client";

import { useEffect, useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Request",
    description: "Select assessment type, enter details. One click to send.",
    icon: "📝",
  },
  {
    number: "02", 
    title: "Complete",
    description: "Employee receives a link, completes the assessment on their phone in 10 minutes.",
    icon: "📱",
  },
  {
    number: "03",
    title: "Review",
    description: "Our telehealth team reviews and signs off within 24 hours.",
    icon: "👨‍⚕️",
  },
  {
    number: "04",
    title: "Report",
    description: "You receive a doctor-approved report with recommendations.",
    icon: "✅",
  },
];

const assessmentTypes = [
  { icon: "📋", title: "Pre-Employment", desc: "Clear new starters before day one" },
  { icon: "🦺", title: "Injury Prevention", desc: "Identify risks before they become claims" },
  { icon: "🧠", title: "Mental Health", desc: "Support employee wellbeing proactively" },
  { icon: "🚪", title: "Exit Assessment", desc: "Document health at end of employment" },
  { icon: "💚", title: "Health Check", desc: "Ongoing wellness monitoring" },
];

export default function PreEmployment() {
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
    <section id="assessments" className="py-20 bg-gradient-to-b from-[#0A1628] to-[#0d1d35]">
      <div
        ref={ref}
        className="section-observe max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-12">
          <span className="text-[#00E676] text-sm font-semibold uppercase tracking-widest">
            Health Assessments
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
            Every stage of the employee lifecycle
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            From hire to retire — doctor-approved health assessments delivered in 24 hours. 
            No chasing GPs, no delays.
          </p>
        </div>

        {/* Assessment types */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
          {assessmentTypes.map((type, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 text-center hover:border-[#00E676]/50 transition-colors cursor-pointer"
            >
              <div className="text-3xl mb-3">{type.icon}</div>
              <h3 className="text-white font-bold text-sm mb-1">{type.title}</h3>
              <p className="text-gray-400 text-xs">{type.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-white mb-2">How it works</h3>
          <p className="text-gray-400">Same simple process for every assessment type</p>
        </div>

        {/* Process steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 text-center"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <div className="text-[#00E676]/60 text-sm font-mono mb-2">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.description}</p>
              
              {/* Connector arrow (except last) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-[#00E676]/40">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Key benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-[#00E676] mb-2">24hr</div>
            <div className="text-white font-medium">Turnaround</div>
            <div className="text-gray-400 text-sm">Most same-day</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-[#00E676] mb-2">100%</div>
            <div className="text-white font-medium">Doctor Reviewed</div>
            <div className="text-gray-400 text-sm">National telehealth network</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-[#00E676] mb-2">0</div>
            <div className="text-white font-medium">Admin for You</div>
            <div className="text-gray-400 text-sm">We handle everything</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-[#00E676] text-[#0A1628] px-8 py-4 rounded-full font-semibold hover:bg-[#00ff84] transition-colors"
          >
            Start Your First Assessment
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
