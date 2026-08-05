"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  EMPLOYEE_COUNT_OPTIONS,
  isTrialOrgFieldsValid,
  buildGoogleSignupUrl,
  isPricingTier,
  type EmployeeCountBand,
  type OrgKind,
  type TrialOrgFields,
} from "@/lib/trial-signup";
import { checkPasswordRules, validatePassword } from "@/lib/password-policy";
import { readSignupErrorLines, SIGNUP_FALLBACK_ERROR } from "@/lib/signup-error";

const APP_SIGNUP_URL = "https://app.preventli.ai/api/public/signup";
const APP_GOOGLE_OAUTH_URL = "https://app.preventli.ai/api/auth/google";

type FormState = "idle" | "loading" | "success" | "error";

// useSearchParams() requires a Suspense boundary in the App Router (Next.js
// bails out of static rendering otherwise) — the actual page logic lives in
// StartTrialForm below; this default export just supplies that boundary.
export default function StartTrialPage() {
  return (
    <Suspense fallback={null}>
      <StartTrialForm />
    </Suspense>
  );
}

function StartTrialForm() {
  // Which pricing-tier CTA sent the prospect here (?tier=payg|starter|professional
  // on the link from components/Pricing.tsx). Absent = the generic "Start Free
  // Trial" banner — no Stripe step of any kind follows signup in that case.
  const searchParams = useSearchParams();
  const tierParam = searchParams.get("tier");
  const tier = isPricingTier(tierParam) ? tierParam : undefined;

  // Shared org fields — required before either signup path (Google or
  // email/password) can proceed.
  const [company, setCompany] = useState("");
  const [orgKind, setOrgKind] = useState<OrgKind | "">("");
  const [employeeCount, setEmployeeCount] = useState<EmployeeCountBand | "">("");

  // Email/password path fields.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [state, setState] = useState<FormState>("idle");
  // One line per reason. The signup API answers a 400 with a `details` array
  // naming every unmet requirement, and all of them get shown — rendering only
  // the top-level `message` is what made every failure read "Bad Request".
  const [errorLines, setErrorLines] = useState<string[]>([]);

  const orgFields: TrialOrgFields = { company, orgKind, employeeCount };
  const orgFieldsValid = isTrialOrgFieldsValid(orgFields);
  const googleHref = buildGoogleSignupUrl(APP_GOOGLE_OAUTH_URL, orgFields, tier);
  const passwordChecks = checkPasswordRules(password);

  const tierCopy: Record<"payg" | "starter" | "professional", { heading: string; sub: string }> = {
    payg: {
      heading: "Get started — Pay as you go",
      sub: "No monthly fee. After you verify your email, add a card once (nothing is charged now) — you're only billed $49 when a check's report is completed.",
    },
    starter: {
      heading: "Subscribe to Starter — $595/mo",
      sub: "After you verify your email, you'll set up your monthly subscription. Cancel any time.",
    },
    professional: {
      heading: "Subscribe to Professional — $1,199/mo",
      sub: "After you verify your email, you'll set up your monthly subscription. Cancel any time.",
    },
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorLines([]);

    if (!orgFieldsValid) {
      setErrorLines(["Please fill in your company details above first."]);
      return;
    }
    if (!name.trim()) {
      setErrorLines(["Please fill in all fields."]);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorLines(["Please enter a valid work email."]);
      return;
    }
    // Same five rules the server enforces (lib/password-policy.ts mirrors the
    // app's shared/passwordPolicy.ts). Checked here so a password that can't
    // succeed never costs the user a round trip.
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      setErrorLines(passwordCheck.errors);
      return;
    }
    if (password !== confirmPassword) {
      setErrorLines(["Passwords don't match."]);
      return;
    }

    setState("loading");
    try {
      const res = await fetch(APP_SIGNUP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          password,
          employeeCount,
          kind: orgKind,
          tier,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setState("error");
        setErrorLines(readSignupErrorLines(data));
        return;
      }

      setState("success");
    } catch {
      // Network/CORS failure — no response body to explain anything.
      setState("error");
      setErrorLines([SIGNUP_FALLBACK_ERROR]);
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
            {tier ? tierCopy[tier].heading : "Start your 14-day free trial"}
          </h1>
          <p className="text-gray-500 text-sm">
            {tier
              ? tierCopy[tier].sub
              : "No credit card. Full system access for 14 days, plus 1 free report of each check type."}
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-8 sm:p-10">
          {state === "success" ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-[#8DC63F]/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg width="28" height="28" fill="none" stroke="#8DC63F" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              {/* The API returns 202, not a session: the account exists but is
                  unverified until the emailed link is clicked. Sending the
                  browser to app.preventli.ai here just landed people on a login
                  screen they had no password-verified account for yet. */}
              <h3 className="text-lg font-bold text-[#0A1628] mb-2">
                Check your email
              </h3>
              <p className="text-gray-500 text-sm">
                We&apos;ve sent a confirmation link to{" "}
                <span className="font-medium text-[#0A1628]">{email}</span>. Click it to
                activate your account
                {tier === "starter" || tier === "professional"
                  ? " and set up your subscription."
                  : tier === "payg"
                    ? " and add your card."
                    : " and start your trial."}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-5 mb-6">
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
                  <span className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Are you signing up as a single company, or do you manage cases for
                    multiple client companies?
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOrgKind("employer")}
                      aria-pressed={orgKind === "employer"}
                      className={`w-full rounded-xl px-4 py-3 text-sm font-medium border transition-colors text-left ${
                        orgKind === "employer"
                          ? "border-[#8DC63F] bg-[#8DC63F]/10 text-[#0A1628]"
                          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      I manage my own workers
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrgKind("partner")}
                      aria-pressed={orgKind === "partner"}
                      className={`w-full rounded-xl px-4 py-3 text-sm font-medium border transition-colors text-left ${
                        orgKind === "partner"
                          ? "border-[#8DC63F] bg-[#8DC63F]/10 text-[#0A1628]"
                          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      I manage cases for multiple client companies
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="trial-employee-count" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Company size
                  </label>
                  <select
                    id="trial-employee-count"
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(e.target.value as EmployeeCountBand)}
                    className="w-full rounded-xl px-4 py-3 text-sm border border-gray-200 bg-white transition-colors focus:outline-none focus:border-[#8DC63F] cursor-pointer"
                  >
                    <option value="">Select company size</option>
                    {EMPLOYEE_COUNT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {googleHref ? (
                <a
                  href={googleHref}
                  className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 px-6 text-sm font-semibold text-[#0A1628] hover:bg-gray-50 transition-colors"
                >
                  <GoogleIcon />
                  Sign in with Google
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  title="Fill in your company details above first"
                  className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 px-6 text-sm font-semibold text-gray-400 bg-gray-50 cursor-not-allowed"
                >
                  <GoogleIcon dimmed />
                  Sign in with Google
                </button>
              )}

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 uppercase tracking-wide">or</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

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
                  <label htmlFor="trial-password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="trial-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      aria-describedby="trial-password-requirements"
                      className="w-full rounded-xl px-4 py-3 pr-11 text-sm border border-gray-200 bg-white transition-colors focus:outline-none focus:border-[#8DC63F]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                  {/* Shown from the start, not only after a failed submit —
                      these are the exact rules the server enforces. */}
                  <ul
                    id="trial-password-requirements"
                    className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1"
                  >
                    {passwordChecks.map(({ rule, met }) => (
                      <li
                        key={rule.id}
                        className={`flex items-center gap-1.5 text-xs ${
                          met ? "text-[#5A9216]" : "text-gray-400"
                        }`}
                      >
                        <RequirementIcon met={met} />
                        <span>{rule.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <label htmlFor="trial-confirm-password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      id="trial-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      className="w-full rounded-xl px-4 py-3 pr-11 text-sm border border-gray-200 bg-white transition-colors focus:outline-none focus:border-[#8DC63F]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <EyeIcon open={showConfirmPassword} />
                    </button>
                  </div>
                  {confirmPassword.length > 0 && confirmPassword !== password && (
                    <p className="mt-1.5 text-xs text-red-600">Passwords don&apos;t match.</p>
                  )}
                </div>

                {(errorLines.length > 0 || state === "error") && (
                  <div
                    role="alert"
                    className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm"
                  >
                    {errorLines.length > 1 ? (
                      <ul className="list-disc pl-4 space-y-1">
                        {errorLines.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    ) : (
                      errorLines[0] || SIGNUP_FALLBACK_ERROR
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="w-full bg-[#8DC63F] text-[#0A1628] py-4 px-6 rounded-xl font-bold text-sm hover:bg-[#00C060] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {state === "loading"
                    ? "Creating your account…"
                    : tier === "starter" || tier === "professional"
                      ? "Continue to subscription"
                      : tier === "payg"
                        ? "Continue to add card"
                        : "Start 14-day free trial"}
                </button>

                <p className="text-gray-400 text-xs text-center">
                  By signing up, you agree to our{" "}
                  <a href="/terms" className="text-[#8DC63F] hover:underline">terms</a> and{" "}
                  <a href="/privacy" className="text-[#8DC63F] hover:underline">privacy policy</a>.
                </p>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-[#8DC63F] hover:underline font-medium">
            Log in
          </a>
        </p>
      </div>
    </main>
  );
}

/** Tick once a password rule is satisfied, empty circle until then. */
function RequirementIcon({ met }: { met: boolean }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      aria-hidden="true"
      className="shrink-0"
    >
      {met ? (
        <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <circle cx="12" cy="12" r="8" strokeWidth="2" />
      )}
    </svg>
  );
}

/** Eye / eye-off toggle icon for the password reveal buttons. */
function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.7 18.7 0 0 1 5.06-5.94M9.9 4.24A10.4 10.4 0 0 1 12 4c7 0 11 8 11 8a18.7 18.7 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}

function GoogleIcon({ dimmed = false }: { dimmed?: boolean }) {
  if (dimmed) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          className="text-gray-300"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1zM12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A10.99 10.99 0 0012 23zM5.84 14.09A6.6 6.6 0 015.5 12c0-.73.13-1.43.34-2.09V7.06H2.18A10.99 10.99 0 001 12c0 1.77.43 3.45 1.18 4.94l3.66-2.85zM12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85C6.71 7.31 9.14 5.38 12 5.38z"
        />
      </svg>
    );
  }
  return (
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
  );
}
