"use client";

import { useState, useEffect, useRef } from "react";

const plans = [
  {
    name: "Starter",
    monthlyPrice: 299,
    annualPrice: 239,
    description: "Perfect for small businesses getting started with compliance.",
    employees: "Up to 20 employees",
    popular: false,
    features: [
      "Monthly compliance reports",
      "WHS documentation templates",
      "Incident reporting tool",
      "Email support (48hr response)",
      "Basic risk register",
      "1 user seat",
    ],
    cta: "Start with Starter",
    color: "border-gray-200",
  },
  {
    name: "Business",
    monthlyPrice: 599,
    annualPrice: 479,
    description:
      "For growing businesses serious about WorkCover premium reduction.",
    employees: "Up to 100 employees",
    popular: true,
    features: [
      "Weekly compliance reports",
      "WorkCover premium liaison",
      "Dedicated phone support",
      "Return-to-work coordination",
      "Advanced analytics dashboard",
      "Staff training modules",
      "5 user seats",
      "Quarterly strategy reviews",
    ],
    cta: "Start with Business",
    color: "border-[#00E676]",
  },
  {
    name: "Enterprise",
    monthlyPrice: null,
    annualPrice: null,
    description:
      "Full-service WorkCover and WHS management for large organisations.",
    employees: "Unlimited employees",
    popular: false,
    features: [
      "Everything in Business",
      "Dedicated safety consultant",
      "On-site audits & training",
      "SLA guarantee (4hr response)",
      "Custom compliance frameworks",
      "Executive reporting suite",
      "Unlimited user seats",
      "Priority WorkCover liaison",
    ],
    cta: "Contact Us",
    color: "border-[#FF8F00]",
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
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
            Invest less than one claim costs you
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
            A single WorkCover claim averages $52,000. Our plans pay for
            themselves many times over.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-4 bg-white border border-gray-200 rounded-full p-1.5">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                !annual
                  ? "bg-[#0A1628] text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                annual
                  ? "bg-[#0A1628] text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Annual
              <span className="bg-[#00E676] text-[#0A1628] text-xs font-bold px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
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
                {plan.monthlyPrice ? (
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-[#0A1628]">
                      ${annual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-gray-400 mb-1">/mo</span>
                  </div>
                ) : (
                  <div className="text-4xl font-bold text-[#0A1628]">
                    Custom
                  </div>
                )}
                {annual && plan.monthlyPrice && (
                  <div className="text-sm text-[#00E676] mt-1">
                    Save ${(plan.monthlyPrice - (plan.annualPrice ?? 0)) * 12}/yr
                  </div>
                )}
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
                  {plan.employees}
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
                href={plan.name === "Enterprise" ? "#contact" : "#contact"}
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
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  );
}
