import type { Metadata } from "next";
import WelcomeHero from "@/components/welcome/WelcomeHero";
import WorkflowMap from "@/components/welcome/WorkflowMap";
import FaqAccordion from "@/components/welcome/FaqAccordion";
import WelcomeFooter from "@/components/welcome/WelcomeFooter";

export const metadata: Metadata = {
  title: "Your Partner Workspace | Preventli",
  description: "Everything you need to run checks through Preventli — start to finish.",
  // Unlisted page — not part of the public site nav or sitemap.
  robots: { index: false, follow: false },
};

export default function PartnerOnboardingPage() {
  return (
    <main className="min-h-screen bg-[#0A1628]">
      <WelcomeHero />
      <WorkflowMap />
      <FaqAccordion />
      <WelcomeFooter />
    </main>
  );
}
