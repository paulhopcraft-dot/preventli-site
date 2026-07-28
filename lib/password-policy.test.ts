// Tests for the /start-trial password rules.
//
// These deliberately assert the exact rejection SENTENCES, not just "invalid".
// This file is a mirror of shared/passwordPolicy.ts in the preventli app repo,
// and those sentences are what the server sends back in its `details` array —
// so a wording or rule change on either side should make one of the two test
// files fail rather than silently reintroduce the 2026-07-27 mismatch, where
// the form advertised one rule and the server enforced five.

import { describe, it, expect } from "vitest";
import {
  PASSWORD_RULES,
  checkPasswordRules,
  validatePassword,
} from "./password-policy";

describe("validatePassword", () => {
  it("accepts a password meeting all five rules", () => {
    const result = validatePassword("Password1!");
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  // The exact live failure: passes the form's old `length >= 8` rule, fails
  // three of the five real ones, and used to be submitted anyway.
  it("rejects eight lowercase letters, naming every unmet rule", () => {
    const result = validatePassword("abcdefgh");
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual([
      "Password must contain at least one uppercase letter",
      "Password must contain at least one digit",
      "Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;':\",./<>?)",
    ]);
  });

  it("rejects a short password that otherwise qualifies", () => {
    expect(validatePassword("Pw1!").errors).toEqual([
      "Password must be at least 8 characters long",
    ]);
  });

  it("rejects a password missing only a special character", () => {
    expect(validatePassword("Password1").errors).toEqual([
      "Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;':\",./<>?)",
    ]);
  });

  it("rejects a password missing only a digit", () => {
    expect(validatePassword("Password!").errors).toEqual([
      "Password must contain at least one digit",
    ]);
  });

  it("rejects a password missing only a lowercase letter", () => {
    expect(validatePassword("PASSWORD1!").errors).toEqual([
      "Password must contain at least one lowercase letter",
    ]);
  });

  it("lists every rule for an empty password", () => {
    expect(validatePassword("").errors).toHaveLength(PASSWORD_RULES.length);
  });

  it("accepts each character the server counts as special", () => {
    for (const char of "!@#$%^&*()_+-=[]{};':\"\\|,.<>/?") {
      expect(validatePassword(`Passwrd1${char}`).valid).toBe(true);
    }
  });

  it("does not count a letter or space as a special character", () => {
    expect(validatePassword("Password1 ").valid).toBe(false);
  });
});

describe("checkPasswordRules", () => {
  it("returns one entry per rule, in a stable order, with UI labels", () => {
    const checks = checkPasswordRules("");
    expect(checks.map((c) => c.rule.id)).toEqual([
      "length",
      "uppercase",
      "lowercase",
      "digit",
      "special",
    ]);
    expect(checks.every((c) => c.rule.label.length > 0)).toBe(true);
  });

  it("lights up rules as they are met", () => {
    const met = new Map(
      checkPasswordRules("abcdefgh").map((c) => [c.rule.id, c.met]),
    );
    expect(met.get("length")).toBe(true);
    expect(met.get("lowercase")).toBe(true);
    expect(met.get("uppercase")).toBe(false);
    expect(met.get("digit")).toBe(false);
    expect(met.get("special")).toBe(false);
  });

  it("agrees with validatePassword on every sample", () => {
    for (const password of ["", "abcdefgh", "Password1", "Password1!", "Pw1!"]) {
      const unmet = checkPasswordRules(password)
        .filter((c) => !c.met)
        .map((c) => c.rule.error);
      expect(unmet).toEqual(validatePassword(password).errors);
    }
  });
});
