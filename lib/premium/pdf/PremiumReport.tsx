// Comprehensive branded PDF report for the WorkCover premium calculator (spec §7).
//
// Renders server-side to a Buffer via @react-pdf/renderer — the lead route
// (POST /api/premium-lead) recomputes the full result from the engine and
// attaches the buffer to the prospect's Resend email.
//
// NO maths here. The report takes a fully-formed result object straight from
// the engine and only formats it. Credibility ("based on WorkSafe's simulator,
// validated to the dollar") + the "your premium can change" caveat + the
// canonical disclaimer are all reproduced so every surface says the same thing.

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import type {
  ClaimImpactResult,
  ComputePremiumResult,
  SavingsScenarioResult,
  PerformanceResult,
} from "../engine";

const NAVY = "#0A1628";
const NAVY_2 = "#16233A";
const GREEN = "#00E676";
const GREEN_DARK = "#0A7A45";
const AMBER = "#D97706";
const GRAY = "#6b7280";
const GRAY_LT = "#9ca3af";
const TRACK = "#E5E8EC";
const CONTACT_EMAIL = "lisah@preventli.ai";

const DISCLAIMER =
  "For illustration purposes only. This is an indicative estimate based on " +
  "gazetted 2025-26 industry rates and a simplified single-year calculation — " +
  "it is not an official WorkSafe premium quote. Your actual premium is " +
  "determined by WorkSafe Victoria and depends on your full claims history, " +
  "remuneration and workplace details.";

const ASTERISK_40 =
  "* Up to 40% lower claims cost — based on employers who already carry " +
  "meaningful claims costs (a claims history above their industry rate). The " +
  "further above the industry benchmark you sit, the greater the potential " +
  "saving; lower claims cost then flows through to a lower premium (typically " +
  "a smaller percentage, scaled by your size). Employers already at or below " +
  "their industry rate, and small employers on the flat rate, will see less.";

export interface PremiumReportData {
  remuneration: number;
  industryDescription: string;
  wicCode: string;
  claimsCost: number;
  premium: ComputePremiumResult;
  savings: SavingsScenarioResult;
  /** Present when they entered their actual premium — the rating reveal. */
  performance?: PerformanceResult | null;
  claimImpact?: ClaimImpactResult;
  claimCost?: number;
}

function money(n: number): string {
  return n.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  });
}

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: NAVY,
    paddingTop: 0,
    paddingBottom: 44,
    lineHeight: 1.45,
  },
  // Header band (full-bleed navy)
  header: {
    backgroundColor: NAVY,
    paddingTop: 30,
    paddingBottom: 26,
    paddingHorizontal: 44,
  },
  brandRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  brand: { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#ffffff" },
  brandDot: { color: GREEN },
  headerKicker: { fontSize: 8, fontFamily: "Helvetica-Bold", color: GREEN, textTransform: "uppercase", letterSpacing: 1.5 },
  tagline: { fontSize: 8, color: "#8492A6", marginTop: 14 },
  accent: { height: 3, backgroundColor: GREEN },
  // Body wrapper
  body: { paddingHorizontal: 44, paddingTop: 22 },
  h1: { fontSize: 16, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  sub: { fontSize: 9, color: GRAY, marginBottom: 18 },
  sectionLabel: {
    fontSize: 8, fontFamily: "Helvetica-Bold", color: GREEN_DARK,
    textTransform: "uppercase", letterSpacing: 1, marginBottom: 7, marginTop: 4,
  },
  row: {
    flexDirection: "row", justifyContent: "space-between",
    paddingVertical: 3.5, borderBottomWidth: 0.5, borderBottomColor: "#e5e7eb",
  },
  rowLabel: { color: GRAY },
  rowValue: { fontFamily: "Helvetica-Bold" },
  para: { color: "#374151", marginTop: 5 },
  bold: { fontFamily: "Helvetica-Bold", color: NAVY },
  // Cards
  heroNavy: { backgroundColor: NAVY, borderRadius: 10, padding: 16, marginBottom: 16, color: "#ffffff" },
  heroLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: GREEN, textTransform: "uppercase", letterSpacing: 1 },
  bigNum: { fontSize: 32, fontFamily: "Helvetica-Bold", color: "#ffffff", marginTop: 6, marginBottom: 8, lineHeight: 1 },
  bigAmount: { fontSize: 26, fontFamily: "Helvetica-Bold", color: "#ffffff", marginTop: 4, lineHeight: 1 },
  whiteSub: { fontSize: 9, color: "#cbd5e1", marginTop: 8 },
  pill: { fontSize: 9.5, fontFamily: "Helvetica-Bold", marginTop: 0 },
  greenCard: { borderWidth: 1, borderColor: GREEN, backgroundColor: "#F0FFF7", borderRadius: 10, padding: 16, marginBottom: 16 },
  card: { borderWidth: 0.5, borderColor: "#e5e7eb", borderRadius: 10, padding: 16, marginBottom: 16 },
  cardTitle: { fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  impactValue: { fontFamily: "Helvetica-Bold", color: "#dc2626" },
  capNote: {
    backgroundColor: "#fffbeb", borderWidth: 0.5, borderColor: "#fde68a",
    borderRadius: 6, padding: 8, marginTop: 8, fontSize: 8, color: "#92400e",
  },
  // Bar chart
  barRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  barLabel: { width: 120, fontSize: 8.5, color: GRAY },
  barTrack: { flexGrow: 1, height: 16, backgroundColor: TRACK, borderRadius: 4, marginHorizontal: 8 },
  barFill: { height: 16, borderRadius: 4 },
  barValue: { width: 78, fontSize: 9, fontFamily: "Helvetica-Bold", textAlign: "right" },
  // Credibility / caveat
  cred: { backgroundColor: "#F4F6F8", borderRadius: 10, padding: 16, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: GREEN },
  caveat: { backgroundColor: "#FFFBEB", borderRadius: 10, padding: 16, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: AMBER },
  caveatTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#92400e", marginBottom: 4 },
  contact: { backgroundColor: NAVY, borderRadius: 10, padding: 16, marginBottom: 16 },
  contactTitle: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#ffffff" },
  contactBody: { fontSize: 9.5, color: "#cbd5e1", marginTop: 4 },
  contactEmail: { fontFamily: "Helvetica-Bold", color: GREEN },
  fine: { fontSize: 7, color: GRAY_LT, marginTop: 8, lineHeight: 1.45, paddingHorizontal: 44 },
});

/** A labelled horizontal bar. width = value/max of the track. */
function Bar({ label, value, max, color, valueColor }: {
  label: string; value: number; max: number; color: string; valueColor?: string;
}) {
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <View style={s.barRow}>
      <Text style={s.barLabel}>{label}</Text>
      <View style={s.barTrack}>
        <View style={[s.barFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={[s.barValue, valueColor ? { color: valueColor } : {}]}>{money(value)}</Text>
    </View>
  );
}

function ReportDocument({ data }: { data: PremiumReportData }) {
  const { premium, savings, performance, claimImpact, claimCost } = data;
  const hasPerf = !!performance;
  const yourPremium = hasPerf ? savings.baselinePremium : premium.premium;
  const above = performance ? !performance.betterThanIndustry : false;
  const pctVsInd = performance ? Math.round(Math.abs(performance.percentVsIndustry)) : 0;
  const barMax = Math.max(yourPremium, performance?.industryRatePremium ?? 0, savings.managedPremium);

  return (
    <Document title="WorkCover Premium Report — Preventli" author="Preventli">
      <Page size="A4" style={s.page}>
        {/* ---- Header band ---- */}
        <View style={s.header}>
          <View style={s.brandRow}>
            <Text style={s.brand}>Preventli<Text style={s.brandDot}>.</Text></Text>
            <Text style={s.headerKicker}>WorkCover premium report</Text>
          </View>
          <Text style={s.tagline}>30 years of WorkCover expertise · 3,000+ cases managed</Text>
        </View>
        <View style={s.accent} />

        <View style={s.body}>
          <Text style={s.h1}>Your WorkCover Victoria premium report</Text>
          <Text style={s.sub}>
            {data.industryDescription} · {money(data.remuneration)} annual wages
          </Text>

          {/* ---- Your details ---- */}
          <Text style={s.sectionLabel}>Your details</Text>
          <View style={{ marginBottom: 18 }}>
            <View style={s.row}>
              <Text style={s.rowLabel}>Annual rateable wages</Text>
              <Text style={s.rowValue}>{money(data.remuneration)}</Text>
            </View>
            <View style={s.row}>
              <Text style={s.rowLabel}>Industry classification</Text>
              <Text style={s.rowValue}>{data.industryDescription} (WIC {data.wicCode})</Text>
            </View>
            {hasPerf ? (
              <View style={s.row}>
                <Text style={s.rowLabel}>Your current annual premium</Text>
                <Text style={s.rowValue}>{money(yourPremium)}</Text>
              </View>
            ) : (
              <View style={s.row}>
                <Text style={s.rowLabel}>Annual claims cost</Text>
                <Text style={s.rowValue}>{money(data.claimsCost)}</Text>
              </View>
            )}
          </View>

          {/* ---- Performance rating (or estimated premium) ---- */}
          {performance ? (
            <>
              <Text style={s.sectionLabel}>Your performance rating</Text>
              <View style={s.heroNavy}>
                <Text style={s.heroLabel}>Employer performance rating</Text>
                <Text style={s.bigNum}>{performance.epr.toFixed(2)}</Text>
                <Text style={[s.pill, { color: above ? "#FCD34D" : GREEN }]}>
                  {above
                    ? `${pctVsInd}% above your industry benchmark rate`
                    : `${pctVsInd}% below your industry rate — a strong record`}
                </Text>
                <Text style={s.whiteSub}>
                  {above
                    ? `Your claims history costs you about ${money(performance.ratingImpact)}/year more than an average employer your size — and that gap is exactly what claims management targets.`
                    : `You pay about ${money(Math.abs(performance.ratingImpact))}/year less than an average employer your size. Preventli helps you hold it there.`}
                </Text>
              </View>
              <View style={{ marginBottom: 18 }}>
                <Bar label="An average employer your size" value={performance.industryRatePremium} max={barMax} color={GRAY_LT} />
                <Bar label="You (current premium)" value={yourPremium} max={barMax} color={above ? AMBER : GREEN_DARK} valueColor={above ? AMBER : GREEN_DARK} />
              </View>
            </>
          ) : (
            <>
              <Text style={s.sectionLabel}>Your estimated premium</Text>
              <View style={s.heroNavy}>
                <Text style={s.heroLabel}>Estimated annual premium</Text>
                <Text style={s.bigAmount}>{money(premium.premium)}</Text>
                <Text style={s.whiteSub}>
                  + GST {money(premium.gst)} = {money(premium.premium + premium.gst)} inc. GST
                </Text>
              </View>
            </>
          )}

          {/* ---- The savings opportunity ---- */}
          <Text style={s.sectionLabel}>Your savings opportunity</Text>
          <View style={s.greenCard}>
            <Text style={s.cardTitle}>Lower your claims cost, lower your premium</Text>
            {savings.showSaving ? (
              <>
                <Text style={s.para}>
                  With Preventli managing your claims, your premium drops from{" "}
                  <Text style={s.bold}>{money(savings.baselinePremium)}</Text> to{" "}
                  <Text style={s.bold}>{money(savings.managedPremium)}</Text> — saving{" "}
                  <Text style={s.bold}>{money(savings.annualSaving)}/year</Text>{" "}
                  (about {money(savings.threeYearSaving)} over 3 years).
                </Text>
                <View style={{ marginTop: 10 }}>
                  <Bar label="Your premium now" value={savings.baselinePremium} max={barMax} color={NAVY_2} />
                  <Bar label="With Preventli" value={savings.managedPremium} max={barMax} color={GREEN_DARK} valueColor={GREEN_DARK} />
                </View>
                <Text style={[s.para, { marginTop: 10 }]}>
                  We don&apos;t cut your premium directly — we cut your claims cost (up to 40%*
                  for employers who already carry real claims costs), and lower claims flow
                  straight through to a lower premium.
                </Text>
              </>
            ) : (
              <Text style={s.para}>{savings.message}</Text>
            )}
          </View>

          {/* ---- Cost of one serious claim ---- */}
          {claimImpact && claimCost != null && claimImpact.showImpact && (
            <>
              <Text style={s.sectionLabel}>The cost of one serious claim</Text>
              <View style={s.card}>
                <Text style={s.cardTitle}>What one un-managed claim ({money(claimCost)}) could cost you</Text>
                <Text style={[s.para, { marginTop: 0, marginBottom: 6 }]}>
                  A serious claim raises your claims experience — and your premium — for about three years.
                </Text>
                <View style={[s.row, { borderBottomWidth: 0, paddingTop: 2 }]}>
                  <Text style={s.rowLabel}>Added to your premium over ~3 years</Text>
                  <Text style={s.impactValue}>+{money(claimImpact.threeYearImpact)}</Text>
                </View>
                <Text style={[s.para, { marginTop: 4 }]}>
                  That&apos;s roughly {(claimImpact.threeYearImpact / claimCost).toFixed(1)}× the
                  claim itself — a single claim inflates your premium for about three years, which
                  is exactly why early, well-managed return-to-work pays off.
                </Text>
                {claimImpact.capped && (
                  <Text style={s.capNote}>
                    WorkSafe caps the annual premium-rate rise at 30%, so a large claim&apos;s
                    impact is spread across the following years rather than hitting all at once.
                  </Text>
                )}
              </View>
            </>
          )}

          {/* ---- How this is calculated (credibility) ---- */}
          <Text style={s.sectionLabel}>How this is calculated</Text>
          <View style={s.cred}>
            <Text style={s.para}>
              <Text style={s.bold}>This report uses WorkSafe Victoria&apos;s own premium formula</Text> —
              the experience-rating engine WorkSafe uses to set every Victorian employer&apos;s premium.
              We start from your gazetted 2025-26 industry rate, compare your claims experience to your
              industry benchmark to get your performance rating, and scale it by your size. Our engine has
              been <Text style={s.bold}>validated to the dollar</Text> against WorkSafe&apos;s own published
              worked example, so the method behind these figures is accurate and reproducible — not a guess.
            </Text>
          </View>

          {/* ---- Important: figures can change (Paul's requirement) ---- */}
          <View style={s.caveat}>
            <Text style={s.caveatTitle}>Important — these figures can change</Text>
            <Text style={[s.para, { marginTop: 0 }]}>
              Your premium moves over time — with your <Text style={s.bold}>claims history</Text>, your{" "}
              <Text style={s.bold}>remuneration</Text>, and WorkSafe&apos;s{" "}
              <Text style={s.bold}>annually-gazetted rates</Text>. These figures are an accurate indicative
              estimate based on the WorkSafe simulator and current 2025-26 rates — they are not an official
              WorkSafe quote, and your actual premium is set by WorkSafe Victoria.
            </Text>
          </View>

          {/* ---- Next step ---- */}
          <View style={s.contact}>
            <Text style={s.contactTitle}>Want the real number, and a plan to bring it down?</Text>
            <Text style={s.contactBody}>
              Lisa and the Preventli team can review your actual claims history and show you exactly where
              the savings are. Get in touch at <Text style={s.contactEmail}>{CONTACT_EMAIL}</Text>.
            </Text>
          </View>
        </View>

        {/* ---- Fine print ---- */}
        <Text style={s.fine}>{ASTERISK_40}</Text>
        <Text style={s.fine}>{DISCLAIMER}</Text>
      </Page>
    </Document>
  );
}

/** Render the branded report to a PDF Buffer (server-side). */
export function renderPremiumReport(data: PremiumReportData): Promise<Buffer> {
  return renderToBuffer(<ReportDocument data={data} />);
}

export default ReportDocument;
