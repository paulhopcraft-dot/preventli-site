// Plain-English industry picker layer.
//
// The 529 official WorkSafe classifications are semi-technical ("Cafes And
// Restaurants", "Building And Other Industrial Cleaning Services"). An SMB owner
// types a trade word — "cafe", "cleaner", "sparky" — and expects the right WIC.
//
// matchIndustry(query) returns ranked { wic, description } candidates:
//   1. a seeded synonym map for the ~50 most common trades (incl. slang), then
//   2. a substring fallback over the official descriptions.
//
// Pure data + string matching. No AI, no I/O.

import ratesData from "./rates-2025-26.json";

export interface IndustryCandidate {
  wic: string;
  description: string;
}

interface RateRow {
  wic: string;
  description: string;
}

const rows = ratesData.rates as RateRow[];
const byWic = new Map(rows.map((r) => [r.wic, r] as const));

// Seeded plain-English → WIC map. Keys are lowercase trade terms / slang;
// values are the official WIC code(s) they should surface, best first.
// Codes verified against rates-2025-26.json.
const SYNONYMS: Record<string, string[]> = {
  // Hospitality & food
  cafe: ["H45110"],
  coffee: ["H45110"],
  restaurant: ["H45110"],
  takeaway: ["H45120"],
  "fish and chips": ["H45120"],
  catering: ["H45130"],
  caterer: ["H45130"],
  pub: ["H45200"],
  bar: ["H45200"],
  tavern: ["H45200"],
  hotel: ["H44000"],
  motel: ["H44000"],
  accommodation: ["H44000"],
  bakery: ["C11740"],
  baker: ["C11740"],

  // Construction & trades
  plumbing: ["E32310"],
  plumber: ["E32310"],
  electrical: ["E32320"],
  electrician: ["E32320"],
  sparky: ["E32320"],
  carpentry: ["E32420"],
  carpenter: ["E32420"],
  chippy: ["E32420"],
  builder: ["E30110"],
  building: ["E30110"],
  "house construction": ["E30110"],
  painting: ["E32440"],
  painter: ["E32440"],
  landscaping: ["E32910", "N73130"],
  landscaper: ["E32910"],
  bricklaying: ["E32220"],
  bricklayer: ["E32220"],
  brickie: ["E32220"],
  concreting: ["E32210"],
  concreter: ["E32210"],
  roofing: ["E32230"],
  roofer: ["E32230"],
  tiling: ["E32430"],
  tiler: ["E32430"],
  plastering: ["E32410"],
  plasterer: ["E32410"],
  glazing: ["E32450"],
  glazier: ["E32450"],
  "air conditioning": ["E32330"],
  hvac: ["E32330"],
  scaffolding: ["L66310"],

  // Personal & cleaning services
  hairdressing: ["S95110"],
  hairdresser: ["S95110"],
  barber: ["S95110"],
  salon: ["S95110"],
  beauty: ["S95110"],
  laundry: ["S95310"],
  laundromat: ["S95310"],
  "dry cleaning": ["S95310"],
  cleaning: ["N73110"],
  cleaner: ["N73110"],
  gardening: ["N73130"],
  gardener: ["N73130"],
  "lawn mowing": ["N73130"],
  "pest control": ["N73120"],
  security: ["O77120"],
  funeral: ["S95201"],

  // Care & health
  childcare: ["Q87100"],
  "child care": ["Q87100"],
  "day care": ["Q87100"],
  dental: ["Q85310"],
  dentist: ["Q85310"],
  physio: ["Q85330"],
  physiotherapy: ["Q85330"],
  "medical practice": ["Q85110"],
  gp: ["Q85110"],
  doctor: ["Q85110"],
  veterinary: ["M69700"],
  vet: ["M69700"],

  // Retail
  supermarket: ["G41100"],
  grocery: ["G41100"],
  hardware: ["G42310"],
  clothing: ["G42510"],
  furniture: ["G42110"],
  liquor: ["G41230"],
  "bottle shop": ["G41230"],

  // Transport & logistics
  "road freight": ["I46100"],
  trucking: ["I46100"],
  transport: ["I46100"],
  courier: ["I51020"],
  delivery: ["I51020"],
  taxi: ["I46230"],
  rideshare: ["I46230"],
  warehousing: ["I53090"],
  warehouse: ["I53090"],

  // Automotive
  mechanic: ["S94190"],
  automotive: ["S94190"],
  "car repair": ["S94190"],
  "panel beating": ["S94120"],
  "smash repair": ["S94120"],

  // Professional services
  accounting: ["M69320"],
  accountant: ["M69320"],
  bookkeeping: ["M69320"],
  legal: ["M69310"],
  lawyer: ["M69310"],
  solicitor: ["M69310"],
  engineering: ["M69230"],
  architect: ["M69210"],
  architectural: ["M69210"],
  "real estate": ["L67200"],
  "it services": ["M70000"],
  software: ["M70000"],
  printing: ["C16110"],

  // Fitness
  gym: ["R91110"],
  fitness: ["R91110"],
};

function normalise(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
}

function toCandidates(wics: string[]): IndustryCandidate[] {
  const out: IndustryCandidate[] = [];
  for (const wic of wics) {
    const row = byWic.get(wic);
    if (row) out.push({ wic: row.wic, description: row.description });
  }
  return out;
}

/**
 * Map a plain-English trade term to ranked WIC candidates.
 *
 * Strategy: synonym hits first (exact key, then key⊇query / query⊇key), then a
 * substring scan over the official descriptions. De-duplicated, best first.
 */
export function matchIndustry(query: string, limit = 8): IndustryCandidate[] {
  const q = normalise(query);
  if (!q) return [];

  const seen = new Set<string>();
  const ranked: IndustryCandidate[] = [];
  const push = (c: IndustryCandidate) => {
    if (seen.has(c.wic)) return;
    seen.add(c.wic);
    ranked.push(c);
  };

  // 1. Synonym map — exact key match wins, then containment either direction.
  const exact = SYNONYMS[q];
  if (exact) toCandidates(exact).forEach(push);

  for (const [key, wics] of Object.entries(SYNONYMS)) {
    if (key === q) continue;
    if (q.includes(key) || key.includes(q)) toCandidates(wics).forEach(push);
  }

  // 2. Substring fallback over official descriptions. Rank shorter, earlier
  // matches above longer ones (a leading whole-word hit is the strongest).
  const subs = rows
    .map((r) => ({ row: r, idx: normalise(r.description).indexOf(q) }))
    .filter((m) => m.idx !== -1)
    .sort((a, b) => a.idx - b.idx || a.row.description.length - b.row.description.length);
  for (const m of subs) push({ wic: m.row.wic, description: m.row.description });

  return ranked.slice(0, limit);
}
