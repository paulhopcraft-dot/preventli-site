/**
 * Casting + fixture constants for the onboarding-video capture harness.
 *
 * All of this traces to `server/seed-demo-partner.ts` in the `preventli`
 * repo (branch `claude/preventli-onboarding-video-8a9c5d`, PR #312, open +
 * UNMERGED as of 2026-07-26 — see docs/video-pipeline.md "Prerequisites")
 * and to the casting call in
 * `docs/partner-onboarding-chapter2-rerecord-brief.md` (also unmerged, on
 * branch `fix/partner-onboarding-hub-defects-2026-07-26`).
 *
 * Do NOT invent a different client/candidate/JD pairing. The brief is
 * explicit that role and JD must visibly belong together, and this pairing
 * (PCA candidate + PCA position description, both aged-care) is the one
 * already seeded — inventing a different pairing means also editing the
 * seed script, which lives in a different repo this PR does not touch.
 */

export const PARTNER = {
  orgId: "org-demo-partner",
  name: "Vantage RTW Partners",
  loginEmail: "demo@vantagertw.example.com.au",
  loginPassword: "PreventliDemo2026!",
};

/**
 * The one seeded client (of ten) that already has a job description in its
 * library, and the candidate/role pairing that goes with it. Chapter 2's
 * new client ("add a client" shot) is intentionally a DIFFERENT, brand-new
 * name — the seed leaves client #11 unfilled on purpose so that beat has a
 * clean slate to add one live. See NEW_CLIENT below.
 */
export const CASTING = {
  existingClient: {
    name: "Coastline Aged Care Group",
    suburb: "Geelong",
  },
  candidate: {
    name: "Priya Nair",
    email: "priya.nair@example-demopartner.com.au",
    role: "Personal Care Assistant",
  },
  jobDescriptions: [
    {
      title: "Personal Care Assistant — Position Description",
      // Already seeded — this is the one existing entry in the client's
      // JD library before the capture session starts.
      seeded: true,
    },
    {
      title: "Registered Nurse — Position Description",
      seeded: false,
    },
    {
      title: "Support Worker — Position Description",
      seeded: false,
    },
  ],
};

/**
 * A brand-new client, created live on camera in chapter 2's "Add a client"
 * shot. Deliberately NOT one of the ten seeded clients, and deliberately
 * NOT reusing the vet-clinic name the rerecord brief explicitly says not to
 * reuse ("a vet clinic hiring Carers/PCAs doesn't read as coherent").
 * Because this client is created fresh each run, re-running the capture
 * against the same DB will create a second client with the same name —
 * `capture/cleanup.ts` deletes it via the app's own delete-client button
 * so repeated captures stay idempotent (run it between takes, not
 * automatically — see docs/video-pipeline.md "Re-running a capture").
 */
export const NEW_CLIENT = {
  name: "Northgate Distribution Centre",
  suburb: "Somerton",
};

/** 1920x1080 @ 30fps to match every existing chapter (see reference-params.json). */
export const VIEWPORT = { width: 1920, height: 1080 };

export const DEFAULT_BASE_URL = process.env.CAPTURE_BASE_URL ?? "http://localhost:5000";
