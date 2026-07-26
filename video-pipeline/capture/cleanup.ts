#!/usr/bin/env -S npx tsx
/**
 * Deletes the "Northgate Distribution Centre" client (capture/lib/demo-data.ts's
 * NEW_CLIENT) if it exists, so chapter 2's "Add a client" shot can be
 * re-run against a clean slate. NOT run automatically by capture/run.ts —
 * run it explicitly between takes.
 *
 * The other nine seeded clients (and Coastline Aged Care Group) are never
 * touched — server/seed-demo-partner.ts is additive/idempotent for those;
 * this script only ever removes the ONE client this harness itself creates
 * live on camera.
 *
 * Usage (from preventli-site/):
 *   npx tsx video-pipeline/capture/cleanup.ts
 *
 * Selectors verified 2026-07-27 by reading `preventli` at origin/main
 * (aa9be4c): client/src/pages/PartnerWorkspace.tsx's delete-client button
 * (data-testid=`delete-client-${id}`) and its confirm dialog
 * (data-testid="confirm-delete-client"). NOT click-verified against a
 * running instance — see docs/video-pipeline.md.
 */
import { launchBrowser } from "./lib/recording";
import { ensureAuthenticatedState } from "./lib/auth";
import { DEFAULT_BASE_URL, NEW_CLIENT } from "./lib/demo-data";

async function main() {
  const browser = await launchBrowser(false);
  try {
    await ensureAuthenticatedState(browser); // writes/reuses storageState
    const context = await browser.newContext({
      storageState: (await import("./lib/recording")).AUTH_STATE_PATH,
    });
    const page = await context.newPage();
    await page.goto(`${DEFAULT_BASE_URL}/partner/clients`, { waitUntil: "networkidle" });

    const clientLink = page.getByText(NEW_CLIENT.name, { exact: false }).first();
    const exists = await clientLink.isVisible({ timeout: 5000 }).catch(() => false);
    if (!exists) {
      console.log(`[cleanup] "${NEW_CLIENT.name}" not present — nothing to clean up.`);
      await context.close();
      return;
    }

    // Hover the client row to reveal its delete icon (opacity-0 until
    // group-hover, per PartnerWorkspace.tsx).
    await clientLink.hover();
    const row = page.locator(`li:has-text("${NEW_CLIENT.name}"), div:has-text("${NEW_CLIENT.name}")`).first();
    const deleteButton = row.getByRole("button", { name: new RegExp(`Remove ${NEW_CLIENT.name}`, "i") });
    await deleteButton.click({ timeout: 5000 });
    await page.getByTestId("confirm-delete-client").click();
    await clientLink.waitFor({ state: "hidden", timeout: 10_000 });
    console.log(`[cleanup] Deleted "${NEW_CLIENT.name}".`);
    await context.close();
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("[cleanup] FAILED:", err);
  console.error(
    "[cleanup] If the selectors above don't match a live run, delete the client manually from the UI instead " +
      "of blocking on this script — it's a convenience, not a hard dependency of the capture harness.",
  );
  process.exit(1);
});
