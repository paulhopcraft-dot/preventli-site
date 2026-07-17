# Pricing restructure — free trial + PAYG (recorded 2026-07-17)

Source: Paul's dictated call notes. Branch: `claude/pricing-tiers-free-trial-a77ac9`.

## New pricing page structure

**Banner across the top (replaces "Free" as a column):**
- Box spanning the top of the pricing section: **"Start your 14-day free trial"** + what it includes.
- Free trial = full system access for 14 days (everything, compliance included) + **1 report of each check type**.
- When the trial runs out, they pick a paid option.

**Columns (4):**
1. **Pay as you go** (replaces the current Free tier)
   - Access to checks only — pay per check.
   - All other areas of the app visible but **grayed out**; Alex actively upsells / prompts appear. (Paul: "boxes coming up saying something — I'll think about that one.")
2. **Starter — $595/mo** — exactly what's on the site now (3 users, 3 clinical, 5 H&W, 5 cases).
3. **Professional — $1,199/mo** — up to 10 users, **10 clinical checks/mo**, **limited H&W checks** (NOT unlimited — change from current site copy), 20 cases.
4. *(Enterprise comes OFF the columns — see below.)*

**Box below the columns (replaces the Enterprise column):**
- "Need a custom solution?" style box — for enterprise / rehab providers / insurers / workplace-rehab ("work better") firms with e.g. 100 clients. Indicative thinking: could be worth ~$1,000–$3,000/mo; above an included cap they pay per report. Contact us.

## Product behaviour (app side — gpnet3, later)

- **Quota countdown:** every plan with included checks shows a live countdown ("you've got 2 left this month").
- **Overage = PAYG top-up:** when quota hits zero, prompt "Would you like to purchase another one?" — pay-as-you-go per extra check, like Claude's extra-credits model.
- **PAYG tier:** checks unlocked, rest of app grayed out with upsell prompts from Alex.
- **Free trial:** full access 14 days + 1 report per check type, then downgrade to choose-a-plan.

## Scope agreed this session

Paul: LinkedIn goes manual for now (automation paused). Build focus:
1. Website pricing section: free-trial banner on top, PAYG / $595 / $1,199 columns, custom-solution box at bottom.
2. Functionality behind **free trial** and **pay as you go** — just those two.

## Resolved (2026-07-17, same day)

1. **PAYG per-check prices (Paul, by voice):** all checks $49 flat (New Starter, Injury Prevention, Mental Health, Exit, General Wellbeing). Clinical report $125. Medico-legal $145. IME $145. Note: medico-legal/IME is a rise from the $125 on June invoices — existing clients (State Trustees etc.) should get a heads-up at next billing.
2. "895" garble: discarded. Final columns confirmed PAYG / $595 / $1,199.
3. Professional H&W limit: **20/month** (Claude's call, Paul delegated — 4× Starter's 5/mo, bundle math holds at $49/check).
4. Trial CTA: reuses existing `/start-trial` flow. Yes.
5. **All-PAYG idea (no monthly plans, free system): considered and dropped by Paul.** Context: doctors will do checks free (relationship deal), making $49/check ~pure margin. Decision: keep tiers anyway — favor won't survive scale, tiers preserve pricing power, real bottleneck is customer count. Test all-PAYG as a sales-call offer if desired, not on the public site.
