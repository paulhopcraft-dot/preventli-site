"use client";

import { useEffect, useRef } from "react";

// H&W check limit on Professional is a PLACEHOLDER pending Paul's confirmed number
// (site previously said "unlimited" — dictated call notes 2026-07-17 say "limited" instead).
const PROFESSIONAL_HW_LIMIT_PLACEHOLDER = "20 H&W checks / month";

const plans = [
  {
    name: "Pay as you go",
    price: "$0",
    priceSuffix: "/mo",
    description: "Only pay for the checks you run. No credit card to start.",
    popular: false,
    metrics: ["1 user", "Checks billed individually", "No monthly minimum"],
    features: [
      "Clinical & H&W checks, pay per check",
      "Preventli Advisor — Alex",
      "Case management, compliance & dashboards — upgrade to unlock",
    ],
    support: null as null | { title: string; desc: string },
    cta: "Get Started",
    ctaHref: "/start-trial",
    cardClass: "border-gray-200",
    ctaClass: "bg-[#0A1628] text-white hover:bg-[#0D1F3C]",
  },
  {
    name: "Starter",
    price: "$595",
    priceSuffix: "/mo",
    description: "For small teams getting started.",
    popular: false,
    metrics: ["3 users", "3 clinical checks / month", "5 H&W checks / month", "Up to 5 active cases"],
    features: [
      "Everything in Pay as you go",
      "RTW plans & document management",
      "Pre-employment & health checks",
      "Health insights dashboard",
    ],
    support: {
      title: "Support included",
      desc: "Our team is here if you need advice or clarity.",
    },
    cta: "Request Access",
    ctaHref: "#contact",
    cardClass: "border-gray-200",
    ctaClass: "bg-[#0A1628] text-white hover:bg-[#0D1F3C]",
  },
  {
    name: "Professional",
    price: "$1,199",
    priceSuffix: "/mo",
    description: "For larger businesses that need more power and visibility.",
    popular: true,
    metrics: ["Up to 10 users", "10 clinical checks / month", PROFESSIONAL_HW_LIMIT_PLACEHOLDER, "Up to 20 active cases"],
    features: [
      "Everything in Starter",
      "Premium case management",
      "RTW auto-file & task automation",
      "Predictions & risk dashboard",
      "Audit trail & executive reports",
    ],
    support: {
      title: "Expert guidance",
      desc: "Access to our workplace health experts whenever you need them.",
    },
    cta: "Request Access",
    ctaHref: "#contact",
    cardClass: "border-[#8DC63F]",
    ctaClass: "bg-[#8DC63F] text-[#0A1628] hover:bg-[#00C060]",
  },
];

function CheckIcon() {
  return (
    <svg
      className="flex-shrink-0 mt-0.5"
      width="16"
      height="16"
      fill="none"
      stroke="#8DC63F"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg width="26" height="26" fill="none" stroke="#8DC63F" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

export default function Pricing() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
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
      <div ref={ref} className="section-observe max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[#8DC63F] text-sm font-semibold uppercase tracking-widest">
            Simple Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1628] mt-3 mb-4">
            Start free. Scale as you grow.
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            A single WorkCover claim averages $52,000. Preventli pays for itself many times over.
          </p>
        </div>

        {/* Free trial banner */}
        <div className="bg-[#0A1628] rounded-2xl px-6 py-6 sm:py-7 mb-10 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg">
          <div className="text-center sm:text-left">
            <p className="text-white text-lg sm:text-xl font-bold mb-1">
              Start your 14-day free trial
            </p>
            <p className="text-gray-300 text-sm">
              Full system access — every check, every compliance tool — plus 1 free report of each check type. No credit card.
            </p>
          </div>
          <a
            href="/start-trial"
            className="flex-shrink-0 bg-[#8DC63F] text-[#0A1628] px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#00C060] transition-all whitespace-nowrap"
          >
            Start Free Trial
          </a>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative bg-white border-2 ${plan.cardClass} rounded-2xl p-6 flex flex-col ${
                plan.popular ? "shadow-xl shadow-[#8DC63F]/15" : "shadow-sm"
              }`}
            >
              {/* Header row */}
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold text-[#0A1628]">{plan.name}</h3>
                {plan.popular && (
                  <span className="bg-[#8DC63F] text-[#0A1628] text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide leading-none">
                    POPULAR
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-500 text-sm mb-4 leading-snug">{plan.description}</p>

              {/* Price */}
              <div className="flex items-end gap-1 mb-5">
                <span className="text-4xl font-bold text-[#0A1628]">{plan.price}</span>
                {plan.priceSuffix && (
                  <span className="text-gray-400 mb-1 text-sm">{plan.priceSuffix}</span>
                )}
              </div>

              {/* Top metrics */}
              <ul className="mb-4 space-y-1.5">
                {plan.metrics.map((m, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckIcon />
                    {m}
                  </li>
                ))}
              </ul>

              <hr className="border-gray-100 mb-4" />

              {/* Feature list */}
              <ul className="space-y-2 mb-4 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckIcon />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* Human support callout */}
              {plan.support && (
                <div className="flex items-start gap-3 bg-[#F8F9FA] rounded-xl px-3 py-3 mb-5">
                  <div className="flex-shrink-0 mt-0.5">
                    <PeopleIcon />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0A1628]">{plan.support.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{plan.support.desc}</p>
                  </div>
                </div>
              )}

              {/* CTA */}
              <a
                href={plan.ctaHref}
                className={`block w-full text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all ${plan.ctaClass}`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Enterprise / custom solution box */}
        <div className="mt-8 max-w-5xl mx-auto border-2 border-[#FF8F00] rounded-2xl px-6 py-6 sm:py-7 flex flex-col sm:flex-row items-center justify-between gap-5 bg-white">
          <div className="text-center sm:text-left">
            <p className="text-[#0A1628] text-lg font-bold mb-1">Need a custom solution?</p>
            <p className="text-gray-500 text-sm max-w-xl">
              Rehab providers, insurers and multi-site operators — unlimited users, custom SLAs, SSO and volume
              check pricing tailored to your caseload.
            </p>
          </div>
          <a
            href="#contact"
            className="flex-shrink-0 bg-[#0A1628] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#0D1F3C] transition-all whitespace-nowrap"
          >
            Contact Us
          </a>
        </div>

        {/* Below-cards — partnership section */}
        <div className="mt-16 text-center">
          <p className="text-[#0A1628] text-lg font-semibold mb-1">
            We&apos;re more than software. We&apos;re your partner in better outcomes.
          </p>
          <p className="text-gray-500 text-sm mb-10">
            Got a complex situation? Our team is here to help.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-left">
            {/* Alex */}
            <div className="flex items-start gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-[#0A1628] flex items-center justify-center">
                  <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </div>
                <span className="absolute -bottom-1 -right-1 bg-[#8DC63F] text-[#0A1628] text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                  Alex
                </span>
              </div>
              <div>
                <p className="font-bold text-[#0A1628] mb-1">Preventli Advisor — Alex</p>
                <p className="text-sm text-gray-500">
                  Your own personal consultant for worker, case and compliance questions.
                  Fast answers. Practical guidance.
                </p>
              </div>
            </div>

            {/* People behind the platform */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#F0FFF4] flex items-center justify-center">
                <svg width="28" height="28" fill="none" stroke="#8DC63F" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-[#0A1628] mb-1">People behind the platform</p>
                <p className="text-sm text-gray-500">
                  Alex combines smart technology with our experienced team for accurate advice
                  and real-world support.
                </p>
              </div>
            </div>

            {/* Experience */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#F0FFF4] flex items-center justify-center">
                <svg width="28" height="28" fill="none" stroke="#8DC63F" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-[#0A1628] mb-1">Experience you can trust</p>
                <p className="text-sm text-gray-500">
                  30+ years of workplace health, claims and return to work experience helping
                  Australian businesses.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fine print */}
        <p className="text-center text-gray-400 text-sm mt-12 max-w-3xl mx-auto">
          Pay as you go checks are billed individually as you run them; Starter and Professional include a set
          number each month, with additional checks billed the same way once you&apos;re over your plan.
          Exit &amp; General Wellbeing checks $40 each. New Starter, Injury Prevention &amp; Mental Health checks $49
          each. Clinical reports $125. Medico-legal reports $145. Prices in AUD and exclude GST.{" "}
          <a href="#contact" className="text-[#8DC63F] hover:underline">
            Chat with us
          </a>{" "}
          — we&apos;ll help you figure out what makes sense for your business.
        </p>
      </div>
    </section>
  );
}
