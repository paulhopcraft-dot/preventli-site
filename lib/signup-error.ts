// Reading an error response from the app-side signup API into something a
// human can act on.
//
// The endpoint (POST https://app.preventli.ai/api/public/signup) answers a 400
// with three fields, in increasing order of usefulness:
//
//   { error:   "Bad Request",                                  // HTTP-speak
//     message: "Password does not meet security requirements", // the category
//     details: ["Password must contain at least one digit"] }  // the actual reason
//
// There are two distinct 400s — "Invalid signup details" (field validation) and
// "Password does not meet security requirements" (password policy) — and until
// 2026-07-27 the page rendered `error` for both, so every failure read "Bad
// Request" and the user was told nothing. Always prefer `details`.

/** Generic last resort — used when the response carries nothing readable. */
export const SIGNUP_FALLBACK_ERROR = "Something went wrong. Please try again.";

function nonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

/**
 * Best available explanation for a failed signup, as one line per reason.
 * Never returns an empty array — callers can render the result directly.
 */
export function readSignupErrorLines(payload: unknown): string[] {
  if (payload && typeof payload === "object") {
    const body = payload as Record<string, unknown>;

    if (Array.isArray(body.details)) {
      const lines = body.details
        .map(nonEmptyString)
        .filter((line): line is string => line !== null);
      if (lines.length > 0) return lines;
    }

    const message = nonEmptyString(body.message);
    if (message) return [message];

    const error = nonEmptyString(body.error);
    if (error) return [error];
  }

  return [SIGNUP_FALLBACK_ERROR];
}
