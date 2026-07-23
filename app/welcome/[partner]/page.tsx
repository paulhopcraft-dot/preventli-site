import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPartner } from "@/lib/welcome/partners";
import WelcomeHero from "@/components/welcome/WelcomeHero";
import WorkflowMap from "@/components/welcome/WorkflowMap";
import FaqAccordion from "@/components/welcome/FaqAccordion";
import WelcomeFooter from "@/components/welcome/WelcomeFooter";

type Params = { partner: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { partner: slug } = await params;
  const partner = getPartner(slug);

  return {
    title: partner ? `Welcome, ${partner.name}` : "Welcome",
    description: partner
      ? `${partner.name}'s onboarding hub for running checks through Preventli.`
      : undefined,
    // Unlisted page — not part of the public site nav or sitemap.
    robots: { index: false, follow: false },
  };
}

export default async function WelcomePartnerPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { partner: slug } = await params;
  const partner = getPartner(slug);

  if (!partner) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0A1628]">
      <WelcomeHero partner={partner} />
      <WorkflowMap partnerSlug={partner.slug} />
      <FaqAccordion />
      <WelcomeFooter partner={partner} />
    </main>
  );
}
