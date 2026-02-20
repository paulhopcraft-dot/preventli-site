import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Preventli Privacy Policy",
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-500 mb-8">
            Last updated: {new Date().toLocaleDateString("en-AU")}
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Preventli (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is
            committed to protecting your privacy. This Privacy Policy explains
            how we collect, use, and safeguard your personal information in
            accordance with the Australian Privacy Act 1988 and the Australian
            Privacy Principles.
          </p>
          <h2 className="text-2xl font-bold text-[#0A1628] mt-8 mb-4">
            Information We Collect
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            When you contact us through our website, we collect: name, email
            address, phone number, company name, and number of employees. This
            information is used solely to respond to your enquiry and provide
            our services.
          </p>
          <h2 className="text-2xl font-bold text-[#0A1628] mt-8 mb-4">
            How We Use Your Information
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>To respond to your enquiries</li>
            <li>To provide our WorkCover and WHS compliance services</li>
            <li>To send relevant information about our services</li>
            <li>To improve our website and services</li>
          </ul>
          <h2 className="text-2xl font-bold text-[#0A1628] mt-8 mb-4">
            Data Storage
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Your data is stored securely using Supabase, an enterprise-grade
            database platform. We do not sell or share your personal information
            with third parties except as required to deliver our services.
          </p>
          <h2 className="text-2xl font-bold text-[#0A1628] mt-8 mb-4">
            Contact
          </h2>
          <p className="text-gray-600 leading-relaxed">
            For privacy-related enquiries, contact us at{" "}
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
