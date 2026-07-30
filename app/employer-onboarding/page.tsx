import type { Metadata } from "next";
import WelcomeHero from "@/components/welcome/WelcomeHero";
import WorkflowMap from "@/components/welcome/WorkflowMap";
import FaqAccordion from "@/components/welcome/FaqAccordion";
import WelcomeFooter from "@/components/welcome/WelcomeFooter";
import { EMPLOYER_MAP, EMPLOYER_CHAPTERS, EMPLOYER_FAQ } from "@/lib/welcome/employer";

export const metadata: Metadata = {
  // The root layout's title template appends "| Preventli".
  title: "Your Preventli Workspace",
  description: "Everything you need to run checks through Preventli — start to finish.",
  // Unlisted page — not part of the public site nav or sitemap.
  robots: { index: false, follow: false },
};

export default function EmployerOnboardingPage() {
  return (
    <main className="min-h-screen bg-[#0A1628]">
      <WelcomeHero workspaceLine="This is your workspace." />
      <WorkflowMap config={EMPLOYER_MAP} chapters={EMPLOYER_CHAPTERS} />
      <FaqAccordion items={EMPLOYER_FAQ} />
      <WelcomeFooter />
    </main>
  );
}
