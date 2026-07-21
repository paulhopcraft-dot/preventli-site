// Shared org-info fields collected before either /start-trial signup path
// (Google OAuth or email/password) is allowed to proceed. The internal field
// name orgKind is UI-local; the wire key sent to the app-side signup endpoint
// (app.preventli.ai) is `kind` — see buildGoogleSignupUrl and the fetch body
// in app/start-trial/page.tsx. Do not reshape the wire keys without updating
// shared/signupFields.ts on the app side too.
//
// Removed 2026-07-21: a partner "business type" dropdown that was mandatory
// whenever orgKind === "partner". Nothing on the app side ever read the value,
// and its fixed option list didn't describe real prospects — so it was pure
// friction on the highest-value signup segment. orgKind itself stays: it
// genuinely drives the partner workspace + client picker.

export type EmployeeCountBand = "1-10" | "11-50" | "51-200" | "201-500" | "500+";

export const EMPLOYEE_COUNT_OPTIONS: { value: EmployeeCountBand; label: string }[] = [
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-500", label: "201–500 employees" },
  { value: "500+", label: "500+ employees" },
];

export type OrgKind = "employer" | "partner";

export interface TrialOrgFields {
  company: string;
  orgKind: OrgKind | "";
  employeeCount: EmployeeCountBand | "";
}

/**
 * True once company name, org kind, and employee count are all filled in.
 * This is the shared gate for both signup paths — the Google button and the
 * email/password submit handler both call this before proceeding.
 */
export function isTrialOrgFieldsValid(fields: TrialOrgFields): boolean {
  if (!fields.company.trim()) return false;
  if (fields.orgKind !== "employer" && fields.orgKind !== "partner") return false;
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
    kind: fields.orgKind,
  });

  return `${baseUrl}?${params.toString()}`;
}
