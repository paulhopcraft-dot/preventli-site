"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  fallback?: boolean;
}

const QUICK_REPLIES = [
  "Return to work guidance",
  "Compliance requirements",
  "Risk & claims insights",
  "Something else",
];

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

export default function AlexWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [messages, open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setShowChips(false);
    setLoading(true);
    try {
      const res = await fetch("/api/alex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply ||
            "I had trouble with that, but you can start your free trial instantly instead. Or email lisah@preventli.ai.",
          fallback: data.fallback || !data.reply,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong, but you can start your free trial instantly instead. Or email lisah@preventli.ai.",
          fallback: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button — hidden when panel is open */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#0A1628] text-white pl-3 pr-4 py-2.5 rounded-full shadow-xl hover:bg-[#0D1F3C] transition-all"
          aria-label="Chat with Alex"
        >
          <div className="w-7 h-7 rounded-full bg-[#00E676] flex items-center justify-center text-[#0A1628] font-bold text-sm flex-shrink-0">
            A
          </div>
          <span className="font-semibold text-sm">Ask Alex</span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-6 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          style={{ maxHeight: "500px" }}
        >
          {/* Header */}
          <div className="bg-[#0A1628] px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-[#00E676] flex items-center justify-center text-[#0A1628] font-bold text-sm flex-shrink-0">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-none">Alex</p>
              <p className="text-gray-400 text-xs mt-0.5">Your personal consultant</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Greeting */}
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-[#00E676] flex items-center justify-center text-[#0A1628] font-bold text-xs flex-shrink-0 mt-0.5">
                A
              </div>
              <div className="bg-gray-50 rounded-xl rounded-tl-sm px-3 py-2 text-sm text-gray-700 max-w-[210px]">
                Good {getTimeOfDay()}! I&apos;m here to help with your workers, cases
                and compliance questions. What would you like to know?
              </div>
            </div>

            {/* Quick-reply chips */}
            {showChips && messages.length === 0 && (
              <div className="flex flex-col gap-1.5 pl-8">
                {QUICK_REPLIES.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => send(chip)}
                    className="text-left text-xs text-[#009E53] border border-[#00E676]/50 rounded-full px-3 py-1.5 hover:bg-[#F0FFF4] transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Conversation */}
            {messages.map((msg, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div
                  className={`flex items-start gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full bg-[#00E676] flex items-center justify-center text-[#0A1628] font-bold text-xs flex-shrink-0 mt-0.5">
                      A
                    </div>
                  )}
                  <div
                    className={`rounded-xl px-3 py-2 text-sm max-w-[210px] whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-[#0A1628] text-white rounded-tr-sm"
                        : "bg-gray-50 text-gray-700 rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
                {msg.role === "assistant" && msg.fallback && (
                  <a
                    href="/start-trial"
                    className="ml-8 inline-flex w-fit items-center gap-1.5 bg-[#00E676] text-[#0A1628] text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-[#00C060] transition-colors"
                  >
                    Start Free Trial →
                  </a>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-[#00E676] flex items-center justify-center text-[#0A1628] font-bold text-xs flex-shrink-0 mt-0.5">
                  A
                </div>
                <div className="bg-gray-50 rounded-xl rounded-tl-sm px-3 py-2.5">
                  <div className="flex gap-1 items-center">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send(input)}
                placeholder="Message Alex..."
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                disabled={loading}
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                className="text-[#00E676] disabled:text-gray-300 transition-colors flex-shrink-0"
                aria-label="Send"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
