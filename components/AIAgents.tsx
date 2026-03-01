"use client";

import { useEffect, useRef, useState } from "react";

const agents = [
  {
    name: "Case Manager Agent",
    icon: "📋",
    gradient: "from-violet-500 to-purple-600",
    description:
      "AI-powered case management that monitors every workers compensation claim from injury to resolution. Tracks milestones, flags delays, and ensures optimal outcomes.",
    capabilities: [
      "Real-time claim status monitoring",
      "Automated milestone tracking",
      "Early intervention alerts",
      "Stakeholder communication coordination",
      "Cost prediction & management",
    ],
    stats: { metric: "30%", label: "Faster case resolution" },
  },
  {
    name: "Return to Work Agent",
    icon: "🏥",
    gradient: "from-blue-500 to-cyan-600",
    description:
      "Orchestrates return-to-work programs with precision. Matches injured workers with suitable duties, monitors progress, and accelerates safe workplace reintegration.",
    capabilities: [
      "Suitable duties matching algorithm",
      "Medical certificate analysis",
      "Capacity vs workload optimization",
      "Progress tracking & reporting",
      "Early return-to-work incentives",
    ],
    stats: { metric: "45%", label: "Reduction in claim duration" },
  },
  {
    name: "Compliance Agent",
    icon: "✅",
    gradient: "from-emerald-500 to-teal-600",
    description:
      "Never miss a deadline again. Continuously monitors WHS obligations, tracks documentation, and automates compliance reporting across all regulatory requirements.",
    capabilities: [
      "Automated obligation tracking",
      "Document expiry alerts",
      "Audit trail generation",
      "Multi-jurisdiction compliance",
      "Real-time regulatory updates",
    ],
    stats: { metric: "100%", label: "Compliance rate achieved" },
  },
  {
    name: "Medical Certificate Agent",
    icon: "🩺",
    gradient: "from-orange-500 to-red-600",
    description:
      "Intelligent analysis of medical certificates to identify inconsistencies, predict claim trajectories, and trigger early intervention when needed.",
    capabilities: [
      "Certificate pattern analysis",
      "NTD restriction interpretation",
      "Red flag detection",
      "Doctor shopping identification",
      "Telehealth referral coordination",
    ],
    stats: { metric: "60%", label: "Earlier intervention triggers" },
  },
];

export default function AIAgents() {
  const ref = useRef<HTMLDivElement>(null);
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);

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
    <section id="ai-agents" className="py-12 pb-8 bg-[#0A1628] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#00E676] rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500 rounded-full filter blur-3xl animate-pulse delay-1000" />
      </div>

      <div
        ref={ref}
        className="section-observe max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="text-center mb-14">
          <span className="text-[#00E676] text-sm font-semibold uppercase tracking-widest">
            AI-Powered Workforce
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
            Meet Your Specialized AI Agents
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Four intelligent agents working 24/7 to manage claims, compliance,
            and worker wellbeing. Each agent is trained on thousands of cases to
            deliver expert-level outcomes automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {agents.map((agent, index) => (
            <div
              key={index}
              onClick={() =>
                setSelectedAgent(selectedAgent === index ? null : index)
              }
              className={`group relative overflow-hidden bg-gradient-to-br ${agent.gradient} rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                selectedAgent === index
                  ? "scale-105 shadow-2xl"
                  : "hover:scale-102 hover:shadow-xl"
              }`}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-3xl">
                      {agent.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {agent.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-[#00E676] rounded-full animate-pulse" />
                        <span className="text-white/80 text-xs font-medium">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">
                      {agent.stats.metric}
                    </div>
                    <div className="text-white/70 text-xs">
                      {agent.stats.label}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-white/90 text-sm leading-relaxed mb-4">
                  {agent.description}
                </p>

                {/* Capabilities */}
                {selectedAgent === index && (
                  <div className="mt-4 pt-4 border-t border-white/20 animate-fadeIn">
                    <h4 className="text-white font-semibold text-sm mb-3">
                      Key Capabilities:
                    </h4>
                    <ul className="space-y-2">
                      {agent.capabilities.map((capability, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-white/90 text-sm"
                        >
                          <span className="text-[#00E676] mt-0.5">✓</span>
                          <span>{capability}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Expand indicator */}
                <div className="mt-4 flex justify-center">
                  <div className="text-white/60 text-xs font-medium">
                    {selectedAgent === index ? "Click to collapse" : "Click to learn more"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-[#00E676] to-[#00D168] rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-[#0A1628] mb-3">
            All Four Agents. One Platform.
          </h3>
          <p className="text-[#0A1628]/80 mb-6 max-w-2xl mx-auto">
            These AI agents work together seamlessly, sharing insights and
            coordinating actions to give you the most comprehensive WorkCover
            management system available.
          </p>
          <a
            href="#contact"
            className="inline-block bg-[#0A1628] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#1a2638] transition-all shadow-lg"
          >
            See the Agents in Action
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}
