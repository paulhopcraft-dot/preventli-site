// Branded one-page PDF of a WorkCover premium estimate (spec §7).
//
// Renders server-side to a Buffer via @react-pdf/renderer — the lead route
// (POST /api/premium-lead) builds the result object, calls renderPremiumReport,
// and attaches the buffer to the prospect's Resend email.
//
// NO maths here. The report takes a fully-formed result object straight from
// the engine (the same values ResultPanel shows) and only formats them. The
// canonical disclaimer + 40% asterisk + size-aware guard are reproduced exactly
// as on the result panel so every surface says the same thing.

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
} from "../engine";

// Brand (spec §6). Inter isn't registered (no bundled font file) — Helvetica is
// the built-in fallback. ponytail: upgrade path = Font.register an Inter .ttf if
// brand-exact type matters in the PDF.
const NAVY = "#0A1628";
const GREEN = "#00E676";
const GREEN_DARK = "#00b85f";
const GRAY = "#6b7280";
const LIGHT = "#9ca3af";
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
  "their industry rate, and small employers on the flat rate, will see less. " +
  "Enter your figures for your own estimate.";

/** Everything the report renders — formed by the caller from engine output. */
export interface PremiumReportData {
  /** Annual rateable wages, $. */
  remuneration: number;
  /** Plain-English matched classification (from lookupIndustry). */
  industryDescription: string;
  wicCode: string;
  /** Annual claims cost used in the calc, $. */
  claimsCost: number;
  premium: ComputePremiumResult;
  savings: SavingsScenarioResult;
  /** Optional "true cost of a claim" panel for a chosen claim cost. */
  claimImpact?: ClaimImpactResult;
  /** The claim cost the impact panel was computed for, $. */
  claimCost?: number;
}

/** Whole-dollar AUD, e.g. "$368,275". */
function money(n: number): string {
  return n.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  });
}

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: NAVY,
    paddingTop: 40,
    paddingHorizontal: 44,
    paddingBottom: 40,
    lineHeight: 1.4,
  },
  // Header
  brandRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  brand: { fontSize: 18, fontFamily: "Helvetica-Bold", color: NAVY },
  brandDot: { color: GREEN_DARK },
  tagline: { fontSize: 8, color: GRAY, marginBottom: 16 },
  h1: { fontSize: 14, fontFamily: "Helvetica-Bold", marginBottom: 12 },
  // Section heading
  sectionLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: GREEN_DARK,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  // Generic row
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
  },
  rowLabel: { color: GRAY },
  rowValue: { fontFamily: "Helvetica-Bold" },
  // Premium hero
  hero: {
    backgroundColor: NAVY,
    color: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  heroLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: GREEN,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  heroAmount: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginTop: 4,
  },
  heroGst: { fontSize: 9, color: "#d1d5db", marginTop: 2 },
  // Savings block
  savings: {
    borderWidth: 1,
    borderColor: GREEN,
    backgroundColor: "#f0fff7",
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  savingsTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 6 },
  body: { color: "#374151" },
  bold: { fontFamily: "Helvetica-Bold", color: NAVY },
  // Claim impact
  card: {
    borderWidth: 0.5,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  cardTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 6 },
  impactValue: { fontFamily: "Helvetica-Bold", color: "#dc2626" },
  capNote: {
    backgroundColor: "#fffbeb",
    borderWidth: 0.5,
    borderColor: "#fde68a",
    borderRadius: 6,
    padding: 8,
    marginTop: 6,
    fontSize: 8,
    color: "#92400e",
  },
  // Contact
  contact: {
    backgroundColor: NAVY,
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
    color: "#ffffff",
  },
  contactTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#ffffff" },
  contactBody: { fontSize: 9, color: "#d1d5db", marginTop: 3 },
  contactEmail: { fontFamily: "Helvetica-Bold", color: GREEN },
  // Fine print
  fine: { fontSize: 7, color: LIGHT, marginTop: 8, lineHeight: 1.4 },
});

/** The react-pdf document. Pure presentation of the result object. */
function ReportDocument({ data }: { data: PremiumReportData }) {
  const { premium, savings, claimImpact, claimCost } = data;

  return (
    <Document
      title="WorkCover Premium Estimate — Preventli"
      author="Preventli"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.brandRow}>
          <Text style={styles.brand}>
            Preventli<Text style={styles.brandDot}>.</Text>
          </Text>
        </View>
        <Text style={styles.tagline}>
          30 years of WorkCover expertise. 3,000+ cases managed.
        </Text>
        <Text style={styles.h1}>Your WorkCover Victoria premium estimate</Text>

        {/* Inputs */}
        <Text style={styles.sectionLabel}>Your details</Text>
        <View style={{ marginBottom: 16 }}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Annual rateable wages</Text>
            <Text style={styles.rowValue}>{money(data.remuneration)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Industry</Text>
            <Text style={styles.rowValue}>
              {data.industryDescription} (WIC {data.wicCode})
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Annual claims cost</Text>
            <Text style={styles.rowValue}>{money(data.claimsCost)}</Text>
          </View>
        </View>

        {/* Premium hero */}
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>Estimated annual premium</Text>
          <Text style={styles.heroAmount}>{money(premium.premium)}</Text>
          <Text style={styles.heroGst}>
            + GST {money(premium.gst)} = {money(premium.premium + premium.gst)}{" "}
            inc. GST
          </Text>
        </View>

        {/* Savings (size-aware) */}
        <View style={styles.savings}>
          <Text style={styles.savingsTitle}>
            Lower your claims cost → lower your premium
          </Text>
          {savings.showSaving ? (
            <>
              <Text style={styles.body}>
                With Preventli managing your claims, your estimated premium
                drops from{" "}
                <Text style={styles.bold}>
                  {money(savings.baselinePremium)}
                </Text>{" "}
                to{" "}
                <Text style={styles.bold}>{money(savings.managedPremium)}</Text>{" "}
                — saving{" "}
                <Text style={styles.bold}>
                  {money(savings.annualSaving)}/year
                </Text>{" "}
                (~{money(savings.threeYearSaving)} over 3 years).
              </Text>
              <Text style={[styles.body, { marginTop: 6 }]}>
                We don&apos;t cut your premium directly — we cut your claims cost
                (up to 40%* for employers who already carry real claims costs),
                and lower claims flow straight into a lower premium.
              </Text>
            </>
          ) : (
            // Size-aware honesty guard — no saving figure for a flat-rate
            // (small) employer; the engine supplies the message.
            <Text style={styles.body}>{savings.message}</Text>
          )}
        </View>

        {/* Claim impact (optional) */}
        {claimImpact && claimCost != null && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              What one serious claim ({money(claimCost)}) could cost you
            </Text>
            {claimImpact.showImpact ? (
              <>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Premium before the claim</Text>
                  <Text style={styles.rowValue}>
                    {money(claimImpact.baselinePremium)}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Next-year premium</Text>
                  <Text style={styles.rowValue}>
                    {money(claimImpact.newPremium)}
                  </Text>
                </View>
                <View style={[styles.row, { borderBottomWidth: 0 }]}>
                  <Text style={styles.rowLabel}>
                    Total premium impact over ~3 years
                  </Text>
                  <Text style={styles.impactValue}>
                    +{money(claimImpact.threeYearImpact)}
                  </Text>
                </View>
                {claimImpact.capped && (
                  <Text style={styles.capNote}>
                    Capping applied — WorkSafe limits the annual premium-rate
                    rise to 30%. Without the cap it would be{" "}
                    {money(claimImpact.uncappedPremium)}; the remainder carries
                    into the following years.
                  </Text>
                )}
              </>
            ) : (
              <Text style={styles.body}>{claimImpact.message}</Text>
            )}
          </View>
        )}

        {/* Contact */}
        <View style={styles.contact}>
          <Text style={styles.contactTitle}>Want the real number?</Text>
          <Text style={styles.contactBody}>
            Lisa and the Preventli team can review your actual claims history and
            show you exactly where the savings are. Get in touch at{" "}
            <Text style={styles.contactEmail}>{CONTACT_EMAIL}</Text>.
          </Text>
        </View>

        {/* Fine print: 40% asterisk + canonical disclaimer */}
        <Text style={styles.fine}>{ASTERISK_40}</Text>
        <Text style={styles.fine}>{DISCLAIMER}</Text>
      </Page>
    </Document>
  );
}

/**
 * Render the branded estimate to a PDF Buffer (server-side).
 * Pass the same result object the result panel renders from.
 */
export function renderPremiumReport(data: PremiumReportData): Promise<Buffer> {
  return renderToBuffer(<ReportDocument data={data} />);
}

export default ReportDocument;
