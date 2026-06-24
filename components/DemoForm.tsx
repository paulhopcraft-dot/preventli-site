"use client";

import { useState, useEffect, useRef } from "react";

const employeeOptions = ["1-10", "11-20", "21-50", "51-100", "101-250", "251-500", "500+"];

type FormState = "idle" | "loading" | "success" | "error";

export default function DemoForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [employees, setEmployees] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !company.trim() || !employees) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid work email.");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          employees,
          message: "Demo booking request — /demo landing page",
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setState("success");
    } catch {
      setState("error");
    }
  }

  return (
    <section id="book" className="py-20 bg-[#F8F9FA] scroll-mt-20">
      {/* keep #contact working for navbar links on this page */}
      <span id="contact" aria-hidden="true" />
      <div
        ref={ref}
        className="section-observe max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden border border-gray-100 shadow-xl bg-white">
          {/* Left: what happens next */}
          <div className="bg-[#0A1628] p-8 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Book your walkthrough
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              Four fields. Thirty minutes. You&apos;ll know if this fits.
            </p>
            <ul className="space-y-4">
              {[
                "We reply within one business day to lock a time",
                "Tell us your industry — we prep matching scenarios",
                "Bring a live case if you want it run through the platform",
                "No lock-in contracts, no credit card, no pressure",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-300">
                  <svg className="flex-shrink-0 mt-0.5" width="16" height="16" fill="none" stroke="#9CB81E" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 pt-6 border-t border-white/10 text-sm text-gray-400">
              Prefer email?{" "}
              <a href="mailto:lisah@preventli.ai" className="text-[#9CB81E] hover:underline">
                lisah@preventli.ai
              </a>
            </div>
          </div>

          {/* Right: form */}
          <div className="p-8 sm:p-10">
            {state === "success" ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className="w-16 h-16 bg-[#9CB81E]/10 rounded-full flex items-center justify-center mb-6">
                  <svg width="32" height="32" fill="none" stroke="#9CB81E" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#0A1628] mb-3">
                  Demo request received
                </h3>
                <p className="text-gray-500">
                  We&apos;ll be in touch within one business day to lock in a
                  time. Check your inbox for a confirmation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="demo-name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Full name
                  </label>
                  <input
                    id="demo-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full rounded-xl px-4 py-3 text-sm border border-gray-200 bg-white transition-colors focus:outline-none focus:border-[#9CB81E]"
                  />
                </div>
                <div>
                  <label htmlFor="demo-email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Work email
                  </label>
                  <input
                    id="demo-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@company.com.au"
                    className="w-full rounded-xl px-4 py-3 text-sm border border-gray-200 bg-white transition-colors focus:outline-none focus:border-[#9CB81E]"
                  />
                </div>
                <div>
                  <label htmlFor="demo-company" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Company
                  </label>
                  <input
                    id="demo-company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Acme Pty Ltd"
                    className="w-full rounded-xl px-4 py-3 text-sm border border-gray-200 bg-white transition-colors focus:outline-none focus:border-[#9CB81E]"
                  />
                </div>
                <div>
                  <label htmlFor="demo-employees" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Number of employees
                  </label>
                  <select
                    id="demo-employees"
                    value={employees}
                    onChange={(e) => setEmployees(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-sm border border-gray-200 bg-white transition-colors focus:outline-none focus:border-[#9CB81E] cursor-pointer"
                  >
                    <option value="">Select employee count</option>
                    {employeeOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt} employees
                      </option>
                    ))}
                  </select>
                </div>

                {(error || state === "error") && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
                    {error || (
                      <>
                        Something went wrong. Please try again or email{" "}
                        <a href="mailto:lisah@preventli.ai" className="underline">lisah@preventli.ai</a>
                      </>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="w-full bg-[#9CB81E] text-[#0A1628] py-4 px-6 rounded-xl font-bold text-sm hover:bg-[#86A516] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {state === "loading" ? "Sending…" : "Book my 30-minute demo"}
                </button>

                <p className="text-gray-400 text-xs text-center">
                  By submitting, you agree to our privacy policy. We don&apos;t
                  share your data.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
