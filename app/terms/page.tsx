import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Preventli Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <header className="bg-[#0A1628] py-6">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="text-[#00E676] font-bold text-xl">
            ← Back to Preventli
          </Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-[#0A1628] mb-8">
          Terms of Service
        </h1>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-500 mb-8">
            Last updated: {new Date().toLocaleDateString("en-AU")}
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            By using Preventli&apos;s services and website, you agree to these
            Terms of Service. Please read them carefully.
          </p>
          <h2 className="text-2xl font-bold text-[#0A1628] mt-8 mb-4">
            Services
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Preventli provides WorkCover compliance consulting, injury
            prevention programs, and WHS management services to Australian
            businesses. Our services are provided on a subscription basis.
          </p>
          <h2 className="text-2xl font-bold text-[#0A1628] mt-8 mb-4">
            Use of Services
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            You agree to use our services in compliance with all applicable
            Australian laws and regulations. You must not use our services for
            any unlawful purpose.
          </p>
          <h2 className="text-2xl font-bold text-[#0A1628] mt-8 mb-4">
            Disclaimer
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            The savings estimates provided by our calculator are indicative
            only. Actual results depend on your specific circumstances, industry,
            and claims history. Preventli does not guarantee specific premium
            reductions.
          </p>
          <h2 className="text-2xl font-bold text-[#0A1628] mt-8 mb-4">
            Governing Law
          </h2>
          <p className="text-gray-600 leading-relaxed">
            These terms are governed by the laws of Australia. For any
            enquiries, contact{" "}
            <a
              href="mailto:paul@preventli.com.au"
              className="text-[#00E676] underline"
            >
              paul@preventli.com.au
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
