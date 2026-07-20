// Shared org-info fields collected before either /start-trial signup path
// (Google OAuth or email/password) is allowed to proceed. Field names and
// value shapes are a fixed contract with the receiving app-side signup
// endpoint (app.preventli.ai) — do not rename or reshape without updating
// both sides.

export type EmployeeCountBand = "1-10" | "11-50" | "51-200" | "201-500" | "500+";

export const EMPLOYEE_COUNT_OPTIONS: { value: EmployeeCountBand; label: string }[] = [
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-500", label: "201–500 employees" },
  { value: "500+", label: "500+ employees" },
];

export type OrgKind = "employer" | "partner";

export type PartnerBusinessType =
  | "rehabilitation_provider"
  | "rtw_consultancy"
  | "insurer_claims_agency"
  | "eap_provider"
  | "other";

export const PARTNER_BUSINESS_TYPE_OPTIONS: { value: PartnerBusinessType; label: string }[] = [
  { value: "rehabilitation_provider", label: "Rehabilitation provider" },
  { value: "rtw_consultancy", label: "RTW consultancy" },
  { value: "insurer_claims_agency", label: "Insurer or claims agency" },
  { value: "eap_provider", label: "EAP provider" },
  { value: "other", label: "Other" },
];

export interface TrialOrgFields {
  company: string;
  orgKind: OrgKind | "";
  partnerBusinessType: PartnerBusinessType | "";
  employeeCount: EmployeeCountBand | "";
}

/**
 * True once company name, org kind, (partner business type if applicable),
 * and employee count are all filled in. This is the shared gate for both
 * signup paths — the Google button and the email/password submit handler
 * both call this before proceeding.
 */
export function isTrialOrgFieldsValid(fields: TrialOrgFields): boolean {
  if (!fields.company.trim()) return false;
  if (fields.orgKind !== "employer" && fields.orgKind !== "partner") return false;
  if (fields.orgKind === "partner" && !fields.partnerBusinessType) return false;
  if (!fields.employeeCount) return false;
  return true;
}

/**
 * Builds the Google OAuth href carrying the shared org fields as query
 * params. Returns null when the fields aren't valid yet so callers can't
 * accidentally link to an incomplete signup — render a disabled control
 * instead of an <a> when this returns null.
 */
export function buildGoogleSignupUrl(baseUrl: string, fields: TrialOrgFields): string | null {
  if (!isTrialOrgFieldsValid(fields)) return null;

  const params = new URLSearchParams({
    company: fields.company.trim(),
    employeeCount: fields.employeeCount,
    orgKind: fields.orgKind,
  });
  if (fields.orgKind === "partner" && fields.partnerBusinessType) {
    params.set("partnerBusinessType", fields.partnerBusinessType);
  }

  return `${baseUrl}?${params.toString()}`;
}
