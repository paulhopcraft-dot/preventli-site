// Unit tests for the /start-trial shared org-field gate + Google OAuth URL
// builder. Pure logic, no DOM — mirrors the lib/premium/engine.test.ts
// pattern of testing business logic separately from the page component.

import { describe, it, expect } from "vitest";
import {
  isTrialOrgFieldsValid,
  buildGoogleSignupUrl,
  isPricingTier,
  type TrialOrgFields,
} from "./trial-signup";

const baseEmployerFields: TrialOrgFields = {
  company: "Acme Pty Ltd",
  orgKind: "employer",
  employeeCount: "1-10",
};

const basePartnerFields: TrialOrgFields = {
  company: "Acme Rehab",
  orgKind: "partner",
  employeeCount: "11-50",
};

describe("isTrialOrgFieldsValid", () => {
  it("passes for a fully filled-in employer path", () => {
    expect(isTrialOrgFieldsValid(baseEmployerFields)).toBe(true);
  });

  it("passes for a fully filled-in partner path", () => {
    expect(isTrialOrgFieldsValid(basePartnerFields)).toBe(true);
  });

  it("fails when company name is blank or whitespace", () => {
    expect(isTrialOrgFieldsValid({ ...baseEmployerFields, company: "" })).toBe(false);
    expect(isTrialOrgFieldsValid({ ...baseEmployerFields, company: "   " })).toBe(false);
  });

  it("fails when org kind hasn't been chosen", () => {
    expect(isTrialOrgFieldsValid({ ...baseEmployerFields, orgKind: "" })).toBe(false);
  });

  // The partner path used to additionally require a business-type dropdown.
  // Removed 2026-07-21 — company + kind + size is now the whole gate, for
  // partners exactly as for employers.
  it("needs nothing beyond company/kind/size on the partner path", () => {
    expect(isTrialOrgFieldsValid(basePartnerFields)).toBe(true);
  });

  it("fails when employee count hasn't been chosen", () => {
    expect(isTrialOrgFieldsValid({ ...baseEmployerFields, employeeCount: "" })).toBe(false);
  });
});

describe("buildGoogleSignupUrl", () => {
  const base = "https://app.preventli.ai/api/auth/google";

  it("returns null when fields are incomplete", () => {
    expect(buildGoogleSignupUrl(base, { ...baseEmployerFields, employeeCount: "" })).toBeNull();
  });

  it("builds an encoded employer URL with no businessType param", () => {
    const url = buildGoogleSignupUrl(base, baseEmployerFields);
    expect(url).not.toBeNull();
    const parsed = new URL(url!);
    expect(parsed.origin + parsed.pathname).toBe(base);
    expect(parsed.searchParams.get("company")).toBe("Acme Pty Ltd");
    expect(parsed.searchParams.get("employeeCount")).toBe("1-10");
    expect(parsed.searchParams.get("kind")).toBe("employer");
    expect(parsed.searchParams.has("businessType")).toBe(false);
  });

  it("builds a partner URL that also carries no businessType param", () => {
    const url = buildGoogleSignupUrl(base, basePartnerFields);
    const parsed = new URL(url!);
    expect(parsed.searchParams.get("kind")).toBe("partner");
    expect(parsed.searchParams.has("businessType")).toBe(false);
  });

  it("trims and URL-encodes special characters in the company name", () => {
    const url = buildGoogleSignupUrl(base, {
      ...baseEmployerFields,
      company: "  Acme & Sons Pty Ltd  ",
    });
    const parsed = new URL(url!);
    expect(parsed.searchParams.get("company")).toBe("Acme & Sons Pty Ltd");
  });

  it("carries a tier param when one is passed", () => {
    const url = buildGoogleSignupUrl(base, baseEmployerFields, "professional");
    const parsed = new URL(url!);
    expect(parsed.searchParams.get("tier")).toBe("professional");
  });

  it("omits the tier param entirely for the generic trial banner (no tier passed)", () => {
    const url = buildGoogleSignupUrl(base, baseEmployerFields);
    const parsed = new URL(url!);
    expect(parsed.searchParams.has("tier")).toBe(false);
  });
});

describe("isPricingTier", () => {
  it("accepts exactly the three real tiers", () => {
    expect(isPricingTier("payg")).toBe(true);
    expect(isPricingTier("starter")).toBe(true);
    expect(isPricingTier("professional")).toBe(true);
  });

  it("rejects null, empty, and anything else — including a tier-shaped typo", () => {
    expect(isPricingTier(null)).toBe(false);
    expect(isPricingTier("")).toBe(false);
    expect(isPricingTier("enterprise")).toBe(false);
    expect(isPricingTier("Professional")).toBe(false); // case-sensitive, matches the URL param exactly
  });
});
