#!/usr/bin/env node
// Generates the tiny placeholder PDF fixtures the capture harness uploads
// during the "batch job-description upload" shot (chapter 2). These are
// synthetic, generated documents — no real position description content,
// no real company. Each is a minimal but structurally valid single-page
// PDF (proper xref table, not a truncated/hand-waved one), built with no
// external dependency so the pipeline doesn't need a PDF library installed
// just to make three placeholder files.
//
// Usage:
//   node video-pipeline/capture/fixtures/generate-fixture-pdfs.mjs
//
// Re-run any time the fixtures directory is missing/cleaned; output is
// deterministic (byte-identical) for a given title list, so these are also
// safe to commit to git (a few hundred bytes each).

import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function makeMinimalPdf(title, bodyLines) {
  const lines = [title, "", ...bodyLines];
  const streamText = lines
    .map((line, i) => {
      const y = 740 - i * 20;
      const escaped = line.replace(/([()\\])/g, "\\$1");
      return `BT /F1 ${i === 0 ? 16 : 11} Tf 72 ${y} Td (${escaped}) Tj ET`;
    })
    .join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(streamText, "utf8")} >>\nstream\n${streamText}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((body, i) => {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xrefStart = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(pdf, "utf8");
}

const FIXTURES = [
  {
    file: "warehouse-operator-position-description.pdf",
    title: "Warehouse Operator — Position Description",
    body: [
      "Northgate Distribution Centre",
      "",
      "Manual handling up to 20kg, repetitive lifting, forklift-adjacent floor work,",
      "extended standing, occasional overhead reaching. Indoor warehouse environment.",
      "This is a synthetic placeholder document for onboarding-video capture only.",
    ],
  },
  {
    file: "forklift-driver-position-description.pdf",
    title: "Forklift Driver — Position Description",
    body: [
      "Northgate Distribution Centre",
      "",
      "Licensed counterbalance forklift operation, loading dock work, sustained",
      "seated/twisting posture, manual handling up to 25kg for load adjustment.",
      "This is a synthetic placeholder document for onboarding-video capture only.",
    ],
  },
  {
    file: "logistics-coordinator-position-description.pdf",
    title: "Logistics Coordinator — Position Description",
    body: [
      "Northgate Distribution Centre",
      "",
      "Primarily desk-based scheduling and dispatch coordination, with periodic",
      "floor walks across the warehouse. Low physical demand role.",
      "This is a synthetic placeholder document for onboarding-video capture only.",
    ],
  },
];

for (const { file, title, body } of FIXTURES) {
  const bytes = makeMinimalPdf(title, body);
  writeFileSync(path.join(__dirname, file), bytes);
  console.log(`[generate-fixture-pdfs] wrote ${file} (${bytes.length} bytes)`);
}
