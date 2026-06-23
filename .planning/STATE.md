# Build state — Premium calculator

Building the public WorkCover VIC premium calculator on preventli-site.
**Source of truth:** `agent-specs/premium-calculator.md` (read it for all detail).

- Stack: Next.js 16 App Router, React 19, Tailwind v4, Supabase, Resend.
- The premium maths is a **deterministic engine** — pure TypeScript, NO AI in the calculation path.
- Reuse the existing `app/api/contact/route.ts` pattern for lead capture (Supabase insert + Resend).
- Every dollar figure carries the size-aware honesty guard (small employers see the flat industry rate, no fake savings).

Phases: 01 = engine + golden tests · 02 = UI + lead capture + PDF.
