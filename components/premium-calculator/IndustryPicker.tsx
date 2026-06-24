"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { matchIndustry, type IndustryCandidate } from "@/lib/premium/industry-synonyms";
import ratesData from "@/lib/premium/rates-2025-26.json";

// Searchable plain-English industry picker over the 529 official WorkSafe
// classifications. Controlled: parent owns the chosen WIC code.
//
//   <IndustryPicker value={wicCode} onChange={setWicCode} />
//
// The user types a trade word ("cafe", "sparky") and matchIndustry surfaces
// ranked official classifications. We always show the matched official WIC +
// description for transparency — they're picking a real WorkSafe class, not a
// fuzzy label.

const wicToDescription = new Map(
  (ratesData.rates as { wic: string; description: string }[]).map(
    (r) => [r.wic, r.description] as const
  )
);

type Props = {
  value: string;
  onChange: (wic: string) => void;
};

export default function IndustryPicker({ value, onChange }: Props) {
  const selectedDescription = value ? wicToDescription.get(value) : undefined;

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const results = useMemo<IndustryCandidate[]>(
    () => (query.trim() ? matchIndustry(query) : []),
    [query]
  );

  // Close the dropdown on outside click.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function select(candidate: IndustryCandidate) {
    onChange(candidate.wic);
    setQuery("");
    setOpen(false);
    setActive(0);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      select(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        Industry <span className="text-red-400">*</span>
      </label>

      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActive(0);
        }}
        onFocus={() => query.trim() && setOpen(true)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          // Foolproof selection: if the user typed a trade and there's a match
          // but they clicked away without picking, lock in the highlighted one
          // (the confirmation box below shows what was chosen — they can re-search).
          // Option clicks use onMouseDown+preventDefault, so this never fires on them.
          if (query.trim() && results.length > 0) {
            select(results[Math.min(active, results.length - 1)]);
          }
        }}
        placeholder={
          selectedDescription
            ? "Search again to change industry..."
            : "Type your trade — e.g. cafe, plumber, cleaner"
        }
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        autoComplete="off"
        className="w-full rounded-xl px-4 py-3 text-sm border border-gray-200 bg-white transition-colors focus:outline-none focus:border-[#9CB81E]"
      />

      {open && results.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-20 mt-1 w-full max-h-72 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg"
        >
          {results.map((c, i) => (
            <li
              key={c.wic}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                select(c);
              }}
              onMouseEnter={() => setActive(i)}
              className={`cursor-pointer px-4 py-2.5 text-sm ${
                i === active ? "bg-[#9CB81E]/10" : ""
              }`}
            >
              <span className="text-[#0A1628] font-medium">{c.description}</span>
              <span className="block text-xs text-gray-400 mt-0.5">
                WIC {c.wic}
              </span>
            </li>
          ))}
        </ul>
      )}

      {open && query.trim() && results.length === 0 && (
        <div className="absolute z-20 mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-400 shadow-lg">
          No match — try a simpler term (e.g. &quot;builder&quot;,
          &quot;mechanic&quot;).
        </div>
      )}

      {/* Transparency: show the official classification they've landed on. */}
      {selectedDescription && (
        <div className="mt-2 flex items-start gap-2 rounded-xl bg-[#F8F9FA] px-4 py-3">
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="#9CB81E"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className="mt-0.5 flex-shrink-0"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <div>
            <div className="text-xs text-gray-400">
              Matched WorkSafe classification
            </div>
            <div className="text-sm font-semibold text-[#0A1628]">
              {selectedDescription}{" "}
              <span className="font-normal text-gray-400">(WIC {value})</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
