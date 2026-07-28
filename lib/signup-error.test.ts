// Tests for turning the signup API's error body into readable lines.
//
// The payloads below are the real shapes returned by
// POST https://app.preventli.ai/api/public/signup — both 400 variants were
// probed against the live endpoint on 2026-07-27.

import { describe, it, expect } from "vitest";
import { readSignupErrorLines, SIGNUP_FALLBACK_ERROR } from "./signup-error";

describe("readSignupErrorLines", () => {
  it("prefers details over message for a password-policy rejection", () => {
    const lines = readSignupErrorLines({
      error: "Bad Request",
      message: "Password does not meet security requirements",
      details: [
        "Password must contain at least one digit",
        "Password must contain at least one special character",
      ],
    });

    expect(lines).toEqual([
      "Password must contain at least one digit",
      "Password must contain at least one special character",
    ]);
  });

  it("prefers details over message for a field-validation rejection", () => {
    const lines = readSignupErrorLines({
      error: "Bad Request",
      message: "Invalid signup details",
      details: ["email: A valid email is required"],
    });

    expect(lines).toEqual(["email: A valid email is required"]);
  });

  it("falls back to message when there are no details (e.g. the 409 duplicate)", () => {
    const lines = readSignupErrorLines({
      error: "Conflict",
      message: "An account with this email already exists. Try signing in instead.",
    });

    expect(lines).toEqual([
      "An account with this email already exists. Try signing in instead.",
    ]);
  });

  it("falls back to error only when there is nothing better", () => {
    expect(readSignupErrorLines({ error: "Bad Request" })).toEqual(["Bad Request"]);
  });

  it("ignores an empty or non-string details array", () => {
    expect(readSignupErrorLines({ message: "Invalid signup details", details: [] })).toEqual([
      "Invalid signup details",
    ]);
    expect(
      readSignupErrorLines({ message: "Invalid signup details", details: [null, "  "] }),
    ).toEqual(["Invalid signup details"]);
  });

  it("keeps the readable entries when details is partly junk", () => {
    expect(
      readSignupErrorLines({
        message: "Invalid signup details",
        details: [null, "company: Required", ""],
      }),
    ).toEqual(["company: Required"]);
  });

  it("returns the generic fallback for an unreadable body", () => {
    expect(readSignupErrorLines(null)).toEqual([SIGNUP_FALLBACK_ERROR]);
    expect(readSignupErrorLines(undefined)).toEqual([SIGNUP_FALLBACK_ERROR]);
    expect(readSignupErrorLines({})).toEqual([SIGNUP_FALLBACK_ERROR]);
    expect(readSignupErrorLines("<html>502 Bad Gateway</html>")).toEqual([
      SIGNUP_FALLBACK_ERROR,
    ]);
  });
});
