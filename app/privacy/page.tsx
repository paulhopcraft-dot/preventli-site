import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Preventli Privacy Policy — how we collect, use, and protect your personal and health information under the Australian Privacy Act 1988.",
};

const EFFECTIVE_DATE = "1 May 2026";

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
        <h1 className="text-4xl font-bold text-[#0A1628] mb-2">Privacy Policy</h1>
        <p className="text-gray-400 mb-10 text-sm">Effective date: {EFFECTIVE_DATE}</p>

        <div className="space-y-10 text-gray-600 leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="text-xl font-bold text-[#0A1628] mb-3">1. About This Policy</h2>
            <p>
              Preventli Pty Ltd (ABN to be inserted) (<strong>&quot;Preventli&quot;</strong>, <strong>&quot;we&quot;</strong>,{" "}
              <strong>&quot;us&quot;</strong>, <strong>&quot;our&quot;</strong>) is an Australian company that provides
              WorkCover case management, AI-powered return-to-work planning, and pre-employment health
              assessment software to Australian businesses.
            </p>
            <p className="mt-3">
              This Privacy Policy explains how we handle personal information — including sensitive health
              information — in accordance with the <em>Privacy Act 1988</em> (Cth) and the Australian Privacy
              Principles (APPs). We are also subject to the Notifiable Data Breaches (NDB) scheme.
            </p>
            <p className="mt-3">
              By using our platform or website, you acknowledge that you have read and understood this policy.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-bold text-[#0A1628] mb-3">2. Information We Collect</h2>
            <h3 className="font-semibold text-[#0A1628] mb-2">a) Contact and account information</h3>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Name, email address, phone number</li>
              <li>Company name, ABN, number of employees</li>
              <li>Role or job title</li>
              <li>Username and encrypted password</li>
            </ul>
            <h3 className="font-semibold text-[#0A1628] mb-2">b) WorkCover case data</h3>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Injured worker details (name, date of birth, contact information)</li>
              <li>Injury type, date, and description</li>
              <li>Medical certificates and capacity assessments</li>
              <li>Return-to-work plans and rehabilitation progress notes</li>
              <li>WorkSafe claim numbers and correspondence</li>
            </ul>
            <h3 className="font-semibold text-[#0A1628] mb-2">c) Pre-employment health assessment data</h3>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Candidate name, date of birth, contact details</li>
              <li>Health status responses (musculoskeletal, cardiovascular, vision, hearing)</li>
              <li>Clearance level and medical notes</li>
            </ul>
            <h3 className="font-semibold text-[#0A1628] mb-2">d) Technical and usage data</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>IP address, browser type, device type</li>
              <li>Pages visited, features used, timestamps</li>
              <li>Error and performance logs (via Sentry)</li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-bold text-[#0A1628] mb-3">3. Sensitive Information (Health Data)</h2>
            <p>
              Health information collected through WorkCover case management and pre-employment assessments is{" "}
              <strong>sensitive information</strong> under the Privacy Act. We collect this information only:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-3">
              <li>With the individual&apos;s consent (express or implied), or</li>
              <li>As required or authorised by Australian law (e.g. WorkSafe Victoria obligations)</li>
            </ul>
            <p className="mt-3">
              Health information is never used for direct marketing and is never disclosed to third parties
              except as described in Section 5 or as required by law.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-bold text-[#0A1628] mb-3">4. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Providing, operating, and improving the Preventli platform</li>
              <li>Processing contact form submissions and responding to enquiries</li>
              <li>Generating AI-powered return-to-work plans from uploaded medical certificates</li>
              <li>Sending platform notifications (task reminders, certificate expiry alerts)</li>
              <li>Sending transactional and service emails (onboarding, receipts, support)</li>
              <li>Monitoring platform performance and diagnosing errors</li>
              <li>Complying with legal obligations under WorkSafe Victoria and other applicable laws</li>
            </ul>
            <p className="mt-3">
              We do not sell your personal information to third parties. We do not use personal data for
              automated profiling that produces legal or similarly significant effects without human review.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-bold text-[#0A1628] mb-3">5. Disclosure of Information</h2>
            <p>We may disclose personal information to the following categories of recipients:</p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li>
                <strong>Your employer or organisation</strong> — managers and authorised users within your
                Preventli workspace who have legitimate need to access case data
              </li>
              <li>
                <strong>Our technology sub-processors</strong> — listed in Section 6 below
              </li>
              <li>
                <strong>Regulatory bodies</strong> — WorkSafe Victoria, SafeWork Australia, or other
                authorities where required by law
              </li>
              <li>
                <strong>Legal and professional advisers</strong> — where necessary to protect our legal rights
              </li>
              <li>
                <strong>Business successors</strong> — in the event of a merger, acquisition, or asset sale
                (with notice to affected users)
              </li>
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-bold text-[#0A1628] mb-3">6. Third-Party Sub-Processors</h2>
            <p>
              We engage the following third parties to deliver our services. Each is bound by data processing
              agreements consistent with the APPs:
            </p>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-[#0A1628]">Provider</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-[#0A1628]">Purpose</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-[#0A1628]">Location</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2">Render</td>
                    <td className="border border-gray-200 px-4 py-2">Cloud hosting and PostgreSQL database</td>
                    <td className="border border-gray-200 px-4 py-2">USA (Oregon)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">OpenAI</td>
                    <td className="border border-gray-200 px-4 py-2">AI RTW plan generation (medical certificate processing)</td>
                    <td className="border border-gray-200 px-4 py-2">USA</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2">Resend</td>
                    <td className="border border-gray-200 px-4 py-2">Transactional email delivery</td>
                    <td className="border border-gray-200 px-4 py-2">USA</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">Sentry</td>
                    <td className="border border-gray-200 px-4 py-2">Error monitoring and performance tracking</td>
                    <td className="border border-gray-200 px-4 py-2">USA</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2">Supabase</td>
                    <td className="border border-gray-200 px-4 py-2">Contact form submission storage</td>
                    <td className="border border-gray-200 px-4 py-2">USA</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              Where personal information is disclosed overseas, we take reasonable steps to ensure the
              recipient handles it consistently with the APPs (APP 8).
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-bold text-[#0A1628] mb-3">7. Data Retention</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Active account data</strong> — retained for the duration of your subscription
              </li>
              <li>
                <strong>WorkCover case records</strong> — retained for 7 years after case closure to comply
                with WorkSafe record-keeping obligations
              </li>
              <li>
                <strong>Pre-employment assessment data</strong> — retained for 7 years or as required by
                applicable legislation
              </li>
              <li>
                <strong>Contact form submissions</strong> — retained for 24 months
              </li>
              <li>
                <strong>Error and usage logs</strong> — retained for 90 days
              </li>
            </ul>
            <p className="mt-3">
              On account termination, we will delete or de-identify personal data within 30 days, unless
              longer retention is required by law.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-bold text-[#0A1628] mb-3">8. Security</h2>
            <p>
              We implement reasonable technical and organisational measures to protect personal information,
              including:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-3">
              <li>Encryption in transit (TLS 1.2+) and at rest</li>
              <li>JWT-based authentication with short-lived session tokens</li>
              <li>Role-based access control — users only access data within their organisation</li>
              <li>CSRF protection and rate limiting on all API endpoints</li>
              <li>Security headers (HSTS, CSP, X-Frame-Options) on all responses</li>
              <li>Daily automated database backups with point-in-time recovery</li>
              <li>Error monitoring via Sentry for rapid incident detection</li>
            </ul>
            <p className="mt-3">
              No system is impenetrable. If we discover a data breach that is likely to result in serious harm,
              we will notify the Office of the Australian Information Commissioner (OAIC) and affected
              individuals as required by the NDB scheme.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-bold text-[#0A1628] mb-3">9. Cookies and Tracking</h2>
            <p>
              Our website uses essential cookies for session management and security (CSRF tokens). We do not
              currently use third-party advertising or analytics cookies. Error monitoring via Sentry may
              collect browser session data for debugging purposes.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-bold text-[#0A1628] mb-3">10. Your Rights (APP 12 &amp; 13)</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 mt-3">
              <li>Request access to the personal information we hold about you</li>
              <li>Request correction of inaccurate or incomplete personal information</li>
              <li>Complain about a breach of the APPs (see Section 11)</li>
            </ul>
            <p className="mt-3">
              To make an access or correction request, contact us at{" "}
              <a href="mailto:privacy@preventli.ai" className="text-[#00E676] underline">
                privacy@preventli.ai
              </a>
              . We will respond within 30 days.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-bold text-[#0A1628] mb-3">11. Complaints</h2>
            <p>
              If you believe we have breached the APPs, please contact us first at{" "}
              <a href="mailto:privacy@preventli.ai" className="text-[#00E676] underline">
                privacy@preventli.ai
              </a>
              . We will investigate and respond within 30 days.
            </p>
            <p className="mt-3">
              If you are not satisfied with our response, you may lodge a complaint with the{" "}
              <a
                href="https://www.oaic.gov.au"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00E676] underline"
              >
                Office of the Australian Information Commissioner (OAIC)
              </a>
              .
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl font-bold text-[#0A1628] mb-3">12. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. Material changes will be notified via email to
              registered users or displayed prominently on the platform. Continued use after notification
              constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-xl font-bold text-[#0A1628] mb-3">13. Contact Us</h2>
            <p>
              For any privacy enquiries, access requests, or complaints:
            </p>
            <div className="mt-3 bg-white border border-gray-200 rounded-xl p-6">
              <p className="font-semibold text-[#0A1628]">Preventli Pty Ltd</p>
              <p className="mt-1">
                Email:{" "}
                <a href="mailto:privacy@preventli.ai" className="text-[#00E676] underline">
                  privacy@preventli.ai
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
          <Link href="/terms" className="hover:text-[#00E676] mr-6">Terms of Service</Link>
          <Link href="/" className="hover:text-[#00E676]">Back to Preventli</Link>
        </div>
      </footer>
    </div>
  );
}
