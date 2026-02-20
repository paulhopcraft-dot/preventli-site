"use client";

import { useState, useEffect, useRef } from "react";

type FormData = {
  name: string;
  email: string;
  phone: string;
  company: string;
  employees: string;
  message: string;
};

type FormState = "idle" | "loading" | "success" | "error";

const employeeOptions = [
  "1-10",
  "11-20",
  "21-50",
  "51-100",
  "101-250",
  "251-500",
  "500+",
];

export default function ContactForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    employees: "",
    message: "",
  });
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Partial<FormData>>({});
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

  function validate(): boolean {
    const newErrors: Partial<FormData> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Please enter a valid email";
    if (!form.company.trim()) newErrors.company = "Company is required";
    if (!form.employees) newErrors.employees = "Please select employee count";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }

      setState("success");
      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        employees: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      setState("error");
    }
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  const inputClass = (field: keyof FormData) =>
    `w-full rounded-xl px-4 py-3 text-sm border transition-colors focus:outline-none focus:border-[#00E676] bg-white ${
      errors[field] ? "border-red-400" : "border-gray-200"
    }`;

  return (
    <section id="contact" className="py-20 bg-[#F8F9FA]">
      <div
        ref={ref}
        className="section-observe max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-14">
          <span className="text-[#00E676] text-sm font-semibold uppercase tracking-widest">
            Get in Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1628] mt-3 mb-4">
            Ready to protect your business?
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Talk to our WorkCover specialists today. Free consultation, no
            obligation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Contact details */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-xl font-bold text-[#0A1628] mb-6">
                Contact Information
              </h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#0A1628] rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      stroke="#00E676"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.67 11a19.8 19.8 0 01-3.07-8.67A2 2 0 012.58 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.64a16 16 0 006.29 6.29l.92-.92a2 2 0 012.11-.45c.907.34 1.85.574 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Phone</div>
                    <a
                      href="tel:1800PREVENTLI"
                      className="text-[#0A1628] font-semibold hover:text-[#00E676] transition-colors"
                    >
                      1800 XXX XXX
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#0A1628] rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      stroke="#00E676"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Email</div>
                    <a
                      href="mailto:paul@preventli.com.au"
                      className="text-[#0A1628] font-semibold hover:text-[#00E676] transition-colors"
                    >
                      paul@preventli.com.au
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#0A1628] rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      width="18"
                      height="18"
                      fill="#00E676"
                      viewBox="0 0 24 24"
                    >
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">LinkedIn</div>
                    <a
                      href="https://www.linkedin.com/company/preventli"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0A1628] font-semibold hover:text-[#00E676] transition-colors"
                    >
                      linkedin.com/company/preventli
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Why contact us */}
            <div className="bg-[#0A1628] rounded-2xl p-6">
              <h4 className="text-white font-bold mb-4">
                What happens next?
              </h4>
              <ul className="space-y-3">
                {[
                  "Free 30-min consultation call",
                  "Custom risk assessment report",
                  "Savings estimate for your business",
                  "No lock-in contracts",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="#00E676"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {state === "success" ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-[#00E676]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    width="32"
                    height="32"
                    fill="none"
                    stroke="#00E676"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#0A1628] mb-3">
                  Message received!
                </h3>
                <p className="text-gray-500 mb-6">
                  Thanks for reaching out. We&apos;ll be in touch within one
                  business day.
                </p>
                <button
                  onClick={() => setState("idle")}
                  className="text-[#00E676] font-semibold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Jane Smith"
                      className={inputClass("name")}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="jane@company.com.au"
                      className={inputClass("email")}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="04XX XXX XXX"
                      className={inputClass("phone")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Company <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Acme Pty Ltd"
                      className={inputClass("company")}
                    />
                    {errors.company && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.company}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Number of Employees <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="employees"
                    value={form.employees}
                    onChange={handleChange}
                    className={`${inputClass("employees")} cursor-pointer`}
                  >
                    <option value="">Select employee count</option>
                    {employeeOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt} employees
                      </option>
                    ))}
                  </select>
                  {errors.employees && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.employees}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your WorkCover situation, current premiums, or any questions you have..."
                    rows={4}
                    className={`${inputClass("message")} resize-none`}
                  />
                </div>

                {state === "error" && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
                    Something went wrong. Please try again or email us directly
                    at paul@preventli.com.au
                  </div>
                )}

                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="w-full bg-[#0A1628] text-white py-4 px-6 rounded-xl font-bold text-sm hover:bg-[#0D1F3C] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {state === "loading" ? (
                    <>
                      <svg
                        className="animate-spin"
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path d="M9 12a3 3 0 116 0 3 3 0 01-6 0z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </>
                  )}
                </button>

                <p className="text-gray-400 text-xs text-center">
                  By submitting, you agree to our privacy policy. We
                  don&apos;t share your data.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
