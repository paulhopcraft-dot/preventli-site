import Image from "next/image";
import type { PartnerConfig } from "@/lib/welcome/partners";

export default function WelcomeFooter({ partner }: { partner: PartnerConfig }) {
  return (
    <footer className="bg-[#0A1628] border-t border-white/10 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="flex items-center justify-center gap-5 mb-8">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-white flex items-center justify-center shrink-0">
            <Image
              src={partner.logoSrc}
              alt={partner.logoAlt}
              width={56}
              height={56}
              className="object-contain w-full h-full"
            />
          </div>
          <span className="text-white/30 text-2xl">×</span>
          <div className="w-14 h-14 rounded-xl bg-[#00E676] flex items-center justify-center shrink-0">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0A1628" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </div>
        </div>

        <h3 className="text-white text-xl font-bold mb-2">
          {partner.name} × Prevent<span className="text-[#00E676]">li</span>
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          Bookmark this page — it&apos;s here whenever you need a refresher.
        </p>
        <a
          href="mailto:support@preventli.ai"
          className="inline-flex items-center gap-2 text-[#00E676] hover:text-[#00C060] font-medium text-sm transition-colors"
        >
          support@preventli.ai
        </a>
      </div>
    </footer>
  );
}
