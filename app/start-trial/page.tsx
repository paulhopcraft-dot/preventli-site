"use client";

import { useState } from "react";
import Link from "next/link";

const APP_SIGNUP_URL = "https://app.preventli.ai/api/public/signup";
const APP_GOOGLE_OAUTH_URL = "https://app.preventli.ai/api/auth/google";
const APP_URL = "https://app.preventli.ai";

type FormState = "idle" | "loading" | "success" | "error";

export default function StartTrialPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !company.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid work email.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setState("loading");
    try {
      const res = await fetch(APP_SIGNUP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Signup failed");
      }

      setState("success");
      window.location.href = APP_URL;
    } catch (err) {
      setState("error");
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="text-2xl font-bold text-[#0A1628]">
              Prevent<span className="text-[#8DC63F]">li</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1628] mb-2">
            Start your 14-day free trial
          </h1>
          <p className="text-gray-500 text-sm">
            No credit card. Full system access for 14 days, plus 1 free report of each check type.
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-8 sm:p-10">
          <a
            href={APP_GOOGLE_OAUTH_URL}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 px-6 text-sm font-semibold text-[#0A1628] hover:bg-gray-50 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A10.99 10.99 0 0012 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09A6.6 6.6 0 015.5 12c0-.73.13-1.43.34-2.09V7.06H2.18A10.99 10.99 0 001 12c0 1.77.43 3.45 1.18 4.94l3.66-2.85z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85C6.71 7.31 9.14 5.38 12 5.38z"
              />
            </svg>
            Sign in with Google
          </a>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 uppercase tracking-wide">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {state === "success" ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-[#8DC63F]/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg width="28" height="28" fill="none" stroke="#8DC63F" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#0A1628] mb-2">
                You&apos;re in
              </h3>
              <p className="text-gray-500 text-sm">Taking you to Preventli now…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="trial-name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Full name
                </label>
                <input
                  id="trial-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full rounded-xl px-4 py-3 text-sm border border-gray-200 bg-white transition-colors focus:outline-none focus:border-[#8DC63F]"
                />
              </div>
              <div>
                <label htmlFor="trial-email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Work email
                </label>
                <input
                  id="trial-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@company.com.au"
                  className="w-full rounded-xl px-4 py-3 text-sm border border-gray-200 bg-white transition-colors focus:outline-none focus:border-[#8DC63F]"
                />
              </div>
              <div>
                <label htmlFor="trial-company" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Company
                </label>
                <input
                  id="trial-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Pty Ltd"
                  className="w-full rounded-xl px-4 py-3 text-sm border border-gray-200 bg-white transition-colors focus:outline-none focus:border-[#8DC63F]"
                />
              </div>
              <div>
                <label htmlFor="trial-password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <input
                  id="trial-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl px-4 py-3 text-sm border border-gray-200 bg-white transition-colors focus:outline-none focus:border-[#8DC63F]"
                />
              </div>

              {(error || state === "error") && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
                  {error || "Something went wrong. Please try again."}
                </div>
              )}

              <button
                type="submit"
                disabled={state === "loading"}
                className="w-full bg-[#8DC63F] text-[#0A1628] py-4 px-6 rounded-xl font-bold text-sm hover:bg-[#00C060] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {state === "loading" ? "Creating your account…" : "Start 14-day free trial"}
              </button>

              <p className="text-gray-400 text-xs text-center">
                By signing up, you agree to our{" "}
                <a href="/terms" className="text-[#8DC63F] hover:underline">terms</a> and{" "}
                <a href="/privacy" className="text-[#8DC63F] hover:underline">privacy policy</a>.
              </p>
            </form>
          )}
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <a href="https://app.preventli.ai/login" className="text-[#8DC63F] hover:underline font-medium">
            Log in
          </a>
        </p>
      </div>
    </main>
  );
}
