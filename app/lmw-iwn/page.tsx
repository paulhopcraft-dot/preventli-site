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

const BROCHURES = [
  {
    slug: "pre-employment",
    title: "Pre-Employment Screening",
    description:
      "What Preventli's pre-employment product covers, built for IWN water authorities.",
    file: "/lmw/preventli-iwn-pre-employment-brochure.pdf",
  },
  {
    slug: "full-services",
    title: "Preventli for IWN",
    description:
      "Pre-employment, exit checks, and hazard & incident management — the full picture for IWN.",
    file: "/lmw/preventli-iwn-services-brochure.pdf",
  },
];

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
            The case study, and the two brochures covering pre-employment
            screening and the full IWN picture — everything from today&apos;s
            email, in one place.
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

      {/* Brochures */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Brochures
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {BROCHURES.map((b) => (
              <a
                key={b.slug}
                href={b.file}
                target="_blank"
                rel="noopener noreferrer"
                className="card-hover block bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#00E676]/50"
              >
                <div className="w-10 h-10 bg-[#00E676]/15 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="#00E676"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {b.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {b.description}
                </p>
                <span className="text-[#00E676] text-sm font-medium mt-4 inline-block">
                  Download PDF →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
