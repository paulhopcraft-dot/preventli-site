import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, company, employees, message } = body;

    // Validation
    if (!name || !email || !company || !employees) {
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
        .from("contact_submissions")
        .insert([
          {
            name,
            email,
            phone: phone || null,
            company,
            employees,
            message: message || null,
            status: "new",
          },
        ]);
      supabaseError = error;
      if (error) {
        console.error("Supabase error:", error);
      }
    }

    // Send email notification via Resend
    if (
      process.env.RESEND_API_KEY &&
      process.env.RESEND_API_KEY !== "your_resend_key"
    ) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        const aestTime = new Date().toLocaleString("en-AU", { timeZone: "Australia/Sydney" });

        // 1. Notification to Preventli team
        await resend.emails.send({
          from: "Preventli <noreply@preventli.com.au>",
          to: "paul.hopcraft@gmail.com",
          subject: `New lead: ${name} from ${company}`,
          html: `
            <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
              <div style="background: #0A1628; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                <h1 style="color: #00E676; margin: 0; font-size: 20px;">🎯 New Preventli Lead</h1>
              </div>

              <div style="background: #f8f9fa; padding: 24px; border-radius: 12px; margin-bottom: 16px;">
                <h2 style="color: #0A1628; margin-top: 0; font-size: 16px;">Contact Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 8px 0; color: #666; width: 120px;">Name:</td><td style="padding: 8px 0; font-weight: 600; color: #1A1A2E;">${name}</td></tr>
                  <tr><td style="padding: 8px 0; color: #666;">Email:</td><td style="padding: 8px 0; font-weight: 600; color: #1A1A2E;"><a href="mailto:${email}" style="color: #00E676;">${email}</a></td></tr>
                  <tr><td style="padding: 8px 0; color: #666;">Phone:</td><td style="padding: 8px 0; font-weight: 600; color: #1A1A2E;">${phone || "Not provided"}</td></tr>
                  <tr><td style="padding: 8px 0; color: #666;">Company:</td><td style="padding: 8px 0; font-weight: 600; color: #1A1A2E;">${company}</td></tr>
                  <tr><td style="padding: 8px 0; color: #666;">Employees:</td><td style="padding: 8px 0; font-weight: 600; color: #1A1A2E;">${employees}</td></tr>
                </table>
              </div>

              ${
                message
                  ? `
              <div style="background: #f8f9fa; padding: 24px; border-radius: 12px; margin-bottom: 16px;">
                <h2 style="color: #0A1628; margin-top: 0; font-size: 16px;">Message</h2>
                <p style="color: #555; margin: 0; line-height: 1.6;">${message}</p>
              </div>
              `
                  : ""
              }

              <p style="color: #999; font-size: 12px; margin-top: 24px;">
                Sent from preventli.com.au contact form | ${aestTime} AEST
              </p>
            </div>
          `,
        });

        // 2. Confirmation email to prospect
        await resend.emails.send({
          from: "Preventli <noreply@preventli.com.au>",
          to: email,
          subject: `We received your request, ${name.split(" ")[0]}`,
          html: `
            <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
              <div style="background: #0A1628; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                <h1 style="color: #00E676; margin: 0; font-size: 20px;">Preventli</h1>
                <p style="color: #aaa; margin: 8px 0 0; font-size: 14px;">Australia's AI-powered WorkCover platform</p>
              </div>

              <h2 style="color: #0A1628; font-size: 22px; margin-bottom: 8px;">Thanks for reaching out, ${name.split(" ")[0]}!</h2>
              <p style="color: #555; line-height: 1.6; margin-bottom: 24px;">
                We've received your enquiry and one of our WorkCover specialists will be in touch within one business day.
              </p>

              <div style="background: #f8f9fa; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                <h3 style="color: #0A1628; margin-top: 0; font-size: 16px;">What happens next?</h3>
                <ul style="padding-left: 20px; color: #555; line-height: 2;">
                  <li>Free 30-minute consultation call</li>
                  <li>Custom risk assessment for ${company}</li>
                  <li>Savings estimate for your business</li>
                  <li>No lock-in contracts, no pressure</li>
                </ul>
              </div>

              <p style="color: #555; line-height: 1.6;">
                In the meantime, if you have an urgent question, you can reach us at
                <a href="mailto:jacinta@preventli.ai" style="color: #00E676;">jacinta@preventli.ai</a>.
              </p>

              <p style="color: #999; font-size: 12px; margin-top: 32px; border-top: 1px solid #eee; padding-top: 16px;">
                © ${new Date().getFullYear()} Preventli Pty Ltd · Australia's WorkCover specialists<br/>
                This email was sent because you submitted a request at preventli.com.au
              </p>
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
      message: "Submission received",
    });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
