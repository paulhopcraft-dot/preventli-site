"use client";

import { useState, useEffect, useRef } from "react";

const plans = [
  {
    name: "One-Off Case Fee",
    price: "$990",
    priceSuffix: "/case",
    description: "Got a claim you need handled? Pay once, we manage it to resolution. No ongoing fees.",
    highlight: "One claim, one fee, done",
    popular: false,
    features: [
      "Full case management start to finish",
      "WorkSafe compliance handled for you",
      "Return-to-work coordination",
      "All documentation & certificates tracked",
      "Chat with us anytime for updates",
      "Direct line to your case manager",
      "No subscription required",
    ],
    cta: "Get a Case Handled",
    color: "border-gray-200",
    ideal: "Occasional claims",
  },
  {
    name: "Monthly Plan",
    price: "$1,499",
    priceSuffix: "/month",
    description: "For businesses with ongoing claims. Predictable costs, unlimited support.",
    highlight: "Includes up to 5 active cases",
    popular: true,
    features: [
      "Everything in Pay Per Case",
      "Up to 5 active cases included",
      "Priority case handling",
      "Proactive compliance alerts",
      "Quarterly premium reviews",
      "Dedicated account manager",
      "Additional cases at reduced rate",
      "Monthly reporting dashboard",
    ],
    cta: "Start Monthly Plan",
    color: "border-[#00E676]",
    ideal: "5-20 claims per year",
  },
  {
    name: "Enterprise",
    price: "Custom",
    priceSuffix: "",
    description: "Full-service WorkCover management for large organisations with high claim volumes.",
    highlight: "Unlimited cases included",
    popular: false,
    features: [
      "Everything in Monthly Plan",
      "Unlimited active cases",
      "Dedicated senior consultant",
      "On-site training available",
      "SLA guarantee (4hr response)",
      "Executive reporting suite",
      "WorkCover strategy sessions",
      "Premium reduction consulting",
    ],
    cta: "Contact Us",
    color: "border-[#FF8F00]",
    ideal: "20+ claims per year",
  },
];

export default function Pricing() {
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
    <section id="pricing" className="py-20 bg-[#F8F9FA]">
      <div
        ref={ref}
        className="section-observe max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-12">
          <span className="text-[#00E676] text-sm font-semibold uppercase tracking-widest">
            Simple Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1628] mt-3 mb-4">
            We manage your claims. You focus on your business.
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
            A single WorkCover claim averages $52,000. Our managed service pays for itself many times over — and you don't have to learn any software.
          </p>

          {/* Value prop badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600 flex items-center gap-2">
              <svg width="16" height="16" fill="none" stroke="#00E676" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              No software to learn
            </span>
            <span className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600 flex items-center gap-2">
              <svg width="16" height="16" fill="none" stroke="#00E676" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Just ask us anything via chat
            </span>
            <span className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600 flex items-center gap-2">
              <svg width="16" height="16" fill="none" stroke="#00E676" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              We handle the compliance
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative bg-white border-2 ${plan.color} rounded-2xl p-8 card-hover ${
                plan.popular ? "shadow-xl shadow-[#00E676]/10 scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#00E676] text-[#0A1628] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-[#0A1628] mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-500 text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-[#0A1628]">
                    {plan.price}
                  </span>
                  {plan.priceSuffix && (
                    <span className="text-gray-400 mb-1">{plan.priceSuffix}</span>
                  )}
                </div>
                <div className="text-sm text-[#00E676] mt-2 font-medium">
                  {plan.highlight}
                </div>
                <div className="text-sm text-gray-400 mt-2 flex items-center gap-1.5">
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                  </svg>
                  Ideal for: {plan.ideal}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <svg
                      className="flex-shrink-0 mt-0.5"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="#00E676"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`block w-full text-center py-3 px-6 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? "bg-[#00E676] text-[#0A1628] hover:bg-[#00C060]"
                    : "bg-[#0A1628] text-white hover:bg-[#0D1F3C]"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          Not sure which plan? Chat with us — we'll help you figure out what makes sense for your business.
        </p>
      </div>
    </section>
  );
}
