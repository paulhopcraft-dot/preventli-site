"use client";

import { useState, useEffect, useRef } from "react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    priceSuffix: "",
    description: "Get started with WorkCover case management. No credit card required.",
    highlight: "Up to 3 active cases",
    popular: false,
    features: [
      "1 manager user",
      "Up to 3 active cases",
      "RTW case tracking & timeline",
      "Document & certificate storage",
      "WorkSafe compliance checklists",
      "Email notifications",
      "Standard support",
    ],
    cta: "Get Started Free",
    color: "border-gray-200",
    ideal: "Small businesses, occasional claims",
  },
  {
    name: "Professional",
    price: "$299",
    priceSuffix: "/month",
    description: "For growing businesses that need AI-powered RTW planning and pre-employment checks.",
    highlight: "Unlimited cases included",
    popular: true,
    features: [
      "Everything in Starter",
      "Unlimited active cases",
      "AI-generated return-to-work plans",
      "Pre-employment health assessments",
      "Manager dashboard & analytics",
      "Real-time notification bell",
      "Full compliance audit trail",
      "Priority support",
    ],
    cta: "Request Access",
    color: "border-[#00E676]",
    ideal: "Growing teams, 5–50 employees",
  },
  {
    name: "Enterprise",
    price: "$799",
    priceSuffix: "/month",
    description: "Full-scale WorkCover management for large organisations. Custom SLA, SSO, and dedicated support.",
    highlight: "Unlimited users & cases",
    popular: false,
    features: [
      "Everything in Professional",
      "Unlimited manager users",
      "Single sign-on (SSO)",
      "Custom SLA (4-hour response)",
      "Dedicated account manager",
      "On-site training available",
      "Executive reporting suite",
      "WorkCover strategy sessions",
    ],
    cta: "Contact Us",
    color: "border-[#FF8F00]",
    ideal: "Large organisations, 50+ employees",
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
            Start free. Scale as you grow.
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
            A single WorkCover claim averages $52,000. Preventli pays for itself many times over — get AI-powered RTW plans, pre-employment checks, and full compliance in one platform.
          </p>

          {/* Value prop badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600 flex items-center gap-2">
              <svg width="16" height="16" fill="none" stroke="#00E676" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              No credit card for Starter
            </span>
            <span className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600 flex items-center gap-2">
              <svg width="16" height="16" fill="none" stroke="#00E676" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              AI-generated RTW plans
            </span>
            <span className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600 flex items-center gap-2">
              <svg width="16" height="16" fill="none" stroke="#00E676" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Full compliance audit trail
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
          Prices in AUD and exclude GST. Not sure which plan?{" "}
          <a href="#contact" className="text-[#00E676] hover:underline">
            Chat with us
          </a>{" "}
          — we&apos;ll help you figure out what makes sense for your business.
        </p>
      </div>
    </section>
  );
}
