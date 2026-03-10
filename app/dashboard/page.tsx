import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#0A1628]">
      {/* Header */}
      <header className="bg-[#0A1628]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#00E676] rounded-lg flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0A1628"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <span className="text-white font-bold text-xl">Preventli</span>
            </Link>

            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">
                {user.emailAddresses[0]?.emailAddress}
              </span>
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.firstName || "there"}! 👋
          </h1>
          <p className="text-gray-400">
            Your Preventli dashboard is coming soon. We're building something amazing.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="w-12 h-12 bg-[#00E676]/20 rounded-lg flex items-center justify-center mb-4">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#00E676"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Active Claims</h3>
            <p className="text-gray-400 text-sm">Manage your WorkCover claims</p>
            <div className="mt-4 text-3xl font-bold text-[#00E676]">0</div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Compliance Status</h3>
            <p className="text-gray-400 text-sm">Your WHS compliance rate</p>
            <div className="mt-4 text-3xl font-bold text-blue-400">100%</div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#A78BFA"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Premium Savings</h3>
            <p className="text-gray-400 text-sm">Estimated annual reduction</p>
            <div className="mt-4 text-3xl font-bold text-purple-400">$0</div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="mt-12 bg-gradient-to-r from-[#00E676] to-[#00C060] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-[#0A1628] mb-3">
            Dashboard Coming Soon
          </h2>
          <p className="text-[#0A1628]/80 mb-6 max-w-2xl mx-auto">
            We're building a comprehensive dashboard to help you manage claims, track compliance, and reduce your WorkCover premiums. Stay tuned!
          </p>
          <Link
            href="/#contact"
            className="inline-block bg-[#0A1628] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1a2638] transition-colors"
          >
            Contact Us for Early Access
          </Link>
        </div>
      </main>
    </div>
  );
}
