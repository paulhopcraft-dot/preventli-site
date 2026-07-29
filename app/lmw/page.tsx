import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Preventli for Lower Murray Water & IWN",
  description: "Materials prepared for Lower Murray Water and the Intelligent Water Networks program.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LMWIWNPage() {
  return (
    <main className="bg-[#0A1628] min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="hero-grid pt-36 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#00E676] text-sm font-semibold tracking-wide uppercase mb-4">
            Prepared for Lower Murray Water &amp; Intelligent Water Networks
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
            Preventli, built on what{" "}
            <span className="gradient-text">Lower Murray Water</span> has
            already proven
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            The case study — what Lower Murray Water has already proven,
            in one place.
          </p>
        </div>
      </section>

      {/* Video */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <video
              controls
              preload="metadata"
              className="w-full h-auto block"
              poster=""
            >
              <source src="/lmw/preventli-lmw-case-study.mp4" type="video/mp4" />
            </video>
          </div>
          <p className="text-gray-500 text-sm text-center mt-4">
            Preventli + Lower Murray Water — the case study.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
