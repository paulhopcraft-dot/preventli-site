"use client";

import { useEffect, useRef } from "react";

const plans = [
  {
    name: "Free",
    price: "Free",
    priceSuffix: "",
    checks: "1",
    checksLabel: "check included",
    overage: false,
    description: "Get started with WorkCover case management. No credit card required.",
    highlight: "1 active case",
    popular: false,
    headline: null as string | null,
    features: [
      "1 manager user",
      "1 active case",
      "Alex assistant — answers & flags (read-only)",
      "RTW case tracking & timeline",
      "Document & certificate storage",
      "WorkSafe compliance checklists",
    ],
    cta: "Get Started Free",
    color: "border-gray-200",
    ideal: "Small businesses, occasional claims",
  },
  {
    name: "Starter",
    price: "$499",
    priceSuffix: "/month",
    checks: "3",
    checksLabel: "checks / month included",
    overage: true,
    description: "For small teams managing claims hands-on with expert backup.",
    highlight: "Up to 3 active cases",
    popular: false,
    headline: "Workforce Health Insights",
    features: [
      "Everything in Free",
      "2 manager users",
      "Up to 3 active cases",
      "Expert return-to-work plans",
      "Pre-employment & health checks",
      "Alex takes actions for you — reminders, notes, updates",
      "Manager dashboard & analytics",
    ],
    cta: "Request Access",
    color: "border-gray-200",
    ideal: "Growing teams, 5–50 employees",
  },
  {
    name: "Professional",
    price: "$899",
    priceSuffix: "/month",
    checks: "10",
    checksLabel: "checks / month included",
    overage: true,
    description: "For established businesses that need full compliance coverage at scale.",
    highlight: "Unlimited cases included",
    popular: true,
    headline: "Premium management",
    features: [
      "Everything in Starter",
      "Up to 15 manager users",
      "Unlimited active cases",
      "Alex auto-generates & files RTW plans",
      "Predictions & risk dashboard",
      "Recovery timeline & financials",
      "Full compliance audit trail & reporting",
    ],
    cta: "Request Access",
    color: "border-[#9CB81E]",
    ideal: "Established teams, 50–200 employees",
  },
  {
    name: "Enterprise",
    price: "Ask us",
    priceSuffix: "",
    checks: "Volume",
    checksLabel: "custom check pricing",
    overage: false,
    description: "Full-scale WorkCover management for large organisations. Custom SLA, SSO, and dedicated support.",
    highlight: "Unlimited users & cases",
    popular: false,
    headline: null as string | null,
    features: [
      "Everything in Professional",
      "Unlimited manager users",
      "Partner / multi-organisation workspace",
      "Single sign-on (SSO)",
      "Custom SLA (4-hour response)",
      "Dedicated account manager",
      "WorkCover strategy sessions",
    ],
    cta: "Contact Us",
    color: "border-[#FF8F00]",
    ideal: "Large organisations, 200+ employees",
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
          <span className="text-[#9CB81E] text-sm font-semibold uppercase tracking-widest">
            Simple Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1628] mt-3 mb-4">
            Start free. Scale as you grow.
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
            A single WorkCover claim averages $52,000. Preventli pays for itself many times over — get expert-designed RTW plans, pre-employment checks, and full compliance in one platform.
          </p>

          {/* Value prop badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600 flex items-center gap-2">
              <svg width="16" height="16" fill="none" stroke="#9CB81E" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              No credit card for Free
            </span>
            <span className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600 flex items-center gap-2">
              <svg width="16" height="16" fill="none" stroke="#9CB81E" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Expert RTW plans
            </span>
            <span className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600 flex items-center gap-2">
              <svg width="16" height="16" fill="none" stroke="#9CB81E" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Full compliance audit trail
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative bg-white border-2 ${plan.color} rounded-2xl p-7 card-hover ${
                plan.popular ? "shadow-xl shadow-[#9CB81E]/10 scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#9CB81E] text-[#0A1628] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-xl font-bold text-[#0A1628] mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-500 text-sm">{plan.description}</p>
              </div>

              <div className="mb-5">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-[#0A1628]">
                    {plan.price}
                  </span>
                  {plan.priceSuffix && (
                    <span className="text-gray-400 mb-1">{plan.priceSuffix}</span>
                  )}
                </div>
              </div>

              {/* Checks included — the headline usage metric */}
              <div className="mb-5 rounded-xl bg-[#F8F9FA] border border-gray-100 px-4 py-3">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-[#0A1628]">
                    {plan.checks}
                  </span>
                  <span className="text-sm text-gray-500">{plan.checksLabel}</span>
                </div>
                {plan.overage && (
                  <div className="text-xs text-gray-400 mt-1">
                    then pay-as-you-go from $40 / check
                  </div>
                )}
              </div>

              {/* Headline unlock */}
              {plan.headline && (
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#0A1628]">
                  <svg width="16" height="16" fill="#9CB81E" viewBox="0 0 24 24">
                    <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7.4L12 17l-6.3 4.4L8 14 2 9.4h7.6z" />
                  </svg>
                  Unlocks {plan.headline}
                </div>
              )}

              <div className="mb-5 text-sm text-gray-400 flex items-center gap-1.5">
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

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <svg
                      className="flex-shrink-0 mt-0.5"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="#9CB81E"
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
                    ? "bg-[#9CB81E] text-[#0A1628] hover:bg-[#86A516]"
                    : "bg-[#0A1628] text-white hover:bg-[#0D1F3C]"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mt-8 max-w-3xl mx-auto">
          A &ldquo;check&rdquo; is any health check — new starter, exit, prevention, injury or wellbeing.
          Need more than your plan includes? Pay as you go from $40 each. Medico-legal and IME reports
          are specialist deliverables, billed separately ($119 / $149). Prices in AUD and exclude GST.{" "}
          <a href="#contact" className="text-[#9CB81E] hover:underline">
            Not sure which plan? Chat with us
          </a>{" "}
          — we&apos;ll help you figure out what makes sense for your business.
        </p>
      </div>
    </section>
  );
}
