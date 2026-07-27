// Password policy for /start-trial — a MIRROR of the app-side source of truth.
//
// Canonical definition: shared/passwordPolicy.ts in the preventli app repo
// (D:\dev\preventli), which server/routes/public-signup.ts enforces on every
// POST to https://app.preventli.ai/api/public/signup. That is a separate repo
// and a separate deploy, so this file cannot import it — it is kept in step by
// hand, exactly like lib/trial-signup.ts mirrors shared/signupFields.ts.
// If you change a rule here, change it there too.
//
// Why this file exists (reproduced live 2026-07-27): the form used to apply a
// single rule — password.length >= 8 — and its hint read "At least 8
// characters". The server required five. An 8-character lowercase password
// therefore passed the form, was posted, and came back "Bad Request" with no
// reason shown. Paul hit it twice trying to sign up for his own trial.
//
// Drift safety net: the page also renders the server's `details` array on a
// 400 (see app/start-trial/page.tsx). So if this mirror ever falls behind the
// server, the worst case is a submit that fails with the real reason spelled
// out — not a dead end.

export const PASSWORD_MIN_LENGTH = 8;

export type PasswordRuleId =
  | "length"
  | "uppercase"
  | "lowercase"
  | "digit"
  | "special";

export interface PasswordRule {
  id: PasswordRuleId;
  /** Short affirmative phrasing, shown as a checklist while the user types. */
  label: string;
  /** Full sentence — matches the server's rejection wording verbatim. */
  error: string;
  test: (password: string) => boolean;
}

/** The character class the server counts as "special". */
const SPECIAL_CHARACTERS = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

export const PASSWORD_RULES: readonly PasswordRule[] = [
  {
    id: "length",
    label: `At least ${PASSWORD_MIN_LENGTH} characters`,
    error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`,
    test: (p) => p.length >= PASSWORD_MIN_LENGTH,
  },
  {
    id: "uppercase",
    label: "One uppercase letter",
    error: "Password must contain at least one uppercase letter",
    test: (p) => /[A-Z]/.test(p),
  },
  {
    id: "lowercase",
    label: "One lowercase letter",
    error: "Password must contain at least one lowercase letter",
    test: (p) => /[a-z]/.test(p),
  },
  {
    id: "digit",
    label: "One number",
    error: "Password must contain at least one digit",
    test: (p) => /[0-9]/.test(p),
  },
  {
    id: "special",
    label: "One special character (!@#$%^&*…)",
    error:
      "Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;':\",./<>?)",
    test: (p) => SPECIAL_CHARACTERS.test(p),
  },
];

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
}

/** Which rules the given password currently satisfies — drives the checklist. */
export function checkPasswordRules(
  password: string,
): { rule: PasswordRule; met: boolean }[] {
  return PASSWORD_RULES.map((rule) => ({ rule, met: rule.test(password) }));
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors = PASSWORD_RULES.filter((rule) => !rule.test(password)).map(
    (rule) => rule.error,
  );

  return { valid: errors.length === 0, errors };
}
