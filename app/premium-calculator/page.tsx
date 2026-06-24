import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Calculator from "@/components/premium-calculator/Calculator";

// SEO target: "WorkCover premium calculator Victoria" (spec §6).
export const metadata: Metadata = {
  title: "WorkCover Premium Calculator Victoria",
  description:
    "Free WorkCover premium calculator for Victorian businesses. Estimate your annual WorkSafe premium from your wages and industry, and see how managing claims could lower it. For illustration purposes only — not an official WorkSafe quote.",
  keywords: [
    "WorkCover premium calculator Victoria",
    "WorkSafe premium calculator",
    "WorkCover premium estimate",
    "WorkCover premium reduction",
    "Victoria WorkCover calculator",
  ],
  alternates: { canonical: "/premium-calculator" },
  openGraph: {
    type: "website",
    title: "WorkCover Premium Calculator Victoria | Preventli",
    description:
      "Estimate your Victorian WorkCover premium and see how managing claims could lower it.",
  },
};

export default function PremiumCalculatorPage() {
  return (
    <main className="bg-[#F8F9FA]">
      <Navbar />

      {/* ---- Hero (dark, so the transparent fixed navbar reads on light pages) ---- */}
      <header className="bg-[#0A1628] pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs uppercase tracking-widest text-[#00E676] font-semibold">
            WorkCover Victoria
          </p>
          <h1 className="mt-3 text-3xl sm:text-5xl font-bold text-white leading-tight">
            WorkCover Premium Calculator
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
            Estimate your annual WorkSafe Victoria premium from your wages and
            industry — then see how managing claims well could bring it down.
          </p>
          <p className="mt-4 text-sm text-gray-400">
            30 years of WorkCover expertise. 3,000+ cases managed.
          </p>
        </div>
      </header>

      {/* ---- Calculator ---- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Calculator />
      </section>

      {/* ---- Persistent fine print: canonical disclaimer + 40% asterisk (§6/§8a) ---- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="space-y-3 text-xs text-gray-400 leading-relaxed border-t border-gray-200 pt-8">
          <p>
            <sup>*</sup> Up to 40% lower claims cost — based on employers who
            already carry meaningful claims costs (a claims history above their
            industry rate). The further above the industry benchmark you sit,
            the greater the potential saving; lower claims cost then flows
            through to a lower premium (typically a smaller percentage, scaled
            by your size). Employers already at or below their industry rate, and
            small employers on the flat rate, will see less. Enter your figures
            for your own estimate.
          </p>
          <p>
            For illustration purposes only. This is an indicative estimate based
            on gazetted 2025-26 industry rates and a simplified single-year
            calculation — it is not an official WorkSafe premium quote. Your
            actual premium is determined by WorkSafe Victoria and depends on your
            full claims history, remuneration and workplace details.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
