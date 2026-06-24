import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  computePremium,
  savingsScenario,
  lookupIndustry,
} from "@/lib/premium/engine";
import { renderPremiumReport } from "@/lib/premium/pdf/PremiumReport";

// Lead capture for the WorkCover premium calculator (spec §7).
// Mirrors app/api/contact/route.ts exactly: validate → Supabase insert →
// two Resend emails (prospect gets the branded result + PDF; team gets a
// notification). Email failures NEVER fail the request.
//
// NOTE: the Supabase table `premium_calc_leads` must exist — mirror
// `contact_submissions` (email text, wages/claims_cost/premium/saving numeric,
// wic_code text, status text default 'new', created_at timestamptz default now()).

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, wages, wicCode, claimsCost, premium, saving } = body;

    // Validation
    if (
      !email ||
      wages == null ||
      !wicCode ||
      claimsCost == null ||
      premium == null ||
      saving == null
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Save to Supabase
    let supabaseError = null;
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co"
    ) {
      const { error } = await supabaseAdmin
        .from("premium_calc_leads")
        .insert([
          {
            email,
            wages,
            wic_code: wicCode,
            claims_cost: claimsCost,
            premium,
            saving,
            status: "new",
          },
        ]);
      supabaseError = error;
      if (error) {
        console.error("Supabase error:", error);
      }
    }

    // Send email notifications via Resend
    if (
      process.env.RESEND_API_KEY &&
      process.env.RESEND_API_KEY !== "your_resend_key"
    ) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        // Recompute server-side from the trusted inputs so the PDF carries the
        // full engine result (the request only sends headline premium/saving).
        const { description } = lookupIndustry(wicCode);
        const premiumResult = computePremium({
          remuneration: wages,
          wicCode,
          claimsCost,
        });
        const savingsResult = savingsScenario({
          remuneration: wages,
          wicCode,
          claimsCost,
        });
        const pdf = await renderPremiumReport({
          remuneration: wages,
          industryDescription: description,
          wicCode,
          claimsCost,
          premium: premiumResult,
          savings: savingsResult,
        });

        const money = (n: number) =>
          n.toLocaleString("en-AU", {
            style: "currency",
            currency: "AUD",
            maximumFractionDigits: 0,
          });

        // 1. Prospect: branded result email + PDF attachment
        await resend.emails.send({
          from: "Preventli <noreply@preventli.ai>",
          to: email,
          subject: "Your WorkCover premium estimate",
          attachments: [
            {
              filename: "Preventli-WorkCover-Premium-Estimate.pdf",
              content: pdf,
            },
          ],
          html: `
            <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
              <div style="background: #0A1628; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                <h1 style="color: #00E676; margin: 0; font-size: 20px;">Preventli</h1>
                <p style="color: #aaa; margin: 8px 0 0; font-size: 14px;">30 years of WorkCover expertise. 3,000+ cases managed.</p>
              </div>

              <h2 style="color: #0A1628; font-size: 22px; margin-bottom: 8px;">Your WorkCover premium estimate</h2>
              <p style="color: #555; line-height: 1.6; margin-bottom: 24px;">
                Thanks for using our calculator. Your branded estimate is attached as a PDF. Here's the headline:
              </p>

              <div style="background: #f8f9fa; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 8px 0; color: #666; width: 180px;">Industry:</td><td style="padding: 8px 0; font-weight: 600; color: #1A1A2E;">${description} (WIC ${wicCode})</td></tr>
                  <tr><td style="padding: 8px 0; color: #666;">Annual rateable wages:</td><td style="padding: 8px 0; font-weight: 600; color: #1A1A2E;">${money(wages)}</td></tr>
                  <tr><td style="padding: 8px 0; color: #666;">Estimated annual premium:</td><td style="padding: 8px 0; font-weight: 600; color: #1A1A2E;">${money(premium)}</td></tr>
                  ${
                    savingsResult.showSaving
                      ? `<tr><td style="padding: 8px 0; color: #666;">Potential saving with Preventli:</td><td style="padding: 8px 0; font-weight: 600; color: #00b85f;">${money(saving)}/year</td></tr>`
                      : ""
                  }
                </table>
              </div>

              <p style="color: #555; line-height: 1.6;">
                Want the real number? Lisa and the team can review your actual claims history at
                <a href="mailto:lisah@preventli.ai" style="color: #00E676;">lisah@preventli.ai</a>.
              </p>

              <p style="color: #999; font-size: 11px; margin-top: 24px; border-top: 1px solid #eee; padding-top: 16px; line-height: 1.5;">
                For illustration purposes only. This is an indicative estimate based on gazetted 2025-26 industry rates and a simplified single-year calculation — it is not an official WorkSafe premium quote. Your actual premium is determined by WorkSafe Victoria and depends on your full claims history, remuneration and workplace details.
              </p>
            </div>
          `,
        });

        // 2. Notification to Preventli team
        await resend.emails.send({
          from: "Preventli <noreply@preventli.ai>",
          to: "paul.hopcraft@gmail.com",
          subject: `New premium-calc lead: ${email}`,
          html: `
            <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
              <div style="background: #0A1628; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                <h1 style="color: #00E676; margin: 0; font-size: 20px;">🧮 New Premium-Calc Lead</h1>
              </div>
              <div style="background: #f8f9fa; padding: 24px; border-radius: 12px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 8px 0; color: #666; width: 140px;">Email:</td><td style="padding: 8px 0; font-weight: 600;"><a href="mailto:${email}" style="color: #00E676;">${email}</a></td></tr>
                  <tr><td style="padding: 8px 0; color: #666;">Industry:</td><td style="padding: 8px 0; font-weight: 600;">${description} (WIC ${wicCode})</td></tr>
                  <tr><td style="padding: 8px 0; color: #666;">Wages:</td><td style="padding: 8px 0; font-weight: 600;">${money(wages)}</td></tr>
                  <tr><td style="padding: 8px 0; color: #666;">Premium:</td><td style="padding: 8px 0; font-weight: 600;">${money(premium)}</td></tr>
                  <tr><td style="padding: 8px 0; color: #666;">Saving:</td><td style="padding: 8px 0; font-weight: 600;">${money(saving)}</td></tr>
                </table>
              </div>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("Email send error:", emailErr);
        // Don't fail the request if email fails
      }
    }

    if (supabaseError) {
      // Still return success to user but log the error
      console.error("Supabase save failed:", supabaseError);
    }

    return NextResponse.json({
      success: true,
      message: "Lead received",
    });
  } catch (err) {
    console.error("Premium-lead API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
