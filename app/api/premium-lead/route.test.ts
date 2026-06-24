// Route test for POST /api/premium-lead (spec §7 + DoD gate 5).
//
// Calls the handler directly — no running server, no network. Supabase, Resend,
// the engine and the PDF renderer are all mocked. Asserts: a valid payload
// returns ok, inserts exactly one premium_calc_leads row, and invokes the
// Resend send path; and that an email failure does NOT fail the request
// (mirrors the contact route's resilience).

import { describe, it, expect, vi, beforeEach } from "vitest";

// Hoisted mock fns so the vi.mock factories can reference them safely.
const { insertMock, fromMock, sendMock, ResendMock } = vi.hoisted(() => {
  const insertMock = vi.fn();
  const fromMock = vi.fn(() => ({ insert: insertMock }));
  const sendMock = vi.fn();
  // Must be `new`-able — use a function expression, not an arrow.
  const ResendMock = vi.fn(function () {
    return { emails: { send: sendMock } };
  });
  return { insertMock, fromMock, sendMock, ResendMock };
});

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: { from: fromMock },
}));

vi.mock("resend", () => ({
  Resend: ResendMock,
}));

// Keep the email path fast + offline: stub the engine + PDF renderer.
vi.mock("@/lib/premium/engine", () => {
  const savings = {
    showSaving: true,
    annualSaving: 5000,
    baselinePremium: 30360,
    managedPremium: 25360,
    threeYearSaving: 15000,
  };
  return {
    computePremium: vi.fn(() => ({ premium: 30360, gst: 3036 })),
    savingsScenario: vi.fn(() => savings),
    savingsFromPremium: vi.fn(() => savings),
    performanceFromPremium: vi.fn(() => ({
      epr: 1.2,
      industryRatePremium: 30360,
      ratingImpact: 6000,
      percentVsIndustry: 20,
      betterThanIndustry: false,
    })),
    claimImpact: vi.fn(() => ({
      showImpact: true,
      baselinePremium: 30360,
      newPremium: 35000,
      uncappedPremium: 35000,
      capped: false,
      threeYearImpact: 13800,
    })),
    lookupIndustry: vi.fn(() => ({
      description: "Cafes and restaurants",
      iccr: 0.0183,
      ir: 0.03,
    })),
  };
});
vi.mock("@/lib/premium/pdf/PremiumReport", () => ({
  renderPremiumReport: vi.fn(async () => Buffer.from("pdf")),
}));

import { POST } from "./route";

function makeReq(body: unknown) {
  return new Request("http://localhost/api/premium-lead", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  }) as never;
}

const validPayload = {
  email: "owner@example.com",
  wages: 1_000_000,
  wicCode: "70410",
  claimsCost: 18_290,
  premium: 30_360,
  saving: 5_000,
};

beforeEach(() => {
  vi.clearAllMocks();
  insertMock.mockResolvedValue({ error: null });
  sendMock.mockResolvedValue({ id: "email-1" });
  // Route guards both side effects behind non-placeholder env vars.
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://real.supabase.co");
  vi.stubEnv("RESEND_API_KEY", "re_realkey");
});

describe("POST /api/premium-lead", () => {
  it("valid payload returns ok, inserts one row, sends email", async () => {
    const res = await POST(makeReq(validPayload));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);

    // Exactly one premium_calc_leads row.
    expect(fromMock).toHaveBeenCalledWith("premium_calc_leads");
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(insertMock.mock.calls[0][0]).toHaveLength(1);

    // Resend send path was invoked (prospect + team).
    expect(sendMock).toHaveBeenCalled();
  });

  it("an email error does NOT fail the request", async () => {
    sendMock.mockRejectedValueOnce(new Error("resend down"));

    const res = await POST(makeReq(validPayload));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    // Lead was still stored despite the email failure.
    expect(insertMock).toHaveBeenCalledTimes(1);
  });

  it("rejects an invalid email without inserting", async () => {
    const res = await POST(makeReq({ ...validPayload, email: "not-an-email" }));

    expect(res.status).toBe(400);
    expect(insertMock).not.toHaveBeenCalled();
  });
});
