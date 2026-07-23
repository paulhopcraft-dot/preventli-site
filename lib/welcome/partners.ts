// Partner registry for the /welcome/[partner] onboarding hub.
//
// Add a new partner here to get a fully working onboarding page at
// /welcome/<slug> — nothing else in this feature is partner-specific.

export type PartnerConfig = {
  slug: string;
  /** Display name, e.g. "WorkBetter" */
  name: string;
  /** Path under /public for the partner's logo. */
  logoSrc: string;
  logoAlt: string;
};

const PARTNERS: Record<string, PartnerConfig> = {
  workbetter: {
    slug: "workbetter",
    name: "WorkBetter",
    logoSrc: "/partners/workbetter-logo.jpg",
    logoAlt: "WorkBetter logo",
  },
};

/** Returns the partner config for a slug, or null if the partner is unknown. */
export function getPartner(slug: string): PartnerConfig | null {
  return PARTNERS[slug.toLowerCase()] ?? null;
}

export function getAllPartnerSlugs(): string[] {
  return Object.keys(PARTNERS);
}
