"use client";

import { useState } from "react";
import { WELCOME_FAQ } from "@/lib/welcome/faq";

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-[#0A1628] border-t border-white/5">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-[#00E676] text-sm font-semibold uppercase tracking-widest">
            Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">
            Frequently asked questions
          </h2>
        </div>

        <div className="space-y-3">
          {WELCOME_FAQ.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={item.question}
                className="border border-white/10 rounded-2xl bg-white/[0.03] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-4 sm:py-5"
                >
                  <span className="text-white font-semibold text-sm sm:text-base">
                    {item.question}
                  </span>
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="#00E676"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div
                  className="grid transition-all duration-300 ease-in-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 sm:px-6 pb-4 sm:pb-5 text-gray-400 text-sm leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
