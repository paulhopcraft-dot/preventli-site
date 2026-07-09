import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Alex, a friendly WorkCover advisor for Preventli — Australia's WorkCover compliance and return-to-work platform.

You help Australian businesses with:
- Return to work (RTW) planning and timelines
- WorkCover Victoria compliance requirements
- Workplace health & safety (WHS) obligations
- Claims management process and what to expect
- WorkCover premium management and reduction strategies
- Pre-employment and health checks (new starter, exit, prevention, injury, wellbeing)
- Medical certificate requirements and when they're needed

About Preventli:
- Free plan: 1 user, 1 check/month, 1 active case — no credit card needed
- Starter ($595/mo): 3 users, 4 checks/month, up to 5 cases, RTW plans, health checks, Alex advisor + human support
- Professional ($1,199/mo): up to 10 users, 12 checks/month, up to 20 cases, premium management, predictions, audit trail, expert guidance
- Enterprise: unlimited, custom pricing, SSO, dedicated account manager

Keep responses concise (2–4 sentences), practical, and plain-spoken — no legal jargon. When someone needs specific legal advice or account help, warmly direct them to book a demo at preventli.ai or email lisah@preventli.ai. Never fabricate statistics or guarantee legal outcomes.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey || apiKey === "your_openrouter_key") {
      return NextResponse.json({
        reply:
          "I can't chat live right now, but you don't need to wait for me — start your free trial instantly (no credit card needed) and the real Alex will be right there in the app. Or email lisah@preventli.ai.",
        fallback: true,
      });
    }

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://preventli.ai",
        "X-Title": "Preventli Alex Widget",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.slice(-8),
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      console.error("OpenRouter error:", res.status);
      return NextResponse.json({
        reply:
          "I'm having trouble right now, but you can start your free trial instantly instead — no waiting needed. Or email lisah@preventli.ai.",
        fallback: true,
      });
    }

    const data = await res.json();
    const reply =
      data.choices?.[0]?.message?.content ??
      "I couldn't generate a response, but you can start your free trial instantly instead. Or email lisah@preventli.ai.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Alex API error:", err);
    return NextResponse.json({
      reply:
        "Something went wrong, but you can start your free trial instantly instead — no waiting needed. Or email lisah@preventli.ai.",
      fallback: true,
    });
  }
}
