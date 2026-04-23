import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Preventli Terms of Service — subscription terms, acceptable use, and governing law for Australia's AI-powered WorkCover platform.",
};

const EFFECTIVE_DATE = "1 May 2026";

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
        <h1 className="text-4xl font-bold text-[#0A1628] mb-2">Terms of Service</h1>
        <p className="text-gray-400 mb-10 text-sm">Effective date: {EFFECTIVE_DATE}</p>

        <div className="space-y-10 text-gray-600 leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="text-xl font-bold text-[#0A1628] mb-3">1. About These Terms</h2>
            <p>
              These Terms of Service (<strong>&quot;Terms&quot;</strong>) form a legally binding agreement between
              Preventli Pty Ltd (ABN to be inserted) (<strong>&quot;Preventli&quot;</strong>,{" "}
              <strong>&quot;we&quot;</strong>, <strong>&quot;us&quot;</strong>, <strong>&quot;our&quot;</strong>) and the
              organisation or individual (<strong>&quot;Customer&quot;</strong>, <strong>&quot;you&quot;</strong>,{" "}
              <strong>&quot;your&quot;</strong>) accessing or using the Preventli platform and associated services.
            </p>
            <p className="mt-3">
              By creating an account, submitting a contact form, or otherwise using the Preventli platform, you
              confirm that you have read, understood, and agree to be bound by these Terms and our{" "}
              <Link href="/privacy" className="text-[#00E676] underline">Privacy Policy</Link>.
            </p>
            <p className="mt-3">
              If you are accepting these Terms on behalf of an organisation, you represent and warrant that you
              have authority to bind that organisation to these Terms.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-bold text-[#0A1628] mb-3">2. The Services</h2>
            <p>
              Preventli provides a cloud-based software platform (<strong>&quot;Platform&quot;</strong>) that offers:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-3">
              <li>WorkCover case management and return-to-work (RTW) planning tools</li>
              <li>AI-powered RTW plan generation from uploaded medical certificates</li>
              <li>Pre-employment health assessment management</li>
              <li>Compliance dashboards, audit trails, and document storage</li>
              <li>Notifications, task management, and reporting features</li>
            </ul>
            <p className="mt-3">
              The Platform is provided on a software-as-a-service (SaaS) basis. We may update, modify, or
              discontinue features with reasonable notice. We will endeavour to maintain core functionality
              throughout your subscription term.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-bold text-[#0A1628] mb-3">3. Subscription Plans and Fees</h2>
            <h3 className="font-semibold text-[#0A1628] mb-2">a) Plans</h3>
            <p>We offer the following subscription plans (fees in AUD, inclusive of GST unless otherwise stated):</p>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-[#0A1628]">Plan</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-[#0A1628]">Price</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-[#0A1628]">Inclusions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 font-medium">Starter</td>
                    <td className="border border-gray-200 px-4 py-2">Free</td>
                    <td className="border border-gray-200 px-4 py-2">1 user, up to 3 active cases</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2 font-medium">Professional</td>
                    <td className="border border-gray-200 px-4 py-2">$299/month AUD</td>
                    <td className="border border-gray-200 px-4 py-2">Unlimited cases, AI RTW plans, pre-employment assessments, up to 5 users</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 font-medium">Enterprise</td>
                    <td className="border border-gray-200 px-4 py-2">$799/month AUD</td>
                    <td className="border border-gray-200 px-4 py-2">Unlimited users, custom SLA, enterprise SSO, dedicated support</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              All fees are quoted in Australian dollars (AUD) and include GST where applicable under the{" "}
              <em>A New Tax System (Goods and Services Tax) Act 1999</em> (Cth).
            </p>
            <h3 className="font-semibold text-[#0A1628] mb-2 mt-4">b) Billing</h3>
            <p>
              Paid subscriptions are billed monthly in advance. Invoices are issued electronically. Payment is
              due within 14 days of invoice date. We reserve the right to suspend access to the Platform if
              payment is overdue by more than 14 days.
            </p>
            <h3 className="font-semibold text-[#0A1628] mb-2 mt-4">c) Price Changes</h3>
            <p>
              We may adjust our pricing with at least 30 days&apos; written notice to existing subscribers.
              Continued use of the Platform after the effective date constitutes acceptance of the new pricing.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-bold text-[#0A1628] mb-3">4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside space-y-1 mt-3">
              <li>Use the Platform for any unlawful purpose or in breach of Australian law</li>
              <li>Upload or transmit malicious code, viruses, or any content that could harm the Platform or other users</li>
              <li>Attempt to gain unauthorised access to any part of the Platform or its underlying systems</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Platform</li>
              <li>Resell, sublicense, or commercially exploit the Platform without our express written consent</li>
              <li>Use the Platform to process personal information in breach of the <em>Privacy Act 1988</em> (Cth)</li>
              <li>Misrepresent health assessment outcomes or WorkCover claim information</li>
              <li>Circumvent usage limits applicable to your subscription plan</li>
            </ul>
            <p className="mt-3">
              We reserve the right to suspend or terminate your account if we reasonably believe a breach of
              acceptable use has occurred.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-bold text-[#0A1628] mb-3">5. Account Registration and Security</h2>
            <p>
              You are responsible for maintaining the confidentiality of your login credentials and for all
              activity that occurs under your account. You must notify us immediately at{" "}
              <a href="mailto:support@preventli.ai" className="text-[#00E676] underline">
                support@preventli.ai
              </a>{" "}
              if you suspect unauthorised access to your account.
            </p>
            <p className="mt-3">
              Each user account must correspond to a single individual. Sharing credentials between multiple
              individuals is not permitted and may result in account suspension.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-bold text-[#0A1628] mb-3">6. Data and Privacy</h2>
            <p>
              Your use of the Platform is also governed by our{" "}
              <Link href="/privacy" className="text-[#00E676] underline">Privacy Policy</Link>, which is incorporated
              into these Terms by reference. You acknowledge that you have read and understood our Privacy Policy.
            </p>
            <p className="mt-3">
              As a Customer, you are the data controller for personal information of your workers, candidates,
              and staff entered into the Platform. You warrant that you have obtained all necessary consents and
              authorisations to provide that information to us for the purposes described in our Privacy Policy.
            </p>
            <p className="mt-3">
              We act as a data processor on your behalf for that personal information and will handle it in
              accordance with the Australian Privacy Principles (APPs) under the <em>Privacy Act 1988</em> (Cth).
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-bold text-[#0A1628] mb-3">7. Intellectual Property</h2>
            <p>
              The Platform, including all software, design, content, trademarks, and documentation, is owned
              by or licensed to Preventli Pty Ltd. Nothing in these Terms grants you any rights in our
              intellectual property except the limited licence to use the Platform as set out in these Terms.
            </p>
            <p className="mt-3">
              You retain ownership of all data and content you upload to the Platform
              (<strong>&quot;Customer Data&quot;</strong>). You grant us a limited, non-exclusive licence to process
              Customer Data for the purpose of providing the Services to you.
            </p>
            <p className="mt-3">
              AI-generated RTW plans and outputs produced by the Platform are provided as tools to assist
              decision-making. They do not constitute legal, medical, or professional advice and remain subject
              to your professional judgement and applicable law.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-bold text-[#0A1628] mb-3">8. Disclaimers and Limitation of Liability</h2>
            <h3 className="font-semibold text-[#0A1628] mb-2">a) Disclaimer</h3>
            <p>
              The Platform is provided &quot;as is&quot; and &quot;as available.&quot; To the extent permitted by law, we disclaim
              all warranties, express or implied, including warranties of merchantability, fitness for a
              particular purpose, and non-infringement.
            </p>
            <p className="mt-3">
              We do not warrant that: (i) the Platform will be uninterrupted or error-free; (ii) AI-generated
              RTW plans will be complete, accurate, or suitable for your specific circumstances; or (iii) any
              particular WorkCover outcome will result from use of the Platform.
            </p>
            <h3 className="font-semibold text-[#0A1628] mb-2 mt-4">b) Limitation of Liability</h3>
            <p>
              To the maximum extent permitted by the <em>Australian Consumer Law</em> (Schedule 2,{" "}
              <em>Competition and Consumer Act 2010</em>) and other applicable law, our aggregate liability to you
              for any claims arising from or related to these Terms or the Platform is limited to the total
              fees paid by you to us in the 3 months immediately preceding the event giving rise to the claim.
            </p>
            <p className="mt-3">
              We are not liable for any indirect, consequential, special, incidental, or punitive damages,
              including loss of profits, loss of data, or business interruption.
            </p>
            <h3 className="font-semibold text-[#0A1628] mb-2 mt-4">c) Australian Consumer Law</h3>
            <p>
              Nothing in these Terms excludes, restricts, or modifies any rights or remedies you may have under
              the Australian Consumer Law that cannot be excluded, restricted, or modified by contract.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-bold text-[#0A1628] mb-3">9. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Preventli Pty Ltd and its officers, directors,
              employees, and agents from and against any claims, liabilities, damages, and costs (including
              reasonable legal fees) arising from: (i) your use of the Platform in breach of these Terms;
              (ii) your violation of any applicable law or third-party right; or (iii) Customer Data you upload
              that infringes any third-party right or violates any law.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-bold text-[#0A1628] mb-3">10. Term and Termination</h2>
            <h3 className="font-semibold text-[#0A1628] mb-2">a) Term</h3>
            <p>
              These Terms commence on the date you first access the Platform and continue until your
              subscription is terminated.
            </p>
            <h3 className="font-semibold text-[#0A1628] mb-2 mt-4">b) Termination by You</h3>
            <p>
              You may cancel your subscription at any time by contacting us at{" "}
              <a href="mailto:support@preventli.ai" className="text-[#00E676] underline">
                support@preventli.ai
              </a>
              . Cancellation takes effect at the end of the current billing period. No refunds are provided for
              unused portions of a billing period.
            </p>
            <h3 className="font-semibold text-[#0A1628] mb-2 mt-4">c) Termination by Us</h3>
            <p>
              We may suspend or terminate your account immediately if: (i) you breach these Terms and fail to
              remedy the breach within 7 days of notice; (ii) you become insolvent or enter administration;
              or (iii) we reasonably determine that continued access poses a security or legal risk.
            </p>
            <h3 className="font-semibold text-[#0A1628] mb-2 mt-4">d) Effect of Termination</h3>
            <p>
              On termination, your right to access the Platform ceases. We will retain Customer Data for 30
              days following termination, during which time you may request an export. After 30 days,
              Customer Data will be deleted or de-identified, subject to any legal retention obligations.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-bold text-[#0A1628] mb-3">11. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. We will provide at least 14 days&apos; notice of
              material changes via email to the primary account holder or via a prominent notice on the
              Platform. Continued use of the Platform after the effective date of changes constitutes
              acceptance of the updated Terms.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl font-bold text-[#0A1628] mb-3">12. General</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Governing Law:</strong> These Terms are governed by the laws of Victoria, Australia.
                Both parties submit to the non-exclusive jurisdiction of the courts of Victoria.
              </li>
              <li>
                <strong>Entire Agreement:</strong> These Terms and our Privacy Policy constitute the entire
                agreement between you and Preventli with respect to the Platform and supersede all prior
                agreements.
              </li>
              <li>
                <strong>Severability:</strong> If any provision of these Terms is held to be invalid or
                unenforceable, the remaining provisions continue in full force and effect.
              </li>
              <li>
                <strong>Waiver:</strong> Failure to enforce any provision of these Terms does not constitute a
                waiver of our rights to enforce that provision in the future.
              </li>
              <li>
                <strong>Assignment:</strong> You may not assign your rights under these Terms without our
                prior written consent. We may assign our rights to a successor entity in connection with a
                merger, acquisition, or sale of assets.
              </li>
              <li>
                <strong>No Partnership:</strong> Nothing in these Terms creates a partnership, joint venture,
                employment, or agency relationship between you and Preventli.
              </li>
            </ul>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-xl font-bold text-[#0A1628] mb-3">13. Contact Us</h2>
            <p>For any questions about these Terms:</p>
            <div className="mt-3 bg-white border border-gray-200 rounded-xl p-6">
              <p className="font-semibold text-[#0A1628]">Preventli Pty Ltd</p>
              <p className="mt-1">
                Email:{" "}
                <a href="mailto:legal@preventli.ai" className="text-[#00E676] underline">
                  legal@preventli.ai
                </a>
              </p>
              <p className="mt-1">Website: preventli.ai</p>
              <p className="mt-1">Australia</p>
            </div>
          </section>

        </div>
      </main>

      <footer className="border-t border-gray-200 py-8 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-400">
          <Link href="/privacy" className="hover:text-[#00E676] mr-6">Privacy Policy</Link>
          <Link href="/" className="hover:text-[#00E676]">Back to Preventli</Link>
        </div>
      </footer>
    </div>
  );
}
