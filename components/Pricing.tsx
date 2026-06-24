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
    description: "Try Preventli on a single case. No credit card.",
    popular: false,
    headline: null as string | null,
    features: [
      "1 manager user",
      "1 active case",
      "Alex assistant — read-only",
      "RTW tracking & documents",
      "WorkSafe compliance checklists",
    ],
    cta: "Get Started Free",
    border: "border-gray-200",
  },
  {
    name: "Starter",
    price: "$499",
    priceSuffix: "/mo",
    checks: "3",
    checksLabel: "checks / month",
    overage: true,
    description: "Hands-on claims with expert backup.",
    popular: false,
    headline: "Workforce Health Insights",
    features: [
      "Everything in Free",
      "2 users · up to 3 active cases",
      "Expert return-to-work plans",
      "Pre-employment & health checks",
      "Alex takes actions for you",
    ],
    cta: "Request Access",
    border: "border-gray-200",
  },
  {
    name: "Professional",
    price: "$899",
    priceSuffix: "/mo",
    checks: "10",
    checksLabel: "checks / month",
    overage: true,
    description: "Full compliance coverage at scale.",
    popular: true,
    headline: "Premium management",
    features: [
      "Everything in Starter",
      "15 users · unlimited cases",
      "Alex auto-files RTW plans",
      "Predictions & risk dashboard",
      "Audit trail & executive reports",
    ],
    cta: "Request Access",
    border: "border-[#00E676]",
  },
  {
    name: "Enterprise",
    price: "Ask us",
    priceSuffix: "",
    checks: "Volume",
    checksLabel: "custom pricing",
    overage: false,
    description: "For large organisations with custom SLA & SSO.",
    popular: false,
    headline: null as string | null,
    features: [
      "Everything in Professional",
      "Unlimited users",
      "Partner / multi-org workspace",
      "SSO + custom SLA",
      "Dedicated account manager",
    ],
    cta: "Contact Us",
    border: "border-[#FF8F00]",
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
        <div className="text-center mb-10">
          <span className="text-[#00E676] text-sm font-semibold uppercase tracking-widest">
            Simple Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1628] mt-3 mb-4">
            Start free. Scale as you grow.
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            A single WorkCover claim averages $52,000. Preventli pays for itself many times over.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative flex flex-col bg-white border ${plan.border} rounded-xl p-5 card-hover ${
                plan.popular ? "ring-2 ring-[#00E676] shadow-lg shadow-[#00E676]/10" : ""
              }`}
            >
              {/* Header: name + inline popular pill */}
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-base font-bold text-[#0A1628]">{plan.name}</h3>
                {plan.popular && (
                  <span className="bg-[#00E676] text-[#0A1628] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                    Popular
                  </span>
                )}
              </div>

              <p className="text-gray-500 text-xs mb-4 leading-snug min-h-[2.5rem]">
                {plan.description}
              </p>

              {/* Price */}
              <div className="flex items-end gap-1 mb-3">
                <span className="text-3xl font-bold text-[#0A1628]">{plan.price}</span>
                {plan.priceSuffix && (
                  <span className="text-gray-400 text-sm mb-1">{plan.priceSuffix}</span>
                )}
              </div>

              {/* Checks included — the hero usage metric */}
              <div className="mb-3 rounded-lg bg-[#F8F9FA] border border-gray-100 px-3 py-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-[#0A1628]">{plan.checks}</span>
                  <span className="text-xs text-gray-500">{plan.checksLabel}</span>
                </div>
                {plan.overage && (
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    then $40+ / check
                  </div>
                )}
              </div>

              {/* Headline unlock */}
              {plan.headline ? (
                <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-[#0A1628]">
                  <svg width="12" height="12" fill="#00E676" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7.4L12 17l-6.3 4.4L8 14 2 9.4h7.6z" />
                  </svg>
                  Unlocks {plan.headline}
                </div>
              ) : (
                <div className="mb-3 h-[1.125rem]" aria-hidden="true" />
              )}

              {/* Features */}
              <ul className="space-y-2 mb-5 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs leading-snug">
                    <svg
                      className="flex-shrink-0 mt-0.5"
                      width="12"
                      height="12"
                      fill="none"
                      stroke="#00E676"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`block w-full text-center py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
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

        <p className="text-center text-gray-400 text-xs mt-6 max-w-3xl mx-auto">
          A &ldquo;check&rdquo; is any health check — new starter, exit, prevention, injury or wellbeing.
          Beyond your plan, pay as you go from $40 each. Medico-legal and IME reports are billed separately ($119 / $149).
          Prices in AUD, exclude GST.{" "}
          <a href="#contact" className="text-[#00E676] hover:underline">
            Chat with us
          </a>
          .
        </p>
      </div>
    </section>
  );
}
